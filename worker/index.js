/* Calorie Correct — Coach Worker
 * Cloudflare Worker that proxies chat messages to the Anthropic API.
 *
 * Endpoints:
 *   GET  /api/health  — sanity check, returns { ok: true }
 *   POST /api/coach   — sends a message to Claude with context, returns the reply
 *
 * Body for /api/coach:
 *   {
 *     message: "what the user typed",
 *     history: [{ role: "user"|"assistant", content: "..." }, ...],
 *     userContext: { name, currentWeight, targetWeight, ... }    // optional snapshot
 *   }
 *
 * Returns:
 *   {
 *     reply: "Coach response text",
 *     model: "claude-haiku-4-5"
 *   }
 *
 * Secrets (set via `wrangler secret put`):
 *   ANTHROPIC_API_KEY — your Anthropic key, never committed.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;

// Coach voice + brand guardrails. Iterated as we ship; this is the v0 baseline.
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
- If asked about plateaus, restaurants, social events, weekly weigh-ins, drinks, or
  cravings: address the actual question with the user's data context if available.`;

// Allowed origins for CORS. We're public — this is fine since we're rate-limiting
// on the Worker side. The Worker is the only thing that can use the Anthropic key.
const ALLOWED_ORIGINS = [
  'https://caloriecorrect.com',
  'https://www.caloriecorrect.com',
  'http://localhost:8000',           // local browser testing
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
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Health check — easy way to verify the Worker is reachable
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return jsonResponse({ ok: true, model: MODEL }, 200, cors);
    }

    // Main coach endpoint
    if (url.pathname === '/api/coach' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
      }

      const userMessage = (body.message || '').trim();
      if (!userMessage) {
        return jsonResponse({ error: 'message is required' }, 400, cors);
      }

      const history = Array.isArray(body.history) ? body.history : [];
      const userContext = body.userContext || null;

      // Build the messages array for Anthropic.
      // We pass prior turns as context, plus the new user message.
      const messages = [];
      for (const turn of history) {
        if (turn && turn.role && turn.content) {
          messages.push({ role: turn.role, content: String(turn.content) });
        }
      }
      messages.push({ role: 'user', content: userMessage });

      // System prompt includes the user data snapshot if provided so Coach can reference it.
      let system = SYSTEM_PROMPT;
      if (userContext) {
        system += `\n\nUser context:\n${JSON.stringify(userContext, null, 2)}`;
      }

      // Call Anthropic
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
          502,
          cors
        );
      }

      const data = await anthropicResponse.json();
      // data.content is an array of blocks; we want the text blocks joined.
      const reply = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim();

      return jsonResponse(
        {
          reply,
          model: data.model || MODEL,
          usage: data.usage || null,
        },
        200,
        cors
      );
    }

    // Fall-through: 404
    return jsonResponse({ error: 'Not found' }, 404, cors);
  },
};
