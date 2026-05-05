# Calorie Correct — Design Backlog

A running list of design ideas we've thought through but haven't yet committed to building. Each entry captures the thesis, the brand alignment, the open decisions, and rough effort estimates.

When an idea graduates to "build it next," we move it into `ROADMAP.md` as a phase task with concrete acceptance criteria.

---

## Format for each entry

```
## [Idea title]
- **Status:** Idea / Designed / Committed / Building / Shipped
- **Brand fit:** Aligned / Neutral / Risk
- **Effort:** S (hours) / M (1-3 days) / L (week+) / XL (multi-week)
- **Depends on:** Other features that need to ship first
- **Summary:** 1-2 sentences on what it is and why
- **Detail:** the design and reasoning
- **Open questions:** decisions still to make
```

---

## Unified logging accuracy with breakdown

- **Status:** Designed (not committed)
- **Brand fit:** Strongly aligned — embodies "honest calibration" pitch directly
- **Effort:** M (1 day end-to-end)
- **Depends on:** Nothing — could build today

### Summary

Replace the current two-concept calibration model (separate `trackerAccuracy` slider + silent `calibrationFactor`) with **one user-facing logging accuracy percentage**, backed by multiple underlying multipliers, with a transparent breakdown explaining where the gap comes from. The number auto-tunes from observed weight trend over time.

### Why this matters

The split between "tracker accuracy" and "calibration factor" is invisible to users. They see two settings that mean different things and no clear story about how they connect. Collapsing to one headline number with a breakdown is:

1. **Simpler** — one number to understand, one to read about
2. **More honest** — the user can't actually distinguish "did I over-count Fitbit burn or under-log lunch?" Combining captures the total gap they actually care about
3. **More on-brand** — *"the math is honest, your tracking doesn't have to be"* becomes literal: one number quantifying exactly how off your tracking is
4. **More actionable** — the breakdown shows what's contributing, so the user can decide to upgrade their tracker, log more carefully, or do nothing (the math compensates either way)

### What's underneath (two multipliers, one display number)

Two separately-tracked accuracies that compose into the headline:

**1. Exercise tracker accuracy** (existing, kept):
- No tracker: 100%
- Chest-strap HR (Polar): 90-95%
- Garmin: 80-90%
- Apple Watch: 70-80%
- Fitbit / wrist HR: 55%
- Gym cardio machine: 50-60%

**2. Food logging accuracy** (new):
- Defaults from a one-time onboarding question: "How often do you eat out or order in?"
  - Rarely (<1×/week, mostly home cooking): 90%
  - Occasionally (1-2×/week): 85%
  - Often (3-4×/week): 75%
  - Most meals (5+/week): 65%
- User-tunable slider in Settings (separate from tracker)

Both auto-tune from weight-trend feedback after 14 days of data.

### Headline number

The single number shown to users:
- **Before 14 days:** estimated combined accuracy = `tracker_acc × food_acc` (e.g., 0.55 × 0.85 = 47%)
- **After 14 days:** observed accuracy from weight trend = `actualLoss / predictedLoss`
- The system swaps from estimate to observed automatically

Example trajectory:
- Day 1, Fitbit + occasional eating out: "Estimated logging accuracy: 47%"
- Day 14: "Adjusted to 62% based on your actual weight data"
- Day 60: "67%, dialed in"

### The breakdown UX (brand voice)

A card on Trend page (short) and full version in Settings (deeper). Voice: real, no judgment, focus on what's in vs. out of the user's control. Sample copy:

> **Your logging accuracy: 62%**
> 
> This isn't about you logging wrong — most of the gap isn't in your control, and the math handles the rest.
> 
> | Source | Accuracy |
> |---|---|
> | Exercise tracker (Fitbit) | 55% — biggest factor |
> | Eating out 2-3×/week | 85% |
> | Combined estimate | 47% |
> | Adjusted from your actual data | **62%** |
> 
> About 38% of the deficit your logs claim isn't reaching reality — typical for a wrist-tracker user who eats out occasionally. The math knows this and sets your daily target to land where your scale actually shows progress.
> 
> Things you could change (none required):
> - A chest-strap HR or Garmin reads exercise burn ~25% more accurately
> - Weighing portions at home (vs eyeballing) closes another ~5%
> 
> Or keep doing what you're doing — the calibration math already adjusts for everything.

