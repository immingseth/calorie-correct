/* Calorie Correct — Coach Worker
 * Cloudflare Worker that proxies chat messages to the Anthropic API.
 *
 * Endpoints:
 *   GET  /api/health  — sanity check
 *   POST /api/coach   — sends a message to Claude with context, returns
 *                       a structured response (intent, summary, items)
 *
 * Claude returns one JSON shape regardless of intent:
 *   {
 *     "intent": "meal" | "question" | "ambiguous",
 *     "confidence": 0.0-1.0,
 *     "summary": "Coach's conversational reply",
 *     "items": [          // populated only when intent === "meal"
 *       {
 *         "name": "Pinto beans",
 *         "portion": "2 cups",
 *         "calories": 470,
 *         "protein_g": 29,
 *         "carbs_g": 90,
 *         "fat_g": 1.5,
 *         "fiber_g": 30
 *       }
 *     ]
 *   }
 *
 * Secrets (set via `wrangler secret put`):
 *   ANTHROPIC_API_KEY
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1200;

const SYSTEM_PROMPT = `You are Coach, the AI inside Calorie Correct — a calorie-tracking app whose
core promise is "honest calibration > obsessive precision."

Voice & guardrails:
- Matter-of-fact, brand-aligned, no pep talks. Treat the user like a smart adult.
- Lead with the math when relevant. The scale is the ground truth.
- Calibration is automatic — never tell the user they need to log more carefully.
  The product compensates for tracking imprecision.
- No medical advice. No clinical claims. Behavioral coaching only.
- Keep responses tight: 1-3 short paragraphs unless the user asks for depth.
- Use plain language, not chatbot filler. No emoji unless the user uses them first.

RESPONSE FORMAT — you MUST always return a single valid JSON object, no other text.
The shape:

{
  "intent": "meal" | "question" | "ambiguous",
  "confidence": <number 0.0-1.0>,
  "summary": "<your conversational reply, 1-2 sentences usually>",
  "items": [<array of food items, only if intent is meal>]
}

For "meal" intent, "items" is an array of objects with this shape:
{
  "name": "<food name>",
  "portion": "<natural-language portion like '2 cups' or '1 large'>",
  "calories": <integer>,
  "protein_g": <integer>,
  "carbs_g": <integer>,
  "fat_g": <integer>,
  "fiber_g": <integer>
}

INTENT RULES:
- "meal": user described food/drink they ate or are about to eat. Examples:
  "turkey sandwich and an apple", "2 cups pinto beans 10 wasa crackers",
  "had a bagel for breakfast", "logging dinner: chicken stir fry".
- "question": user asked anything else — advice, status, plateaus, restaurants,
  weight fluctuations, trend, calibration math, motivation, etc.
- "ambiguous": you're not sure — ask a clarifying question in the summary.

MEAL ESTIMATION:
- Estimate portions reasonably. Use standard USDA-ish values when known.
- If a portion is unspecified ("had a bagel"), assume one typical serving.
- Round calories to integers, macros to integers (round small fiber to nearest int).
- It's fine for items to have 0 for some macros (e.g. BBQ sauce has ~0g fiber).
- Don't fabricate certainty. If the user said "some chicken" without amount, pick
  4oz and note it in the portion ("~4 oz, estimated").

SUMMARY FOR MEALS:
- Brief, brand-aligned. Reference the total cal and the headline takeaway.
- Optionally mention macros if interesting (high protein, high fiber).
- If user has remaining calories info available, you can mention it.
- Don't list every item — that's what the structured items field is for.
- Examples:
  - "Logged 1,440 cal across 3 items — solid 38g protein. You've got 800 left for the day."
  - "330 cal, mostly carbs. Light enough for a snack."

SUMMARY FOR QUESTIONS:
- Use the user context if relevant (their actual numbers, recent trend, calibration).
- Stay tight. Lead with the answer, not throat-clearing.
- The brand voice is the most important thing.

CONFIDENCE:
- 0.9+ for clear-cut cases (typical meal description, clear question)
- 0.6-0.9 for plausible but underspecified ("had lunch")
- below 0.6 if you genuinely can't tell — set intent to "ambiguous"`;

const ALLOWED_ORIGINS = [
  'https://caloriecorrect.com',
  'https://www.caloriecorrect.com',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

/* Parse Claude's JSON output. We prefill the assistant turn with `{` so Claude
 * is guaranteed to start with JSON; we re-prepend that here. Returns null if
 * parsing fails so the caller can decide what to do. */
function parseClaudeJson(rawText) {
  const candidate = '{' + rawText.trim();
  // Sometimes Claude wraps in ``` fences despite instructions; strip them.
  const cleaned = candidate.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to recover: find the first { and the last matching }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try { return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)); }
      catch (e2) { return null; }
    }
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return jsonResponse({ ok: true, model: MODEL }, 200, cors);
    }

    if (url.pathname === '/api/coach' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch (e) { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }

      const userMessage = (body.message || '').trim();
      if (!userMessage) {
        return jsonResponse({ error: 'message is required' }, 400, cors);
      }

      const history = Array.isArray(body.history) ? body.history : [];
      const userContext = body.userContext || null;

      const messages = [];
      for (const turn of history) {
        if (turn && turn.role && turn.content) {
          messages.push({ role: turn.role, content: String(turn.content) });
        }
      }
      messages.push({ role: 'user', content: userMessage });
      // Prefill the assistant turn with `{` to lock Claude into JSON output.
      messages.push({ role: 'assistant', content: '{' });

      let system = SYSTEM_PROMPT;
      if (userContext) {
        system += `\n\nUser context (current state):\n${JSON.stringify(userContext, null, 2)}`;
      }

      let anthropicResponse;
      try {
        anthropicResponse = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system,
            messages,
          }),
        });
      } catch (e) {
        return jsonResponse({ error: 'Network error reaching Anthropic.' }, 502, cors);
      }

      if (!anthropicResponse.ok) {
        const text = await anthropicResponse.text();
        return jsonResponse(
          { error: 'Anthropic API error', status: anthropicResponse.status, detail: text },
          502, cors
        );
      }

      const data = await anthropicResponse.json();
      const rawText = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim();

      const parsed = parseClaudeJson(rawText);
      if (!parsed) {
        // JSON parsing failed — fall back to treating the whole reply as a question summary.
        return jsonResponse(
          {
            intent: 'question',
            confidence: 0.5,
            summary: rawText || "I couldn't quite parse that. Try rephrasing?",
            items: [],
            usage: data.usage || null,
            _parseError: true,
          },
          200, cors
        );
      }

      // Normalize the response shape so the frontend can rely on it.
      const result = {
        intent: parsed.intent || 'question',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
        summary: parsed.summary || '',
        items: Array.isArray(parsed.items) ? parsed.items : [],
        usage: data.usage || null,
      };

      return jsonResponse(result, 200, cors);
    }

    return jsonResponse({ error: 'Not found' }, 404, cors);
  },
};
