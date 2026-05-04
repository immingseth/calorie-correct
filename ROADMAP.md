# Calorie Correct — Roadmap & Design Vision

**Status:** v1 shipped (Cycles 1-7 + Cycle Personal). Currently designing v2 — the AI-native logging experience.

This doc captures the strategic direction, architecture, and decisions for the next major phase. The earlier roadmap (`Calorie_Correct_Roadmap.docx`) covers the build history through Cycle Personal.

---

## The thesis

> *"Just tell us what you ate. Don't worry about getting it exact — your weight will."*

That sentence is the whole product. Two halves:

1. **The interface is forgiving.** Speak, type, photograph, ramble — Claude figures it out and turns it into structured data.
2. **The math is honest.** Whatever Claude got wrong, the calibration loop fixes within two weeks, because we use weight trend as ground truth — not log precision.

Other AI calorie apps (Cal AI, Nutrola, SnapCalorie) sell *accuracy*. They claim 4% error on photos. They're trapped: if their accuracy is wrong, their value collapses. We sell *forgiveness* — accuracy doesn't matter, calibration absorbs it. That's a stronger brand position than anyone else has.

---

## Why this works (and why no one else has done it)

The leading apps have a database management problem:
- **MyFitnessPal:** 20M crowdsourced entries, mostly garbage, slow search, friction-heavy logging.
- **Cronometer:** ~150K manually verified, excellent quality, but DB-search-and-pick is still the friction.
- **MacroFactor:** ~50K curated, gradual growth, slick UX but still database-driven.
- **Cal AI / Nutrola:** AI-first, but sell precision (they claim ±4% photo accuracy), trapped by their own promise.

We don't have a database problem because Claude's training data IS the database. Static cache for common foods (instant + free), Claude API for the long tail. As users log, the cache grows — after 6 months we own a curated DB of foods real people actually eat.

The differentiator: *we are the only AI logger with calibration as a backstop.* Everyone else either trusts user precision (MFP/Cronometer) or trusts AI precision (Cal AI). We trust neither — we trust the scale.

---

## The unified input experience (v2 design)

Today's view becomes the Diary view (see "Diary view + date navigation" below). The visual sketch:

```
                    Good morning, Joe.
                    🔥 12-day streak

[Stats row: weight / change / 7-day rate / net today]

╭──────────────────────────────────────────────╮
│  Tell us what you ate, did, or weighed:      │
│  ┌──────────────────────────────────────┐   │
│  │                            🎙  📷  ⏎ │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Quick from your day:                        │
│  [Greek yogurt] [Coffee] [30 min walk]       │
╰──────────────────────────────────────────────╯

Today  ◀  ▶              [📅]
─────────────────────────────────
🌅 Breakfast                    300 cal · 18g protein
   Greek yogurt with berries        220
   Coffee with cream                  80

🌞 Lunch — not logged yet
   [Quick add]

🌆 Dinner — not logged yet
   [Quick add]

🌙 Snacks — not logged yet
   [Quick add]

🏃 Activity
   30 min walk                  +110 cal burned

📝 Note for today
   [Anything special about today...]
```

One input handles everything. Diary auto-organizes by meal type. Quick chips show recent items the user actually eats. Streak shown for habit feedback.