The *"none required"* framing is the key tonal move. Working with imprecise tracking is the explicit philosophy, not a workaround.

### What we explicitly leave out

- **Water weight modeling** — too noisy, multiple variables. Our 7-day smoothing absorbs it. Mention in methodology as a known limitation; don't try to quantify.
- **Stress/sleep/hormonal cycles** — real but unmeasurable. Same approach.
- **Genetic metabolic variation** — already absorbed by the calibration factor. Higher-than-average metabolism just produces a higher real-TDEE estimate over time.

### Math change

Today:
```
predicted_deficit = BMR × 1.2 + (rawBurn × trackerAcc) − loggedIntake
calibrationFactor = predictedLoss / actualLoss     (used in target calc)
realIntake = avgIntake × calibrationFactor
```

After change:
```
predicted_deficit = BMR × 1.2 + (rawBurn × trackerAcc) − (loggedIntake / foodAcc)
overall_accuracy_estimated = trackerAcc × foodAcc
overall_accuracy_observed = actualLoss / predictedLoss     (after 14 days)
overall_accuracy_displayed = observed if available else estimated
```

The displayed number is what the user sees. Underneath, both multipliers are stored; either can be edited.

### Open questions (need to commit before building)

1. **Onboarding question for existing users?** New users get the food-frequency question in onboarding. Existing users land on a default 85% (the "occasional" middle option). Do we offer a one-time prompt in Settings to refine, or just let them edit the slider manually? **Lean: one-time card in Settings, then it lives there.**

2. **Auto-apply or suggest-only?** Three options:
   - (a) Compute suggestion, never apply (current behavior — user clicks "Apply")
   - (b) Auto-apply weekly based on past 14 days
   - (c) Auto-apply but show a transparent notification ("Adjusted to 62% from your last 14 days")
   
   **Lean (c).** Most users won't manually tune; auto-apply with transparency is the right balance.

3. **Where does the breakdown live?**
   - (a) Trend page, replacing the existing calibration card
   - (b) Settings, as an expandable "Read more" section
   - (c) Both — short version on Trend, full breakdown in Settings
   
   **Lean (c).** Trend stays brief and motivational; Settings has the deep dive.

### Implementation outline

1. Rename `trackerAccuracy` → keep, but add `foodAccuracy` next to it
2. Add onboarding question + Settings slider for food accuracy
3. Update `getCalibration()` math: divide intake by foodAcc as well as multiply burn by trackerAcc
4. Compute both estimated and observed accuracies; display whichever is current
5. New "where your gap comes from" component on Trend (short) and Settings (full)
6. Update Methodology page to explain the dual-multiplier model
7. Update onboarding to set both accuracies based on tracker source + eating-out frequency
8. Migration: existing users default to foodAccuracy = 0.85

---

## Claude-as-coach: chat-first product pivot

- **Status:** Designed (not committed)
- **Brand fit:** Strongly aligned — extends "honest calibration + AI-native" thesis to its logical end
- **Effort:** XL (multi-week, depends on Phase 2 backend infrastructure)
- **Depends on:** Phase 2 (Claude AI logging) shipped and stable

### Summary

Reframe Calorie Correct from "calorie tracker app with AI features" to **"Claude as your weight loss / fitness guide"**, with full context of your data. Chat becomes the primary interaction surface; structured views (Diary, Trend, Insights) stay as the reference back wall. Logging, daily briefings, on-demand questions, weekly reviews — all flow through Claude.

### Strategic framing

We're not trying to beat MyFitnessPal at being MyFitnessPal — they're stuck with their database moat and bloat, can't pivot. Our edge is *honest calibration + AI-native interface*. A focused product with 10K paying users who love it is a real business. The Claude-as-coach pitch is something no other app can credibly make:

- MFP's "coach" feature is canned scripts.
- Noom's "coaches" are gig workers reading playbooks.
- Cal AI / Nutrola sell precision photo logging — not coaching.
- Claude with full context of your data, 24/7, in our brand voice = genuinely category-of-one.

### The product

**Default landing:** the chat. *"Good morning, Joe. You're at 188.4 today, down 1.2 from last Sunday. What's going on for you today?"*

**Quick taps above chat:** the most-used actions (log breakfast, weigh in, see trend) as 1-tap chips.

