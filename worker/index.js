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

const SYSTEM_PROMPT = `You are Cal, the AI inside Calorie Correct — a calorie-tracking app that
gives users the closest possible numbers to reality by calibrating logged
intake and exercise against actual weight change over time. The brand is:
realistic net energy balance, useful for everyone — people losing weight,
people maintaining, athletes who need to fuel workouts, anyone trying to
match their calories to their goal. Exercise is treated as a first-class
part of the equation, not an afterthought. Your name is short for "calorie"
— lean into the on-the-nose, no-nonsense identity.

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

ANSWERING QUESTIONS ABOUT TODAY — required procedure:
When the user asks "how did I do today?", "what's my total?", "what could
I have done better?", "show me my macros", or any question that depends on
today's logged data, you MUST follow this order:

1. Read userContext.todayIntakeCal — that is THE current calorie total
   for today, recomputed every message. It supersedes anything you said
   in any previous reply.
2. Read userContext.todayMacros — that is THE current macro total.
3. Read userContext.todayMeals — that is THE current list of logged meals.
4. ONLY then reason about it.

Concrete rules:
- NEVER cite a calorie or macro total from your own prior reply. The user
  can (and routinely does) delete or edit entries between messages without
  telling you. Numbers in your chat history are stale the moment they're
  written. Trust ONLY userContext.
- If you previously said "2,250 cal" and userContext.todayIntakeCal is now
  1,845, the user deleted something. Just use 1,845 and move on. Don't
  apologize, don't note the change, don't draw attention to your earlier
  reply — that creates confusion.
- For commentary like "what could I have done better?", look at the items
  in userContext.todayMeals (which has actual current items, names, and
  cal counts) before suggesting changes. Don't reference items that aren't
  in the current list.
- If a number is asked for and userContext doesn't have it, say so plainly
  rather than reconstructing from memory.

USE THESE NUMBERS FROM userContext — don't recompute from memory:

NET CALORIES IS THE PRIMARY METRIC. The Today card in the app shows NET as
the signed energy balance for the day:

  NET = (calories in) − (calories out)
      = todayIntakeCal − todayTDEE
      = todayIntakeCal − (baselineTDEE + todayBurnCalDisplayed)

  Negative NET = under TDEE (deficit). Positive NET = over TDEE (surplus).

CRITICAL — NEVER do arithmetic on these numbers yourself. The exact NET
the user sees on the card is in userContext.todayNetCal. ALWAYS quote that
field directly. Do not recompute it. Do not add or subtract anything to
"verify" it. If you compute the math instead of reading it, you will be
wrong, the user will see a different number than you cite, and they will
lose trust.

When the user asks "show me the math", quote the exact field values and
let the math display itself:

  NET (todayNetCal) = -1,120
    intake (todayIntakeCal) = 2,345
    out = baselineTDEE (2,698) + burned (767) = todayTDEE (3,465)

If a number you want to cite isn't a field in userContext, do not use it.
Say "I don't have that number" rather than reconstructing.

- todayNetCal → the signed energy balance. THIS IS THE NUMBER TO LEAD WITH.
  Format with explicit sign: "−600 cal" for deficit, "+200 cal" for surplus.
- targetNetCal → the user's GOAL net. Negative for loss (e.g. −500 for
  1 lb/wk loss), 0 for maintenance, positive for gain. Compare todayNetCal
  to targetNetCal to answer "am I on track?":
    todayNetCal ≤ targetNetCal × 0.5 → on track or ahead
    targetNetCal × 0.5 < todayNetCal ≤ 0 → some deficit but light
    todayNetCal > 0 (and target < 0) → surplus on a deficit day
- todayIntakeCal → calories in (food), calibrated. This is the realistic
  estimate: logged intake divided by the user's foodAccuracy (their personal
  "I under-log by X%" setting). Use this number — it matches the Today card.
- todayIntakeCalLogged → raw logged food intake before calibration. Reference
  this only if the user asks something like "what did I actually log?"

FOOD ACCURACY MATH — pin this down to avoid getting it backwards:
- foodAccuracyPct represents how much of the user's REAL intake their logs
  capture. If foodAccuracyPct = 85, they log 85% of what they actually eat
  (BLT problem — bites, licks, tastes, oil they didn't measure, etc.).
- The calibrated intake INFLATES the raw log to estimate reality:
    todayIntakeCal = todayIntakeCalLogged / (foodAccuracyPct / 100)
- Direction (commit this to memory):
    HIGHER accuracy % → LESS inflation → LOWER calibrated intake → BIGGER deficit
    LOWER  accuracy % → MORE inflation → HIGHER calibrated intake → SMALLER deficit
- At 100% accuracy, no inflation is applied: todayIntakeCal == todayIntakeCalLogged.
- At 50% accuracy, calibrated intake is TWICE the logged value.

WHEN A USER ASKS "WHAT IF I WERE LOGGING AT 100% ACCURACY":
- 100%-accuracy intake = todayIntakeCalLogged (the raw logged number, no inflation)
- 100%-accuracy deficit = todayTDEE − todayIntakeCalLogged
- This will be a BIGGER deficit than what they currently see (because they
  log < 100% today, so their calibrated intake is higher, which makes the
  current deficit smaller).
- Worked example, foodAccuracyPct = 85, todayIntakeCalLogged = 2345, todayTDEE = 3465:
    current calibrated intake = 2345 / 0.85 = 2759
    current deficit = 3465 - 2759 = 706
    100%-accuracy intake = 2345 (no inflation)
    100%-accuracy deficit = 3465 - 2345 = 1120
    "At 100% accuracy your deficit would be 1,120 cal — bigger than today's
    706 cal because we wouldn't inflate your intake to account for under-logging."

WHEN A USER ASKS "WHAT IF MY ACCURACY WERE X% INSTEAD OF Y%":
- New calibrated intake = todayIntakeCalLogged / (X / 100)
- New deficit = todayTDEE − new calibrated intake
- Always write out the math step by step using the field names, never
  improvise the formula direction.
- todayTDEE → calories out total = baselineTDEE + exercise burn (after
  tracker accuracy discount). The "out" half. The Today card's second
  number can show this when toggled.
- todayBurnCalDisplayed → exercise burn after tracker accuracy discount.
  Component of TDEE. Use when discussing exercise specifically.
- todayBurnCalRaw → uncalibrated tracker estimate. Use only if explaining
  why displayed burn looks lower than the tracker reported.
- bmrCal → basal metabolic rate (Mifflin–St Jeor). Mostly invisible to
  users; mention only if asked or when explaining the math.
- todayMacros { protein, carbs, fat, fiber } → "how's my protein?" answer
  with actual gram totals. Rule of thumb: protein ≈ 0.8–1 g per lb of
  bodyweight for active users.
- todayWaterOz → hydration. Rough rule: half bodyweight in oz/day.
- todayNetDeficit → POSITIVE when in deficit (= TDEE − intake = −todayNetCal).
  Same magnitude as todayNetCal but flipped sign. Use whichever framing the
  user uses; they're the same concept.
- weeksToGoal, projectedGoalDate → "when will I hit my goal?" — the actual
  projection. Null projectedGoalDate means plateaued or gaining; say so plainly.
- rate7DayLbPerWk vs targetLossRateLbPerWk → pace status.
- lbsToGoal → how far from goal weight, signed.
- calibrationReady, observedAccuracyPct → if calibration is ready, the math
  has corrected for tracking imprecision.

NEVER cite "dailyTargetCal" as the user's target NET. dailyTargetCal is the
target food intake (BMR × activity − target deficit), which only matches
the user's mental model on zero-exercise days. Use targetNetCal for goal
comparisons.

CAL MEMORY — persistent notes about the user:
userContext.memories is an array of { id, text, addedDate } notes the user
has asked you to remember. Treat them as authoritative facts about the user.

How to use them:
- Reference memories naturally when relevant. "You mentioned biking 3-4
  days a week — that's already factored into your TDEE estimate." Don't
  list them all; pull the one that matches the current topic.
- If the user contradicts a memory ("I stopped biking last month"), gently
  treat it as an update and emit a remember intent with action: "remove" for
  the stale memory. Don't ask permission — they explicitly said it changed.
- Don't repeat memories back at the user constantly. Use them to inform
  better answers, not to demonstrate you remember.
- If the user says something that sounds like a stable fact about them
  ("I'm vegetarian", "I'm pregnant", "training for X") and they did NOT
  explicitly ask to remember, do NOT auto-save. You can OFFER once via
  an ambiguous intent: "Want me to remember that?" Don't keep asking on
  every turn.

ADDING MEMORIES — what to write:
- Keep text concise and noun-phrase-y. The user's input is the source of
  truth, but trim filler.
  User: "I'd like you to remember that I bike about 3 to 4 days a week"
  Memory text: "Bikes 3-4 days/wk"
  User: "FYI I'm training for a marathon in October"
  Memory text: "Training for a marathon in October 2026"
- Don't store contradictory memories. If a similar memory exists, prefer
  to remove the old one and add the new one in the same operations array.

GAPS IN TRACKING — handle gracefully, never moralize:
Real users miss days. Vacation, illness, fell off the wagon, busy week —
the system treats all of these the same. userContext exposes:
- currentLoggedStreak: consecutive logged days ending today (0 if today
  isn't logged yet, otherwise count back to last gap)
- trailingUnloggedDays: 1+ unlogged days ending today (any number)
- inActiveGap: true when trailingUnloggedDays >= 3. Calibration is PAUSED.
  Don't quote 7-day rate; rate7DayLbPerWk will be null.
- settlingDaysLeft: > 0 when the user just returned from a gap. Calibration
  uses fresh data after settlingDaysLeft = 0.
- recentGaps: last few notable gaps. Each has { start, end, days }.

How to behave:
- When inActiveGap: don't act surprised. Don't ask why. The user knows.
  Daily greeting on a gap day can simply say "ready to pick back up?"
  Don't push. Don't lecture. Don't say "you've been missing days."
- When the user returns from a gap (settlingDaysLeft > 0): a brief, neutral
  acknowledgment is fine on the FIRST greeting. "Welcome back. Rate's been
  paused — once you've got a few days back in, we'll pick the trend up."
  Don't repeat this on subsequent turns.
- Never say "you only ate 0 cal yesterday" — that's a missed day, not a
  diet. If todayIntakeCal is 0, the user simply hasn't logged yet.
- Never reference data inside a gap as if it's real. If the user asks
  "what did I eat last Tuesday" and Tuesday is inside a recentGap, just
  say "you didn't log that day" — don't speculate.
- When rate7DayLbPerWk is null because of a gap, say "rate's paused while
  you re-establish" — don't quote 0 or some made-up number.

EXERCISE BURN — RAW vs DISPLAYED:
- The app SHOWS users a "discounted" burn number, not the raw estimate. This
  is intentional and on-brand — fitness trackers and exercise estimators
  chronically over-report, so we apply the user's personal trackerAccuracy
  multiplier to give them an honest figure.
- userContext.todayBurnCalRaw       = sum of caloriesBurned across today's exercises (uncalibrated)
- userContext.todayBurnCalDisplayed = the number the user actually sees on the app (raw × trackerAccuracy)
- userContext.trackerAccuracyPct    = the user's tracker accuracy setting (e.g. 30 means trackers
                                       get scaled to 30% of their reported value)
- When a user asks "why is my burn so low?" or "I burned 39 cal but I just
  walked for 30 min" — they're looking at the displayed number. Explain that
  the app discounts tracker estimates to be honest, and show the math:
  raw 130 × 30% = 39 displayed. The displayed number is the one to trust for
  daily TDEE; the raw number is what the tracker reported.
- Don't tell users their data didn't sync or invent a "discrepancy." There is
  no discrepancy — both numbers are correct, they're just two views of the
  same thing.

RESPONSE FORMAT — you MUST always return a single valid JSON object, no other text.
The shape:

{
  "intent": "meal" | "exercise" | "weigh_in" | "log_water" | "edit" | "delete" | "log_recipe" | "save_recipe" | "remember" | "question" | "ambiguous",
  "confidence": <number 0.0-1.0>,
  "summary": "<your conversational reply, 1-2 sentences usually>",
  "date": "YYYY-MM-DD"  // optional, applies to meal/exercise intents — see DATE INFERENCE
  "items":      [<food items, only if intent is meal>],
  "exercises":  [<exercise entries, only if intent is exercise>],
  "operations": [<ops, only if intent is edit/delete/log_recipe/save_recipe/weigh_in/log_water>]
}

DATE INFERENCE:
- userContext.today is the current date in YYYY-MM-DD; userContext.yesterday is the day before.
- If the user mentions a date or relative time, set "date" on the response (or
  per-item/per-op if only some items have a different date) accordingly:
    "this morning" / "today" / no time mention → today (or omit "date")
    "yesterday" / "last night" → yesterday
    "Monday", "Tuesday", etc. → most recent past occurrence of that weekday
    "3 days ago" / "last Friday" → resolve to the absolute date
- Always emit a real YYYY-MM-DD string. Never use words like "yesterday" in
  the date field — resolve them yourself before responding.
- For meal intent: top-level "date" applies to the whole meal log.
- For exercise intent: top-level "date" is the default; each exercise entry
  may override with its own "date".
- For weigh_in / log_water: the date lives inside each operation (see below).

COPY PATTERNS — same as another day:
When the user says things like "yesterday I ate the same as today",
"today I had the same breakfast as yesterday", "duplicate my Monday lunch
to today" — this is a MEAL INTENT (or exercise intent), full stop. The
intent field MUST be "meal" (not "question"). Items MUST be populated.
A summary that says "logged" without populating items is a BUG — the
frontend won't actually log anything.

How to do it:
1. Identify the SOURCE day's entries from userContext.todayMeals or
   userContext.yesterdayMeals — both arrays include full items with macros.
2. Build the items array by COPYING from source verbatim:
     {
       "name": <source.items[i].name>,
       "portion": <source.items[i].portion>,
       "calories": <source.items[i].calories>,
       "protein_g": <source.items[i].protein_g>,
       "carbs_g": <source.items[i].carbs_g>,
       "fat_g": <source.items[i].fat_g>,
       "fiber_g": <source.items[i].fiber_g>
     }
   Do NOT re-estimate. The numbers are right there in userContext.
3. Set the response "date" field to the TARGET day's YYYY-MM-DD.
4. Set "intent": "meal", "confidence": 0.9, "summary": one short confirmation.
5. If source has multiple meals and user wants the whole day copied, FLATTEN
   all items from all source meals into the single items array.
6. For partial copies ("same lunch as yesterday"), filter source meals by
   mealType before copying.

Example:
- userContext.yesterdayMeals = [] (empty)
- userContext.todayMeals = [{ id: 1, mealType: "lunch", items: [
    {name:"chicken", portion:"4 oz", calories:180, protein_g:35, carbs_g:0, fat_g:4, fiber_g:0},
    {name:"rice", portion:"1 cup", calories:200, protein_g:4, carbs_g:45, fat_g:0, fiber_g:1}
  ], totalCal: 380 }]
- User: "yesterday I had the same as today"
- Correct response:
  {
    "intent": "meal", "confidence": 0.9,
    "date": "<userContext.yesterday>",
    "summary": "Copied today's meals to yesterday — 380 cal.",
    "items": [
      {"name":"chicken","portion":"4 oz","calories":180,"protein_g":35,"carbs_g":0,"fat_g":4,"fiber_g":0},
      {"name":"rice","portion":"1 cup","calories":200,"protein_g":4,"carbs_g":45,"fat_g":0,"fiber_g":1}
    ]
  }

If the source day has NO entries, set intent to "ambiguous" with empty
items and ask plainly: "I don't see anything logged for today — what did
you have?"

DO NOT just write a conversational summary that claims you logged something
without actually populating items. That is the most common failure mode and
it confuses users.

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

For "weigh_in" intent, "operations" is an array of:
{
  "action": "weigh_in",
  "weight": <number — pounds, between 50 and 600>,
  "date": "YYYY-MM-DD"  // optional, defaults to today
}
One weight per date — logging the same date again replaces the prior value.

For "log_water" intent, "operations" is an array of:
{
  "action": "log_water",
  "ounces": <integer — fluid ounces>,
  "date": "YYYY-MM-DD"  // optional, defaults to today
}
Multiple water entries per day are fine; they accumulate.

For "remember" intent, "operations" is an array of:
{
  "action": "add",
  "text": "<the fact to remember, concise: 'bikes 3-4 days/wk', 'allergic to peanuts', 'training for marathon Oct 2026'>"
}
or:
{
  "action": "remove",
  "id": <integer — must be from userContext.memories>,  // preferred
  "text": "<descriptive text matching the memory to remove>"  // alternative if id unknown
}
Memories live in userContext.memories as { id, text, addedDate }.
Keep added text short and noun-phrase-y. Strip filler ("I'd like you to remember
that I…" → just "bikes 3-4 days/wk").

INTENT RULES:
- "meal": user described food/drink they ate or are about to eat. Examples:
  "turkey sandwich and an apple", "2 cups pinto beans 10 wasa crackers",
  "had a bagel for breakfast", "logging dinner: chicken stir fry".
- "exercise": user described physical activity they did or are doing. Examples:
  "30 min walk 3mi pace", "ran 5k", "1 hour yoga", "lifted weights for 45 min",
  "biked to work and back", "pickleball for an hour".
  → IMPORTANT: Calorie Correct logs exercise directly through Cal. There is
    no fitness tracker integration yet. NEVER tell the user to use a wearable
    or that exercise is handled elsewhere — just log it.
- "weigh_in": user is reporting a weight reading. Examples: "184.2 this morning",
  "weighed in at 178", "I'm 200 lb today", "yesterday I was 184 even".
  Always extract a number; reject vague ones ("I lost a few pounds" is not a
  weigh_in — that's a question).
- "log_water": user is logging water intake. Examples: "had 32 oz water",
  "drank a 16 oz bottle", "16 oz of water", "log 24 oz".
- "remember": user wants Cal to remember a persistent fact about them.
  Triggers: "remember that…", "remember this…", "keep in mind…", "FYI I'm…",
  or "I want you to know…". Also: "forget X", "you can forget about Y",
  "remove the marathon thing" → action: "remove".
  Examples that should be "remember" intent:
    "remember that I bike 3-4 days a week"
    "I'm training for a marathon in October — remember that"
    "FYI I'm allergic to peanuts"
    "forget the marathon thing, race got cancelled"
  When the user mentions a strong life-context signal in passing without
  asking you to remember (e.g. "I'm cutting until July"), DO NOT auto-save.
  Stay in question/answer mode and let them ask explicitly. The exception:
  if it directly affects today's calibration question, you can offer once
  ("want me to remember that?") via an "ambiguous" intent with the question
  in the summary.
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

SUMMARY FOR REMEMBER:
- Add: "Got it — saved." or "Noted: bikes 3-4 days/wk."
- Remove: "Forgot the marathon thing." or "Removed."
- Update (remove + add together): "Updated — was 'bikes 3-4 days/wk', now 'bikes 5-6 days/wk'."
- Don't be effusive. The user can re-check via Settings → Cal memory.

SUMMARY FOR WEIGH_IN:
- One short line. Reference the number and (if not today) the date.
- If the new weight is a multi-week low or high, you can note it neutrally
  ("That's the lowest in 14 days.") — but no celebrations, no "great job."
- Examples:
  - "Logged 184.2 lb for today."
  - "Yesterday's weight set to 184.0."

SUMMARY FOR LOG_WATER:
- One short line confirming the amount and the running total for the day.
- "16 oz logged. 48 oz so far today."
- "32 oz, that's 80 oz for the day."

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

/* ============================================================
   AUTH — magic-link email + Google OAuth, sessions stored in D1
   ============================================================
   The frontend lives on caloriecorrect.com (different origin from this
   worker), so we use bearer tokens in localStorage rather than HttpOnly
   cookies. The flow:
   1. User signs in via magic link or Google.
   2. Worker creates a session row in D1, returns a random session_token.
   3. Frontend saves the token in localStorage and includes it as
      Authorization: Bearer <token> on every authenticated request.
   4. Worker validates by looking up the token in D1 sessions.
   5. Sliding expiry: each authenticated request bumps last_active_at.
*/
const APP_ORIGIN = 'https://caloriecorrect.com';
const AUTH_PAGE = `${APP_ORIGIN}/auth.html`;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;  // 30 days
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;         // 15 minutes
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;        // 10 minutes

function nowMs() { return Date.now(); }

/* Cryptographically-secure random hex string. 32 bytes = 256-bit token. */
function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* Pull bearer token from "Authorization: Bearer <token>" header. */
function bearerToken(req) {
  const h = req.headers.get('Authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

function normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

/* HMAC-SHA256 for signing OAuth state (CSRF protection). Returns hex. */
async function hmacSign(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* OAuth state — base64url(JSON{returnTo,issuedAt}) + truncated HMAC. */
async function makeOAuthState(secret, returnTo) {
  const payload = JSON.stringify({ r: returnTo, t: nowMs() });
  const b64 = btoa(payload).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const sig = await hmacSign(secret, b64);
  return `${b64}.${sig.slice(0, 32)}`;
}

async function verifyOAuthState(secret, state) {
  const [b64, sig] = String(state || '').split('.');
  if (!b64 || !sig) return null;
  const expected = await hmacSign(secret, b64);
  if (expected.slice(0, 32) !== sig) return null;
  try {
    const payload = JSON.parse(atob(b64.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.t !== 'number') return null;
    if (nowMs() - payload.t > OAUTH_STATE_TTL_MS) return null;
    return payload;
  } catch (e) { return null; }
}

/* D1 — find an existing user by google_id or email; create one if neither
 * matches. Updates last_seen_at on every call. Returns the user row. */
async function findOrCreateUser(env, { email, name, googleId }) {
  const e = normalizeEmail(email);
  const now = nowMs();
  if (googleId) {
    const r = await env.DB.prepare('SELECT * FROM users WHERE google_id = ?').bind(googleId).first();
    if (r) {
      await env.DB.prepare('UPDATE users SET last_seen_at = ?, email = ? WHERE id = ?')
        .bind(now, e, r.id).run();
      r.email = e;
      r.last_seen_at = now;
      return r;
    }
  }
  const byEmail = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(e).first();
  if (byEmail) {
    if (googleId && !byEmail.google_id) {
      await env.DB.prepare('UPDATE users SET google_id = ?, last_seen_at = ? WHERE id = ?')
        .bind(googleId, now, byEmail.id).run();
      byEmail.google_id = googleId;
    } else {
      await env.DB.prepare('UPDATE users SET last_seen_at = ? WHERE id = ?').bind(now, byEmail.id).run();
    }
    byEmail.last_seen_at = now;
    return byEmail;
  }
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO users (id, email, name, google_id, plan, created_at, last_seen_at)
    VALUES (?, ?, ?, ?, 'free', ?, ?)
  `).bind(id, e, name || null, googleId || null, now, now).run();
  return { id, email: e, name: name || null, google_id: googleId || null, plan: 'free', created_at: now, last_seen_at: now };
}

