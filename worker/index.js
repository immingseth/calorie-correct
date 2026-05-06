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

GROUND TRUTH:
- The userContext block (appended below this prompt) is THE current state of
  the user's day, pulled fresh on every message. Trust it over anything you
  said in previous replies.
- The user can delete, edit, or add entries between messages and you will not
  be notified. If your previous reply said they had logged 1,440 cal but
  todayIntakeCal now reads 800, they deleted something — go with the new number.
- todayMeals and todayExercises are arrays of the actual entries logged for
  today, each with a real id. Use those ids when the user asks you to edit
  or delete something.
- Never invent specific calorie totals, item names, or "you've got X left"
  numbers from memory — recompute from userContext every time.

RESPONSE FORMAT — you MUST always return a single valid JSON object, no other text.
The shape:

{
  "intent": "meal" | "exercise" | "edit" | "delete" | "log_recipe" | "save_recipe" | "question" | "ambiguous",
  "confidence": <number 0.0-1.0>,
  "summary": "<your conversational reply, 1-2 sentences usually>",
  "items":      [<food items, only if intent is meal>],
  "exercises":  [<exercise entries, only if intent is exercise>],
  "operations": [<ops, only if intent is edit/delete/log_recipe/save_recipe>]
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

For "exercise" intent, "exercises" is an array of objects with this shape:
{
  "type": "walking" | "running" | "cycling" | "swimming" | "strength" | "hiit" | "yoga" | "sport" | "other",
  "name": "<short description, e.g. 'Walk, 3 mph'>",
  "duration_min": <integer>,
  "calories_burned": <integer>,
  "note": "<optional 1-line context, can be empty string>"
}

For "delete" intent, "operations" is an array of:
{
  "action": "delete",
  "target_type": "meal" | "exercise",
  "target_id": <integer — must be a real id from todayMeals or todayExercises>
}

For "edit" intent, "operations" is an array of:
{
  "action": "update",
  "target_type": "meal" | "exercise",
  "target_id": <integer — must be a real id from todayMeals or todayExercises>,
  "changes": {
    // For meals (include only the fields that should change):
    "total_calories": <integer>,
    "time": "HH:MM",
    "meal_type": "breakfast" | "lunch" | "dinner" | "snack",
    // For exercises:
    "duration_min": <integer>,
    "calories_burned": <integer>,
    "type": "walking" | "running" | "cycling" | "swimming" | "strength" | "hiit" | "yoga" | "sport" | "other",
    "note": "<string>"
  }
}

For "log_recipe" intent, "operations" is an array of:
{
  "action": "log_recipe",
  "recipe_id": <integer — must be a real id from userContext.recipes>
}

For "save_recipe" intent, "operations" is an array of (use ONE of source_meal_id OR items, not both):
{
  "action": "save_recipe",
  "name": "<recipe name as the user wants to call it>",
  "source_meal_id": <integer | null — id of a meal in todayMeals to copy>,
  "items": [<full ingredient array — use this when building from scratch>] | null
}
For save_recipe "items", each ingredient has the same shape as a meal item:
{ "name", "portion", "calories", "protein_g", "carbs_g", "fat_g", "fiber_g" }

INTENT RULES:
- "meal": user described food/drink they ate or are about to eat. Examples:
  "turkey sandwich and an apple", "2 cups pinto beans 10 wasa crackers",
  "had a bagel for breakfast", "logging dinner: chicken stir fry".
- "exercise": user described physical activity they did or are doing. Examples:
  "30 min walk 3mi pace", "ran 5k", "1 hour yoga", "lifted weights for 45 min",
  "biked to work and back", "pickleball for an hour".
  → IMPORTANT: Calorie Correct logs exercise directly through Coach. There is
    no fitness tracker integration yet. NEVER tell the user to use a wearable
    or that exercise is handled elsewhere — just log it.
- "delete": user wants to remove an entry from today's log. Examples:
  "delete that walk", "remove the pasta entry", "I didn't actually eat that
  bagel", "scratch the last one". Match against todayMeals/todayExercises by
  name or context, then return the corresponding target_id.
- "edit": user wants to change an existing entry. Examples: "make the walk
  45 minutes not 30", "that pasta was 850 cal not 600", "actually that was
  breakfast not lunch". Include only the fields that should change.
- "log_recipe": user wants to log one of their existing recipes. Examples:
  "log my morning smoothie", "had my Greek bowl for breakfast", "smoothie".
  Match the user's wording against userContext.recipes by name (fuzzy match
  is fine — "smoothie" matches "Morning smoothie" if it's the only smoothie).
  If multiple recipes match, set intent to "ambiguous" and list options.
- "save_recipe": user wants to create or update a recipe. Two patterns:
  (a) Save the most recently logged meal as a recipe ("save this as my
      morning smoothie", "save that as my lunch"). Use source_meal_id from
      the most recent entry in todayMeals. Set "items" to null.
  (b) Build a recipe from scratch ("make a recipe called Greek bowl with
      200g Greek yogurt, 1 tbsp honey, 30g granola, 1/2 cup blueberries").
      Parse all ingredients with full macros, set "items" to that array.
      Set source_meal_id to null.
  If the user names an existing recipe, the frontend will replace it
  (so "update my morning smoothie to use 250g yogurt" is a save_recipe
  with the same name and the modified items).
- "question": user asked anything else — advice, status, plateaus, restaurants,
  weight fluctuations, trend, calibration math, motivation, etc.
- "ambiguous": you're not sure — ask a clarifying question in the summary.
- A single message is one intent. If a message mixes meal + exercise, pick the
  dominant one and ask in the summary if they also want to log the other.

DISAMBIGUATION FOR EDIT/DELETE:
- If the user references "the pasta" or "my walk" and exactly ONE matching
  entry exists in todayMeals/todayExercises, use it.
- If MULTIPLE entries match (e.g. two pasta entries today), set intent to
  "ambiguous" with empty operations and list the candidates in the summary
  so the user can pick. Example: "Found two pasta entries today — the 480-cal
  lunch at 12:30 or the 320-cal dinner at 19:00. Which one?"
- If ZERO entries match, set intent to "ambiguous" and say so plainly. Don't
  invent an id. Example: "No pasta logged today — are you thinking of a
  different day, or do you want to add one?"
- "the last one" or "that one" usually refers to the most recently logged
  entry (latest by time). If unclear, ask.
- NEVER fabricate an id. Only use ids that appear in todayMeals or todayExercises.

DISAMBIGUATION FOR LOG_RECIPE:
- Match against userContext.recipes by name. Be liberal with fuzzy matches —
  "smoothie" matches "Morning smoothie" if it's the only one. "log my usual"
  is too vague unless there's exactly one recipe.
- Multiple matches → ambiguous, list them. Zero matches → ambiguous, say so
  and offer to make a new recipe with that name.
- NEVER fabricate a recipe_id. Only use ids from userContext.recipes.

MEAL ESTIMATION:
- Estimate portions reasonably. Use standard USDA-ish values when known.
- If a portion is unspecified ("had a bagel"), assume one typical serving.
- Round calories to integers, macros to integers (round small fiber to nearest int).
- It's fine for items to have 0 for some macros (e.g. BBQ sauce has ~0g fiber).
- Don't fabricate certainty. If the user said "some chicken" without amount, pick
  4oz and note it in the portion ("~4 oz, estimated").

EXERCISE ESTIMATION:
- Map to the closest "type" from the list above. Use "other" only as a last resort.
- Use the user's current weight from context to scale calorie burn — heavier
  users burn more. If weight is unavailable, assume 165 lb.
- Rough cal/min at 150 lb (scale linearly with weight):
  walking casual ~3.5, walking brisk (3+ mph) ~4.5, running ~10-12 (pace-dependent),
  cycling ~6-10, swimming ~8-10, strength ~5-6, hiit ~10-12, yoga ~3, sport ~6-8.
- Be conservative. Exercise calorie estimates are notoriously inflated; under-
  estimate slightly rather than overestimate. The app's calibration corrects
  systematic error over time.
- Round duration_min and calories_burned to integers.

SUMMARY FOR MEALS:
- Brief, brand-aligned. Reference the total cal and the headline takeaway.
- Optionally mention macros if interesting (high protein, high fiber).
- If user has remaining calories info available, you can mention it.
- Don't list every item — that's what the structured items field is for.
- Examples:
  - "Logged 1,440 cal across 3 items — solid 38g protein. You've got 800 left for the day."
  - "330 cal, mostly carbs. Light enough for a snack."

SUMMARY FOR EXERCISE:
- Just log it. No congratulations, no "great job!", no moralizing.
- State the activity, duration, and estimated burn. One sentence is plenty.
- If the burn looks small relative to a typical day, it's fine to note that —
  but matter-of-factly, not discouragingly.
- Examples:
  - "30 min walk at 3 mph — about 165 cal logged. Goes into your calibration."
  - "Logged a 45 min strength session, ~225 cal."
  - "5k run, ~310 cal. Calibration will sort the rest."

SUMMARY FOR EDIT / DELETE:
- Confirm what changed in one short sentence. Reference the entry concretely.
- Don't pad. The action speaks for itself.
- Examples:
  - "Deleted the 30 min walk."
  - "Walk updated to 45 min, ~250 cal."
  - "Pasta moved to dinner."

SUMMARY FOR LOG_RECIPE / SAVE_RECIPE:
- log_recipe: confirm what was logged with cal total. "Logged morning smoothie — 420 cal."
- save_recipe (new): "Saved 'Morning smoothie' — 420 cal across 4 ingredients."
- save_recipe (update existing): "Updated 'Morning smoothie' — now 460 cal."
- Don't praise the user for setting it up. Just confirm.

SUMMARY FOR QUESTIONS:
- Use the user context if relevant (their actual numbers, recent trend, calibration).
- Stay tight. Lead with the answer, not throat-clearing.
- The brand voice is the most important thing.

CONFIDENCE:
- 0.9+ for clear-cut cases (typical meal/exercise description, clear question)
- 0.6-0.9 for plausible but underspecified ("had lunch", "did some cardio")
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

    // Daily greeting — fires once per day on first app open. Brand-aligned
    // morning briefing based on the user's actual data. Returns plain text.
    if (url.pathname === '/api/greeting' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch (e) { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }

      const userContext = body.userContext || {};
      const timeOfDay = body.timeOfDay || 'morning'; // optional client hint

      const greetingSystem = `You are Coach inside Calorie Correct. The user just opened the app for the first time today — write them a brief greeting.

Voice & guardrails (same as always):
- Matter-of-fact, brand-aligned, no pep talks. Treat the user like a smart adult.
- The scale is the ground truth. Calibration is automatic; never tell the user to log more carefully.
- No medical advice. Behavioral coaching only.

Greeting structure (weave naturally — don't bullet-list, don't headline-stack):
- Open with time-of-day + first name: "Good ${timeOfDay}, [name]."
- Lead on ONE thread that matters most based on their data:
  * trending down at a healthy rate (0.5-2.0 lb/wk): name the rate, brief affirmation
  * flat / stair-step trend: normalize it, note plateaus happen in steps
  * trending up: address without alarm (water/sodium/hormones), no panic
  * fresh user (<7 days data or no rate yet): welcoming, "we'll have a real trend soon"
- If yesterday was logged, optionally include a single line about how it landed (under/over/on-target).
- If consistency is high (80%+ days logged), optionally a brief callout.
- Optionally one practical orientation — usually "keep doing what you're doing" or "log lunch when you get there."

Output rules:
- 2-4 sentences total. Tight. No bullets. No hedging filler.
- Return ONLY the greeting text. No JSON, no quotes around it, no preamble.
- Use plain language. No emoji unless the user has used emoji.
- You can use <strong> for one or two emphasis moments (a key number) — sparingly.`;

      const userMessage = `Generate today's greeting based on this user context:\n${JSON.stringify(userContext, null, 2)}`;

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
            max_tokens: 250,
            system: greetingSystem,
            messages: [{ role: 'user', content: userMessage }],
          }),
        });
      } catch (e) {
        return jsonResponse({ error: 'Network error' }, 502, cors);
      }

      if (!anthropicResponse.ok) {
        const text = await anthropicResponse.text();
        return jsonResponse(
          { error: 'Anthropic API error', status: anthropicResponse.status, detail: text },
          502, cors
        );
      }

      const data = await anthropicResponse.json();
      const greeting = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim();

      return jsonResponse({ greeting, usage: data.usage || null }, 200, cors);
    }

    // Photo meal logging — accepts a base64 image, runs Claude vision,
    // returns the same structured meal JSON as /api/coach.
    if (url.pathname === '/api/parse-meal-photo' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch (e) { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }

      const imageData = body.imageData;
      const imageType = body.imageType || 'image/jpeg';
      if (!imageData || typeof imageData !== 'string') {
        return jsonResponse({ error: 'imageData (base64) is required' }, 400, cors);
      }
      // Strip a possible data URL prefix the frontend might leave on
      const base64 = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      const userContext = body.userContext || null;

      const photoSystem = `You are Coach inside Calorie Correct, looking at a photo of food the user just ate or is about to eat. Identify what's on the plate and estimate portions and macros.

${SYSTEM_PROMPT.split('RESPONSE FORMAT')[1] ? '' : ''}

RESPONSE FORMAT — return a single valid JSON object:
{
  "intent": "meal" | "ambiguous",
  "confidence": <0.0-1.0>,
  "summary": "<your conversational reply>",
  "items": [{ "name", "portion", "calories", "protein_g", "carbs_g", "fat_g", "fiber_g" }, ...]
}

Photo-specific guidance:
- Estimate portions from visual cues (plate size, item proportions, common serving sizes).
- It's fine to not be perfectly accurate — calibration absorbs imprecision. Don't refuse to estimate just because the photo isn't perfect.
- If the photo doesn't show food (e.g. blurry, wrong subject), set intent to "ambiguous" with a brief summary asking what they meant to log.
- For brand voice: matter-of-fact, no judgment, no pep talks.

SUMMARY for photo meals:
- Briefly describe what you see ("Looks like grilled chicken, rice, and steamed broccoli — about 620 cal.").
- Reference total cal and notable macros (high protein, high fiber).
- If user has remaining cal info available, you can mention it.
- 1-2 sentences total.`;

      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageType,
                data: base64,
              },
            },
            { type: 'text', text: 'What did I eat? Estimate calories and macros.' },
          ],
        },
        { role: 'assistant', content: '{' },
      ];

      let system = photoSystem;
      if (userContext) {
        system += `\n\nUser context:\n${JSON.stringify(userContext, null, 2)}`;
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
        return jsonResponse(
          {
            intent: 'ambiguous',
            confidence: 0.4,
            summary: rawText || "I couldn't read that photo. Try a different angle?",
            items: [],
            usage: data.usage || null,
            _parseError: true,
          },
          200, cors
        );
      }

      return jsonResponse(
        {
          intent: parsed.intent || 'meal',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
          summary: parsed.summary || '',
          items: Array.isArray(parsed.items) ? parsed.items : [],
          exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
          usage: data.usage || null,
        },
        200, cors
      );
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
        exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
        operations: Array.isArray(parsed.operations) ? parsed.operations : [],
        usage: data.usage || null,
      };

      return jsonResponse(result, 200, cors);
    }

    return jsonResponse({ error: 'Not found' }, 404, cors);
  },
};