**Side drawer:** structured views — Diary, Trend, Insights, Settings — one tap away.

**Daily morning briefing:** auto-generated, first message of the day. Pulls past 7 days, calls out what mattered, suggests one focus. Not chatty filler — substantive insight.

**On-demand chat:** any question — *"why am I plateauing?"*, *"I'm at a wedding tonight, what should I do?"*, *"I went over today, am I screwed?"* — Claude answers with the user's real data and our calibration philosophy.

**Voice and photo input:** same Claude pipeline, different modalities.

**The structured views stay:**
- Diary (date-navigable single chronological log) — users want at-a-glance day view
- Trend chart — irreplaceable for visualizing weight over time
- Weight log table — verify what's recorded

The interaction model: **chat is the front door for input + insight; structured views are the back wall for reference.** Pure chat apps feel like chatbot demos. Chat + solid structured views feel like a real product.

### Cost model

The main concern. Real numbers (Haiku 4.5, Anthropic prompt caching cuts repeated context by ~90%):

- Compact context per turn: ~3,700 input + 200 output = **~$0.0014/turn**
- Light user (10 turns/day): $0.42/month
- Average user (30 turns/day): $1.26/month
- Heavy user (100 turns/day): $4.20/month
- Photo logging (Sonnet vision): ~$0.03/photo, 5/day = $4.50/month

Sonnet for hard questions: 2-3x Haiku cost.

### Pricing model

| Tier | Price | Cost | Margin |
|---|---|---|---|
| Free | $0 | ~$0.30/mo (limited AI) | Loss leader |
| Pro | $10/mo | $3-5/mo | 60-75% |
| Premium | $18/mo | $8-12/mo | 40-60% |

**Free:** manual logging, 1 daily briefing, structured views, ~10 chat turns/day cap
**Pro:** unlimited Claude logging (text + voice), unlimited chat, weekly insights, wearable sync
**Premium:** + photo logging, Sonnet for everything, PDF export

For Seth's personal-use phase: effectively the only Pro user, ~$3-5/month absorbed personally until we open to others.

### Cost-control engineering levers

1. **Aggressive prompt caching** — 90% off on stable context
2. **Smart routing** — Haiku for parsing/quick tasks, Sonnet only for hard questions
3. **Pre-computed daily insights** — generated once per morning, served from cache
4. **Compact context** — send last 7 days raw + last 30 days summary, not full history
5. **Free tier hard token cap** — daily budget enforced server-side
6. **Async batch processing** — weekly insights generated overnight, batch pricing applies

### Risks and how to handle them

1. **Latency** — chat adds 1-3s per turn vs instant tap. Mitigation: keep tap-based quick adds (chips) for fast logging; reserve chat for moments where it adds value.

2. **Claude wrong answers** — calorie estimates, exercise rec, etc. Mitigation: always show estimates as editable, train users to spot-check unusual values.

3. **Health-advice liability** — coaching crosses into regulated territory. Mitigation: explicit disclaimers ("Not medical advice"), avoid medication / treatment language, keep recommendations behavioral not medical.

4. **Discoverability** — chat-first UX is harder to onboard. Mitigation: starter prompts ("ask me anything about your data"), suggested questions, the daily briefing as a model of what's possible.

5. **API rate limits** — Anthropic per-account TPM. Mitigation: spend grows tier automatically; no real cap until enterprise scale.

6. **Privacy** — all health data flows through Anthropic. Mitigation: explicit privacy stance ("data is sent to Anthropic for processing, never used for training, never sold"). Some users will opt out; offer "manual mode" as fallback.

7. **Offline / API outage** — if Anthropic is down, Claude features die. Mitigation: structured views and manual logging continue working; chat gracefully degrades.

### Implementation phasing (proposed)