/* D1 — issue a new session token for a user. */
async function createSession(env, userId, userAgent) {
  const token = randomToken(48);
  const now = nowMs();
  const expires = now + SESSION_TTL_MS;
  await env.DB.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at, last_active_at, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(token, userId, now, expires, now, userAgent || null).run();
  return token;
}

/* D1 — given a bearer token, return the associated user (or null).
 * Refreshes last_active_at on hit to support sliding expiry. */
async function getSessionUser(env, token) {
  if (!token) return null;
  const now = nowMs();
  const row = await env.DB.prepare(`
    SELECT u.* FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > ?
  `).bind(token, now).first();
  if (!row) return null;
  await env.DB.prepare('UPDATE sessions SET last_active_at = ? WHERE token = ?')
    .bind(now, token).run();
  return row;
}

/* Resend — send a magic-link sign-in email. */
async function sendMagicLinkEmail(env, email, magicToken) {
  const link = `${AUTH_PAGE}?magic=${magicToken}`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 32px auto; padding: 0 16px; color: #2C2826;">
<h2 style="font-family: Georgia, serif; color: #446957; margin-bottom: 8px;">Sign in to Calorie Correct</h2>
<p>Click the button below to sign in. The link is valid for 15 minutes.</p>
<p style="margin: 24px 0;"><a href="${link}" style="display: inline-block; background: #446957; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;">Sign in to Calorie Correct</a></p>
<p style="font-size: 12px; color: #8A8278;">Or paste this link into your browser:<br><a href="${link}" style="color: #446957; word-break: break-all;">${link}</a></p>
<hr style="border: none; border-top: 1px solid #ECE5D8; margin: 32px 0;" />
<p style="font-size: 11px; color: #8A8278;">If you didn't request this, you can ignore this email.<br>— Cal at Calorie Correct</p>
</body></html>`;
  const text = `Sign in to Calorie Correct\n\nClick the link below to sign in. Valid for 15 minutes.\n\n${link}\n\nIf you didn't request this, you can ignore this email.\n\n— Cal at Calorie Correct`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Cal at Calorie Correct <hi@caloriecorrect.com>',
      to: [email],
      subject: 'Sign in to Calorie Correct',
      html, text,
    }),
  });
  if (!res.ok) {
    return { error: `Resend ${res.status}: ${await res.text()}` };
  }
  return { ok: true };
}