The user types or speaks *"turkey sandwich and an apple"* — Claude returns structured data — it lands in lunch (because it's 12:30pm). They say *"ran 30 minutes"* — it lands in Activity. They say *"weighed 188.4 this morning"* — it goes to Weight. Photo of plate — same pipe, different input mode.

The user never picks "is this a meal or exercise" — Claude infers from what they said.

---

## How Claude figures out intent

The system prompt to Claude includes:
- Current time of day
- The user's recent logging patterns (from local data)
- The user input (text, photo, or transcribed voice)

Claude returns structured JSON:

```json
{
  "intent": "meal" | "exercise" | "weight" | "note" | "ambiguous",
  "confidence": 0.94,
  "items": [
    {
      "name": "Greek yogurt with berries",
      "calories": 220,
      "protein_g": 18,
      "carbs_g": 24,
      "fat_g": 4,
      "estimated_portion": "1 cup",
      "confidence": 0.85
    }
  ],
  "meal_type": "breakfast" | "lunch" | "snack" | "dinner",
  "duration_min": null,
  "weight_lb": null,
  "summary": "Logged Greek yogurt and coffee as breakfast. ~300 cal."
}
```

If `confidence < 0.6` or `intent === "ambiguous"`, the UI surfaces a clarifying chip ("Did you mean: log meal · log exercise · weigh in?"). If confidence is high, it just lands and shows a confirmation toast with undo. The user can always edit any logged item — Claude's estimate is a starting point, not the final word.

---

## Diary view + date navigation

**Rename "Today" → "Diary".** The view becomes time-aware: shows today by default, but can navigate to any past day.

UX:
- `◀ Today ▶` arrows for prev/next day
- Calendar icon `📅` opens a month picker for jumping to specific dates
- Today's text reads "Today" — yesterday reads "Yesterday" — earlier reads "Monday, May 4" or relative like "Last Thursday" within ~7 days
- The view's content (meals, activity, weight, note) is scoped to the selected date
- Logging while on a past day adds entries to that day (handles "I forgot to log lunch yesterday")
- Stats row at top stays scoped to the selected day — current weight is the most recent prior to that date

**Why this matters:**
- Matches MFP/Cronometer's date navigation pattern (familiar to users)
- Replaces our existing "day detail modal" (more discoverable than clicking a row in the weight log)
- Supports the realistic logging behavior: "I forgot Sunday dinner, let me back-fill"
- Sets up future features (week view, comparison views)

**Implementation notes:**
- New `selectedDate` state variable, defaults to today
- All renderers parametrize on `selectedDate`
- Logging actions write to `selectedDate`, not `todayISO()`
- Charts/Trend stay focused on overall trend, not selected date
- The day-detail modal becomes the diary view itself

---

## Wearable integration

Wearables and Claude AI logging are non-overlapping. Claude handles food (imprecise — user describes what they ate). Wearables handle movement (precise — steps, heart rate, workout duration). Together they cover both halves of energy balance.

### What we can integrate

| Source | Reachability from web app | Data we get |
|---|---|---|
| **Fitbit** | Web API (OAuth) — feasible | Steps, active minutes, sleep, weight (if smart-scale connected) |
| **Strava** | Web API (OAuth) — feasible | Workouts: distance, duration, pace, type |
| **Garmin** | Connect IQ Health API (OAuth) — feasible | Same as Fitbit, plus HRV, training load |
| **Apple Watch / Apple Health** | Hard — locked to iOS native apps | Everything; needs PWA + native bridge OR user-driven export |
| **Withings / Oura** | Web APIs — feasible | Sleep, weight, HRV |

**The Apple workaround:** rely on the user's Apple Watch syncing to *another* connected service first (most users have Apple Watch → Strava or Fitbit already). We sync from that downstream source.

### How it works with AI logging

Current state (manual): user types or taps a preset → calorie burn estimated locally.

Future state (with wearable): wearable's daily burn auto-imports → user only logs *food* with Claude → calibration math runs on (accurate burn from wearable) + (AI-estimated intake from Claude).

The lived UX: *"I wear my watch, eat my meals, occasionally tell the app what I had. Once a week the app tells me how I'm doing."*

The tracker-accuracy multiplier we already built becomes more important — wearable burn estimates are imprecise (Fitbit overestimates by 30-50%), and our calibration loop absorbs that automatically.

### When to ship

Phase 3, after Claude AI logging is stable. The OAuth + scheduled-sync infrastructure piggybacks on the same Cloudflare Worker we're building for Claude. Order of integration: Fitbit first (most popular consumer wearable), Strava second (athletic users), Garmin third (smaller but committed user base).

---

## Architecture

### Frontend
No structural change. Static HTML/CSS/JS hosted on Bluehost. Calls to a new backend endpoint when logging via AI.

### Backend (new)

**Cloudflare Worker** — single file, ~150-300 lines, deployed at the edge.

```
[user input from frontend]
    ↓
[POST /api/parse]
    ↓
[Cloudflare Worker]
    ├── Auth: simple per-user token in cookie/header (we own the keys)
    ├── Cache check (Workers KV) — exact-match lookup on input
    │   ├── HIT: return cached parse instantly (free)
    │   └── MISS: continue
    ├── Call Anthropic API
    │   ├── Text input → claude-haiku-4-5 (~$0.001-0.003/call)
    │   ├── Photo input → claude-sonnet-4-6 vision (~$0.02-0.05/call)
    │   └── Voice → already transcribed by browser, treat as text
    ├── Parse JSON response (Claude returns structured)
    ├── Write to cache (next user on same input is free)
    └── Return to frontend
    ↓
[frontend: log + show toast + render diary]
```

### Wearable sync (Phase 3)
Same Worker grows additional endpoints: `/api/oauth/fitbit`, `/api/oauth/strava`, etc. Background scheduled sync (Cloudflare Cron Triggers) pulls daily data into per-user storage.

### Storage
- **Frontend (browser):** localStorage for state, cache, settings — same as today
- **Backend (Workers KV):** shared parse cache (so popular foods are free), per-user wearable tokens
- **No traditional database needed in v2.** v3 with multi-user accounts may need one.

---

## Phased rollout

### Phase 1 — Diary structure (no AI yet)
**Goal:** Match MFP/Cronometer mental model with familiar diary UI.
- Rename Today → Diary
- Date navigation (prev/next, calendar picker, "Today"/"Yesterday" labels)
- Meal-type sections (Breakfast / Lunch / Dinner / Snacks) with per-section quick-add
- Water tracker (simple cup counter)
- Macro display in food entries IF the food has macros (no targets, display only)

**Effort:** 2-3 days of work, all client-side.
**Risk:** Low. No new infrastructure. Pure UI restructure.

### Phase 2 — Claude AI logging (the unlock)
**Goal:** Replace manual food search with conversational AI input.
- Stand up Cloudflare Worker (free tier sufficient for personal use)
- Worker proxies requests to Anthropic API with our key
- Frontend "Tell us what you ate" input replaces / augments existing parser
- Voice via Web Speech API → text → Claude
- Confidence-based auto-log vs clarify
- Text caching in Workers KV
- Local DB tries first; Claude is fallback for unknown items

**Effort:** 1-2 weeks. Most of it is the Worker + caching + UI integration.
**Risk:** Medium. New infrastructure (Worker), new dependency (Anthropic API).

### Phase 3 — Photo + wearables
**Goal:** Complete the multi-modal input vision.
- Photo input via Claude vision API
- Fitbit OAuth + daily sync
- Strava OAuth + workout import
- Garmin OAuth (smaller userbase, slower)
- Combined energy balance from wearable burn + Claude intake

**Effort:** 2-3 weeks.
**Risk:** Medium-high. Multiple OAuth flows, more error surface.

### Phase 4 — Polish + intelligence
**Goal:** Smart predictions and habit reinforcement.
- Streak / consistency badge
- Smart empty states ("It's 7am — usually you have...")
- Weekly Coach insights powered by Claude (replace canned responses)
- Pattern detection ("Tuesday lunches tend to spike")

**Effort:** 1-2 weeks.
**Risk:** Low. Mostly enhancement.

---

## Cost model

### Per-call costs (Anthropic API, late 2026 pricing)
| Model | Input cost | Output cost | Typical meal log |
|---|---|---|---|
| Haiku 4.5 (text) | $1/M tokens | $5/M tokens | ~$0.001-0.003 |
| Sonnet 4.6 (text, smarter) | $3/M tokens | $15/M tokens | ~$0.005-0.015 |
| Sonnet 4.6 (vision) | $3/M tokens + $0.0015/img | $15/M tokens | ~$0.02-0.05 |

### Scale projections (with cache)
| Scale | Daily AI calls | Cache hit rate | Monthly cost |
|---|---|---|---|
| Just Seth | ~10 | low (your own) | $1-3 |
| 100 users | ~600 | ~40% | $30-60 |
| 1,000 users | ~3,000 | ~60% | $200-400 |
| 10,000 users | ~20,000 | ~70% | $1,500-2,500 |

The cache is the magic. Popular foods stop costing money after the first request. Marginal cost per active user trends toward zero as usage grows.

### Infrastructure costs
- Cloudflare Workers: free up to 100K req/day; $5/month after
- Workers KV (cache): free up to 1GB; $0.50/GB/month after
- Bluehost (existing): no change

### Monetization (eventual)
- Free tier: ~5 AI logs/day per user (rest fall back to local DB)
- Pro tier: unlimited AI logging + photo input + wearable sync, ~$5-10/month
- One-time pricing or subscription, TBD

---

## Open design decisions (forks)

These are calls we need to make before building. Recording the current stance + any decision date.

### Fork 1: One input or two?
- **Single unified input** ("tell us what happened") — more revolutionary, more ambiguity
- **Separate inputs** for food vs exercise — more familiar, less ambiguity
- **Current stance:** ship v2 with separate inputs, unify in v3 if Claude's intent detection is reliable.

### Fork 2: Confidence threshold for auto-logging
- 95% — safer but slower (more clarifying prompts)
- 50% — faster but more errors
- **Current stance:** 80%. Tunable via settings.

### Fork 3: Photo support — v1 or v2?
- v1: Photos in launch (more impressive but more cost/complexity)
- v2: Defer photos until text is solid
- **Current stance:** v2. Voice + text first.

### Fork 4: Macros — track or just display?
- Track with daily targets (like Cronometer)
- Display only (calories remain primary)
- **Current stance:** display only in v1. No targets. Calibration philosophy stays intact.

### Fork 5: Diary restructure scope
- Full meal-type sections like MFP/Cronometer
- Hybrid: keep dashboard up top, sections below
- **Current stance:** hybrid. Stats + ring + diary sections.

### Fork 6: First wearable to integrate
- Fitbit (most popular consumer)
- Strava (athletic users)
- Garmin (committed runners/cyclists)
- **Current stance:** Fitbit first, then Strava.

### Fork 7: Apple Watch handling
- Build native iOS bridge (PWA + Capacitor)
- Rely on downstream services (Strava, Fitbit) that Apple Watch syncs to
- Manual import via CSV export from Apple Health
- **Current stance:** rely on downstream services for v2; revisit native iOS later.

### Fork 8: Hosting backend on Cloudflare vs Bluehost PHP
- Cloudflare Workers (clean, fast, separate service)
- Bluehost PHP (one host, slower, awkward)
- **Current stance:** Cloudflare Workers. The 5 minutes of cross-service complexity is worth the speed and cleanliness.

---

## Brand alignment guardrails

To stay on-brand as we add features, every potential addition gets filtered through:

> *Does this reduce friction without compromising the calibration philosophy?*

- **Friction-reducer + calibration-aligned:** ship it. (Voice, photo via Claude, wearable sync, smart empty states, streak)
- **Precision-adder, calibration-misaligned:** skip. (Strict macro targets, daily nutrient scoring, social features, gym-tracker depth)
- **Friction-reducer + precision-adder:** evaluate carefully. (Macros for display only, food DB expansion, recipe builder)

The brand is "honest calibration > obsessive precision." Anything that makes users feel they need to be precise undermines the pitch. Anything that makes logging easier while letting the math absorb imprecision strengthens it.

---

## Milestones

- [x] **v1 — Cycle Personal complete** (May 2026): site live at caloriecorrect.com, Cycles 1-7 + CP shipped, lean Git workflow established.
- [ ] **v2.1 — Diary restructure** (Phase 1): meal-type sections, date nav, water tracker. Target: end of week.
- [ ] **v2.2 — Claude text logging** (Phase 2 part A): Worker live, text input works. Target: 2-3 weeks.
- [ ] **v2.3 — Voice input** (Phase 2 part B): Web Speech → Claude. Target: +1 week after text logging.
- [ ] **v3 — Photos + Fitbit** (Phase 3): camera input, first wearable integration. Target: month after v2.3.
- [ ] **v3.5 — Strava + Garmin** (Phase 3 expansion).
- [ ] **v4 — Polish + intelligence** (Phase 4): streaks, smart suggestions, AI Coach.

---

## Notes

This roadmap will be updated as decisions are made and milestones land. The previous roadmap (`Calorie_Correct_Roadmap.docx`) covers the v1 build history through Cycle Personal.