This becomes Phase 3 in the roadmap (after Phase 2's AI logging is shipped and stable). Specifically:

- **Phase 3a:** Daily morning briefing (one auto-generated insight per morning, async batch). Lowest cost, highest perceived value.
- **Phase 3b:** On-demand chat (free tier capped, Pro unlimited). Single conversational surface for questions.
- **Phase 3c:** Voice input via chat (Web Speech → Claude). Already designed in Phase 2 plumbing.
- **Phase 3d:** Photo input (Premium tier). Vision model.
- **Phase 3e:** Reframe app shell to chat-first landing. UX pivot.
- **Phase 3f:** Wearable data integration into Claude context. Combined intake + activity insights.

### Open questions

1. **Chat-first as default landing, or chat-as-feature?** Going chat-first changes everything — most users land in chat by default, not Diary. Less aggressive: chat is a sibling of Diary in the nav. **Lean: start chat-as-feature in Phase 3a-d, transition to chat-first in 3e if usage validates it.**

2. **Branding shift?** "Calorie Correct" still works as a name. Tagline could shift from "honest calibration" to "your AI weight loss guide" — same idea, different emphasis. **Lean: keep current branding, evolve tagline copy.**

3. **Pricing introduction timing?** Going free forever caps revenue. Going premium too early limits user base. **Lean: free until Phase 3a is live + tested; introduce paid tiers when Phase 3b (chat) ships.**

4. **What happens to "Coach" view?** Currently a placeholder canned-response page. Once we ship real Claude chat, that view either becomes the chat itself OR gets replaced by the morning briefing. **Lean: Coach view becomes the chat in Phase 3b.**

5. **Retain methodology page?** Yes — even with Claude as coach, the underlying calibration math should be readable. Power users want to see how it works. **Lean: keep, possibly expand.**

### What we explicitly don't do

- Replace Diary / Trend / Insights with pure chat. Structured views are the reference back wall; they stay.
- Promise medical or therapeutic outcomes. Behavioral coaching only.
- Charge for the basic calibration math — that's free forever.
- Build human-in-the-loop coaching (Noom-style). Pure AI; cheaper, scales better, more honest.

---

## Minimal Claude-style interface — Phase 3 home design

- **Status:** Designed (decisions locked, ready to commit when Phase 3 begins)
- **Brand fit:** Aligned — extreme minimalism reinforces "different from MFP/Cronometer" positioning
- **Effort:** M-L
- **Depends on:** Claude chat coach (Phase 3 in roadmap)

### Summary

Reimagine the default landing as something close to **Claude.ai's UI**: empty canvas, single text input in the middle of the page, ready to do whatever the user wants. Logging, asking questions, getting insights — all flow through the same surface. All existing features (Diary, Trend, Insights, Methodology, Settings) stay accessible but tucked away one tap behind a drawer or nav.

### What it might look like

```
                Calorie · Correct

             Good morning, Joe.
             188.4 lb · down 1.2 this week

      ┌──────────────────────────────────┐
      │ What's on your mind?             │
      │                       🎙  📷  ⏎ │
      └──────────────────────────────────┘

      [Diary] [Trend] [Insights] [Settings]
```

Anything the user types or speaks — a meal, an exercise, a weight, a question — flows to Claude, which routes it to the right action:
- Logged a meal? Confirms + appears in diary
- Logged exercise? Same
- Asked a question? Returns an answer with their data context
- Asked for advice? Returns coaching with brand voice

### Design principles

1. **Nothing on screen but the question.** No stat cards above the input. The current weight + recent change can sit in tiny secondary text under the greeting, or behind a tap.
2. **Nav as drawer, not chrome.** Diary / Trend / Insights / Settings live in a side panel or bottom drawer that opens on demand. Default state is closed.
3. **Conversation as the home view.** First-time users land in a brief onboarding chat, not a form. Returning users land in a continuation of yesterday's conversation, or a fresh prompt.
4. **Structured views are reachable, not primary.** They exist for reference (the back wall mentioned in the chat-coach entry) but the user shouldn't need to use them to do their daily work.

### Why this matters

- It's *visually distinct* in a way no other tracker is. Walking into MFP feels like a database. Walking into this feels like a conversation with a smart friend.
- The interface implies the value prop: *"this is built around an AI that gets to know you, not around forms you fill in."*
- It scales naturally — same input handles all input modalities (text, voice, photo) and all intents (log, ask, advise).
- It removes decision fatigue. The user doesn't have to figure out "where do I log this?" — there's only one place.

### Risks

1. **Discoverability.** Users staring at an empty box may not know what to do. Mitigation: starter prompts ("Try: 'turkey sandwich and an apple' or 'why am I plateauing?'"), the daily briefing as the first message of every day, sample-question chips.
2. **Power users want their data.** Some users will resent having to chat to see their numbers. Mitigation: structured views one tap away — fast, persistent.
3. **Loss of at-a-glance dashboard feel.** Stats and rings provide instant feedback. Mitigation: keep them on the Diary view; the home page is for input, the Diary view is for review.
4. **First-time user confusion.** New users don't know what the app does. Mitigation: onboarding still walks them through it; landing page (caloriecorrect.com) sells the value prop before they install.

### Locked design decisions

After design discussion 2026-05-04 with Seth, the following are committed for Phase 3 home design:

| Decision | Choice | Rationale |
|---|---|---|
| Home screen content | **Briefing + stats line + input + chips** (Model B) | Briefing demonstrates AI value prop on first sight; gives user something to react to instead of empty box |
| Log feedback style | **Hybrid** — inline confirmation card for logs, conversation thread for coaching questions | Logs are transactional (do, confirm, move on); coaching is conversational. Same input, different response style |
| Quick chips | **Yes, 4-5 max** | Removes "what should I type" friction; hidden if user has no recent history |
| Tab structure | **5 tabs**: Home, Diary, Trend, Insights, Methodology | Coach tab absorbed into Home (which is the chat) |
| Layout pattern | **Three-column on desktop**: left nav (220px) + main (~720px) + right sidebar (280px) | Right sidebar = today snapshot. Left navigates, middle acts, right shows progress |
| Conversation persistence | **Within a day** | Fresh start each morning anchored by briefing. No history bloat |
| Input placeholder | **"What's on your mind?"** | Open enough to handle every intent (log, ask, advise) |
| Onboarding | **Form-first** in v1; "skip and chat" alternative deferred | Forms are faster for first-time setup |
| Mobile layout | **Sidebars collapse**: bottom tabs persistent, right-sidebar content becomes collapsible "Today snapshot" card below input | Same content, rearranged for screen size |

### Three-column layout (desktop)

```
┌─────────────────┬─────────────────────────────┬─────────────────┐
│  LEFT NAV       │    MAIN — Home              │   RIGHT — TODAY │
│  ~220px fixed   │    ~720px flexible          │   ~280px fixed  │
├─────────────────┼─────────────────────────────┼─────────────────┤
│  Home           │  Greeting                   │   Calorie ring  │
│  Diary          │  Stats line                 │   ─────         │
│  Trend          │                             │   Today entries │
│  Insights       │  Today's briefing card      │   (chronologic) │
│  Methodology    │                             │   ─────         │
│  ─────          │  Unified input              │   Daily totals  │
│  Profile        │  (Mic / Camera / Send)      │   (cal/macros/  │
│  Weigh in       │                             │   water)        │
│                 │  Quick chips                │                 │
│                 │                             │                 │
│                 │  [Conversation thread,      │                 │
│                 │   when active]              │                 │
└─────────────────┴─────────────────────────────┴─────────────────┘
```

### Mobile layout (<700px)

```
┌──────────────────────┐
│  Greeting + stats    │
│  Briefing (collapse) │
│                      │
│  Unified input       │
│  Quick chips         │
│                      │
│  ── Today snapshot ──│
│  (collapsible)       │
│  Calorie ring        │
│  Today entries       │
│  Daily totals        │
│                      │
├──────────────────────┤
│ [Home][Diary][Trend] │
│   [Insights][More]   │
└──────────────────────┘
```

### Phase 2 → Phase 3 evolution

Phase 2 (AI logging) is a smaller visual change — Diary stays as the home tab; the existing meal logger UI is replaced with the unified Claude input. The unified input component built in Phase 2 is the same component that becomes the centerpiece of the new Home tab in Phase 3. Same with Claude backend infrastructure. We build once, use twice. The Phase 2→3 evolution is mechanical, not architectural.

### Implementation note

This is a **post-Phase-3** thought. Sequence:
- Phase 2: AI logging (text/voice/photo) — current diary stays as primary UI
- Phase 3a-d: chat coach features (briefing, on-demand chat, voice/photo) layered on existing UI
- Phase 3e: this — pivot the default landing to the minimal canvas

We don't decide on this until Phase 3a-d are shipped and we see how users actually use the chat. The data may push us further toward minimal, or it may show users want the dashboard. We design around evidence, not in advance.

---

## [Future ideas go here]

When new ideas come up in conversation, add them below using the format above. Each gets its own H2 section.