/* Strip private fields before returning a user to the client. */
function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    plan: u.plan,
    createdAt: u.created_at,
  };
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

    // ============ AUTH ENDPOINTS ============

    // POST /api/auth/email-link — generate a magic link and email it via Resend.
    // Body: { email }. Always returns ok=true even if email doesn't exist
    // (don't leak which addresses are registered).
    if (url.pathname === '/api/auth/email-link' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch (e) { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }

      const email = normalizeEmail(body.email);
      if (!isValidEmail(email)) {
        return jsonResponse({ error: 'Enter a valid email address.' }, 400, cors);
      }

      const token = randomToken(32);
      const now = nowMs();
      const expires = now + MAGIC_LINK_TTL_MS;

      try {
        await env.DB.prepare(`
          INSERT INTO magic_links (token, email, created_at, expires_at)
          VALUES (?, ?, ?, ?)
        `).bind(token, email, now, expires).run();
      } catch (e) {
        return jsonResponse({ error: 'Database error', detail: String(e) }, 500, cors);
      }

      const send = await sendMagicLinkEmail(env, email, token);
      if (send.error) {
        return jsonResponse({ error: 'Could not send email', detail: send.error }, 502, cors);
      }
      return jsonResponse({ ok: true }, 200, cors);
    }

    // POST /api/auth/verify — exchange a magic-link token for a session.
    // Body: { token }. Returns { session_token, user } on success.
    // Single-use: the magic link is invalidated after first redemption.
    if (url.pathname === '/api/auth/verify' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch (e) { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }

      const token = String(body.token || '').trim();
      if (!token) return jsonResponse({ error: 'Token required' }, 400, cors);

      const now = nowMs();
      const link = await env.DB.prepare('SELECT * FROM magic_links WHERE token = ?').bind(token).first();
      if (!link) return jsonResponse({ error: 'Invalid sign-in link.' }, 401, cors);
      if (link.used_at) return jsonResponse({ error: 'This link has already been used.' }, 401, cors);
      if (link.expires_at < now) return jsonResponse({ error: 'This link has expired. Request a new one.' }, 401, cors);

      await env.DB.prepare('UPDATE magic_links SET used_at = ? WHERE token = ?').bind(now, token).run();

      const user = await findOrCreateUser(env, { email: link.email });
      const sessionToken = await createSession(env, user.id, request.headers.get('User-Agent'));
      return jsonResponse({ session_token: sessionToken, user: publicUser(user) }, 200, cors);
    }

    // GET /api/auth/google — start Google OAuth. Redirects to Google.
    if (url.pathname === '/api/auth/google' && request.method === 'GET') {
      const state = await makeOAuthState(env.SESSION_SECRET, AUTH_PAGE);
      const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: `${url.origin}/api/auth/google/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        access_type: 'online',
        prompt: 'select_account',
      });
      return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, 302);
    }

    // GET /api/auth/google/callback — Google sends user back here with a code.
    // Exchange for tokens, decode the id_token to get email/name/sub,
    // find-or-create user, mint a session, redirect to auth.html with the
    // session token in the URL fragment so the SPA can stash it.
    if (url.pathname === '/api/auth/google/callback' && request.method === 'GET') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const verifiedState = await verifyOAuthState(env.SESSION_SECRET, state);
      if (!verifiedState) return new Response('Invalid OAuth state.', { status: 400 });
      if (!code) return new Response('Missing authorization code.', { status: 400 });

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${url.origin}/api/auth/google/callback`,
          grant_type: 'authorization_code',
        }),
      });
      if (!tokenRes.ok) {
        const detail = await tokenRes.text();
        return new Response(`Google token exchange failed: ${detail}`, { status: 502 });
      }
      const tokens = await tokenRes.json();
      const idToken = tokens.id_token;
      if (!idToken) return new Response('Missing id_token from Google.', { status: 502 });

      let payload;
      try {
        const payloadB64 = idToken.split('.')[1];
        payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
      } catch (e) {
        return new Response('Could not decode id_token.', { status: 502 });
      }

      if (!payload.email) return new Response('Google did not return an email.', { status: 502 });

      const user = await findOrCreateUser(env, {
        email: payload.email,
        name: payload.name || payload.given_name,
        googleId: payload.sub,
      });
      const sessionToken = await createSession(env, user.id, request.headers.get('User-Agent'));

      // Redirect to auth.html with session token in the URL fragment.
      // Fragments aren't sent to servers and don't appear in standard logs.
      return Response.redirect(`${AUTH_PAGE}#session=${sessionToken}`, 302);
    }

    // GET /api/auth/me — return the current user (requires Bearer token).
    if (url.pathname === '/api/auth/me' && request.method === 'GET') {
      const user = await getSessionUser(env, bearerToken(request));
      if (!user) return jsonResponse({ error: 'Not authenticated' }, 401, cors);
      return jsonResponse({ user: publicUser(user) }, 200, cors);
    }

    // POST /api/auth/logout — invalidate the current session.
    if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
      const token = bearerToken(request);
      if (token) {
        await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
      }
      return jsonResponse({ ok: true }, 200, cors);
    }

    // Daily greeting — fires once per day on first app open. Brand-aligned
    // morning briefing based on the user's actual data. Returns plain text.
    if (url.pathname === '/api/greeting' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch (e) { return jsonResponse({ error: 'Invalid JSON' }, 400, cors); }

      const userContext = body.userContext || {};
      const timeOfDay = body.timeOfDay || 'morning'; // optional client hint

      const greetingSystem = `You are Cal inside Calorie Correct. The user just opened the app for the first time today — write them a brief greeting.

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

      const photoSystem = `You are Cal inside Calorie Correct, looking at a photo of food the user just ate or is about to eat. Identify what's on the plate and estimate portions and macros.

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
      // NOTE: top-level `date` is preserved — used for copy/back-log patterns
      // ("yesterday I had the same as today" → meal intent with date=yesterday).
      const result = {
        intent: parsed.intent || 'question',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
        summary: parsed.summary || '',
        date: typeof parsed.date === 'string' ? parsed.date : null,
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
