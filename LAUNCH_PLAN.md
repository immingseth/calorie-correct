# Calorie Correct — Launch Plan

The plan for going from "Seth's personal tool" to "public product." Phased
rollout: alpha → closed beta → public launch → growth.

## Target sequence

```
A — Alpha (you + 5-15 friends)            ~2-3 weeks of build
B — Closed Beta (50-200 invitees)         ~1-2 months of build + run
C — Public Launch (open registration)     ~1 month of build + marketing
D — Growth & Retention                     ongoing
```

Each phase has explicit success criteria before advancing. Don't rush ahead.

---

## Brand guardrails (don't drift)

These are non-negotiable through every phase. They're what make Calorie
Correct different from MyFitnessPal/Lose It/Noom — losing them defeats the pitch.

- **Calibrated calorie tracking.** The promise is "the closest possible
  numbers to reality" — we correct logged intake and burn against actual
  weight change over time. Useful for cutters, maintainers, and athletes
  fueling workouts. Net calories (intake − burn) is the headline metric
  on every "today" view.
- **Honest realistic energy balance.** Math, not motivation.
- **No streaks, badges, pep talks, or gamification.** Cal is the retention loop.
- **No ads, ever.** Subscription-only revenue.
- **Privacy by default.** No third-party tracking pixels. Cal conversations
  not used for training. Data export + delete must work and be easy.
- **Sentence case copy. Real voice. No corporate filler.**

---

## Phase A — Alpha (close friends)

**Goal:** Get accounts + cross-device sync working, ship to ~10 people Seth
trusts, gather direct feedback. No pricing, no marketing, no polish beyond
"works reliably."

**Build tasks** (~2-3 weeks of focused work):

1. **Auth via Google OAuth + email magic link.** No passwords.
   - `/api/auth/google` (OAuth flow)
   - `/api/auth/email-link` (send magic link)
   - `/api/auth/verify` (validate magic link)
   - Session stored in secure HTTP-only cookie

2. **Cloudflare D1 database.**
   - Schema: `users`, `weights`, `meals`, `exercises`, `water`, `chat_history`
   - Same Cloudflare account as the existing Worker. Free tier covers it.

3. **Sync endpoints.**
   - `POST /api/sync/push` — frontend uploads local changes since last sync
   - `GET /api/sync/pull` — frontend pulls server state
   - Last-write-wins conflict resolution. CRDTs are over-engineering for now.
   - Sync triggered on every state change + on app load + every 30s while open.

4. **Frontend changes.**
   - "Sign in to back up" CTA in onboarding (skippable)
   - Settings: account section with sign in / sign out / delete account
   - Sync status indicator (small ✓ + last-synced time)
   - Migrate localStorage data to server when user signs in for first time

5. **Privacy + Terms pages.** Real content, not placeholders. Even at
   alpha stage you legally need these once accounts exist.

6. **Mobile install prompt.** Custom in-app banner, fires after user has
   logged a few meals. iOS-specific instructions for Safari users.

7. **Invite system (lightweight).**
   - Single shared sign-up code OR pre-seeded list of allowed emails
   - "Calorie Correct is in private alpha — request access" landing flow
   - Or just share the URL with friends and trust they'll be cool

8. **Feedback channel.** Single email address (`feedback@caloriecorrect.com`)
   or a tiny form in Settings → "Send feedback to Seth." Don't overbuild this.

**Success criteria to advance to Phase B:**
- 5+ alpha users signed in and using cross-device for 2+ weeks
- No data loss incidents
- Coach prompt is dialed in enough that responses don't embarrass us
- Clear list of issues / requests from alpha users (not necessarily fixed —
  just visible)

**What we explicitly don't do in Phase A:**
- Pricing or Stripe — everyone's free
- Native app — PWA only
- Polish beyond "works"
- Marketing — friends-only
- Public landing page changes (current one is fine)

---

## Phase B — Closed Beta

**Goal:** 50-200 invited users. Tune onboarding for non-technical people.
Tune Coach prompts based on real conversations. Find the bugs that only
show up at scale (concurrent users, weird state, edge cases).

**Build tasks** (~1-2 months including running the beta):

1. **Polish onboarding.** Today's flow assumes a tech-savvy user. For real
   users it needs:
   - Friendlier first-screen copy
   - Better "what does this app do" framing in step 1
   - Email capture earlier (so we can re-engage abandoners)
   - Sample data preview ("here's what your dashboard will look like")

2. **Analytics.** Privacy-respecting only — no Google Analytics, no Facebook.
   Use Plausible Analytics ($9/month) or Cloudflare's built-in Web Analytics.
   Track:
   - Daily active users
   - New sign-ups per day
   - Activation rate (% who log a meal in their first session)
   - Retention curves (day 1, 7, 30)
   - Coach API call volume + cost
   - Bugs / errors hit (Sentry or similar — free tier)

3. **Pricing page.** Even if we're not charging yet, publish pricing so
   beta users know what's coming. Free tier + Pro tier. Soft commitment to
   pricing model. Marks the brand as a real product.

4. **Coach prompt iteration.** Beta users will produce real conversations.
   Some patterns will work; some will fail. Tune the system prompt based on
   actual transcripts. Especially:
   - How Coach handles "what should I eat?"
   - How Coach handles weight gain weeks
   - How Coach handles ambiguous logs
   - How Coach handles "is this enough?" insecurity

5. **Bug fixes from alpha.** Whatever the alpha surfaces, fix.

6. **Structured feedback intake.** Beyond just an email address. Either:
   - Linear or ClickUp with a public-ish board (so users see what's in flight)
   - In-app form that auto-tags with user info, current state, browser
   - Simple Google Form with structured fields

7. **Waitlist + invite codes.** caloriecorrect.com homepage gets a "Join the
   beta" form. Manually invite people in batches. Lets you control growth pace.

**Success criteria to advance to Phase C:**
- 100+ beta users with 7-day retention >40%
- Activation rate >60% (most signups log a meal that session)
- Cost per user is <$1/month (else pricing won't work)
- Coach quality is consistently good (subjective — based on transcripts)
- No major outages or data issues for 4+ weeks
- 3-5 testimonials or case studies you can use for marketing

**What we explicitly don't do in Phase B:**
- Stripe / payments yet (free during beta)
- Native app (PWA still)
- Major feature additions — focus is stability and quality

---

## Phase C — Public Launch

**Goal:** Open registration. Monetize. Find product-market-fit signal.

**Build tasks** (~1 month build + ongoing marketing):

1. **Stripe integration.** Free tier + Pro tier subscriptions.
   - Free tier: ~10 Coach interactions/day, unlimited local meal log fallback
   - Pro tier: $8-10/month or $60-72/year (slightly under MFP/MacroFactor)
   - Server-side enforcement of usage limits
   - Standard subscription management (cancel, update card, etc.)

2. **Marketing push.**
   - Polished landing page with screenshots, testimonials, clear pitch
   - Product Hunt launch
   - Hacker News "Show HN: Calorie Correct, a coach-first calorie tracker"
   - One or two pieces of long-form content explaining the calibration
     thesis (medium-style essay or YouTube video)
   - Reddit posts in r/loseit, r/CICO, r/IntermittentFasting (carefully —
     these communities hate spam)

3. **Help center / docs.** A few pages of FAQs:
   - "How does the calibration math work?"
   - "Why is my logging accuracy at X%?"
   - "How is this different from MyFitnessPal?"
   - "What does Coach actually do?"

4. **Customer support.** Email-based. Inbox check daily. Aim for <24hr
   response. Single person (you) handles it for first ~500 users.

5. **Native app wrapper via Capacitor (optional but recommended).**
   - 1-2 weeks of work
   - Wraps the existing PWA in a native shell
   - Submit to App Store + Play Store
   - $99/year Apple developer fee + $25 one-time Google
   - Adds: real push notifications, App Store discoverability, native feel
   - Doesn't require rewriting the app — same JS/CSS/HTML

**Success criteria to declare launch successful:**
- 1000+ sign-ups in first month
- Free → Pro conversion rate of 3-5%
- Pro retention at 90 days >70% (subscription health)
- Press / mention / link from at least one credible outlet

---

## Phase D — Growth & Retention

**Goal:** Scale to thousands of users. Long-term retention. Defensibility.

**Open-ended task list** (in priority order):

1. **Wearable integrations** (per ROADMAP Phase 3):
   - Fitbit OAuth + daily sync
   - Strava OAuth + workout import
   - Apple HealthKit (requires native app)
   - Google Health Connect

2. **Coach quality improvements:**
   - Smarter context (last 30 days summarized, last 7 days raw)
   - Cost-control caching via Workers KV
   - Smart routing (Haiku for parsing, Sonnet for hard questions)
   - Async batch generation for daily greetings (cheaper at scale)

3. **Activation improvements:**
   - Cohort analysis on which onboarding steps lose users
   - A/B testing of copy on landing page and onboarding
   - Email nurture sequence for users who abandon onboarding

4. **Referral program (only if metrics support it):**
   - "Give a friend a free month" → both get a free month
   - Standard SaaS pattern, but only worth building if organic growth is real

5. **Premium features beyond Coach:**
   - Photo logging unlimited (vs limited on free)
   - Weekly insights generated by Sonnet (richer than daily greetings)
   - Custom goal templates (cutting, bulking, recomp)
   - Coach personality variants? (probably not — adds confusion)

6. **Community surface (later, only if users ask for it):**
   - Discord server for power users
   - Public Coach prompt iteration (transparency about how Coach works)

---

## Decisions you need to make before each phase

These don't need answers today, but flag them for when they come up:

**Before Phase A:**
- [ ] Email service for magic links (Resend, SendGrid, AWS SES — Resend is easiest)
- [ ] Will alpha users be invite-only or just URL-share with friends?
- [ ] Domain for emails (`hi@caloriecorrect.com`?)

**Before Phase B:**
- [ ] Pricing: $8 vs $10 vs $12/month? Annual discount?
- [ ] Free tier limits: how many Coach interactions per day?
- [ ] Apple Sign-In now or wait until native app?
- [ ] Beta access: waitlist + invite codes, or open sign-up?

**Before Phase C:**
- [ ] Native app: build at launch or after?
- [ ] Marketing budget: any paid ads, or organic-only?
- [ ] Customer support tooling: just email, or Intercom/HelpScout?
- [ ] Annual subscription discount: 20% off or full free month?

**Before Phase D:**
- [ ] Hire help: any contractors? Designer? Developer?
- [ ] Investor / not-investor decision (seed funding vs bootstrap)
- [ ] Roadmap visibility: public or private?

---

## What's NOT on this plan (deliberately)

- Coach Premium with GPT-4 / Sonnet for everyone — wait for real cost data
- B2B / enterprise version — too far off, not the brand
- White-label for nutritionists / dietitians — also too far off
- Hardware (smart scale, etc.) — wrong business shape
- Becoming a content company (blogs, YouTube) — coach-first is the product
- Streaks, badges, leaderboards — explicitly off-brand

---

## Notes on cost / runway

Anthropic API + Cloudflare are the real costs. Per-user economics:

- Free tier user (~10 Coach calls/day): ~$0.30-0.60/month per user
- Pro tier user (~30 Coach calls/day + photos): ~$3-5/month per user
- Cloudflare: free up to ~100K requests/day; $5/mo + KV at scale

Pricing math at $8/month Pro:
- COGS $3-5, leaves ~$3-5/month margin per Pro user
- 1000 Pro users → ~$3-5K/month gross profit
- Need 2000+ Pro users for it to feel like a real business

Free tier abuse risk: someone signs up free, hits 10 Coach calls/day, costs
~$0.30. Multiply by N free users. Server-side caps must be tight.

---

## Status at time of writing

Phase 0 complete:
- v1 app shipped at caloriecorrect.com
- Phase 2 (Claude API integration) live: text chat, structured meal logging
  with macros, daily greeting, voice input, photo logging
- Phase 3 (PWA + mobile) live: installable, hamburger nav, collapsible chat
- Single-user (Seth) tested

---

## Phase A — paused state (2026-05-06)

**What's built and ready to ship locally (not yet deployed):**
- PA-1 Mobile install prompt (Android Chrome native + iOS Safari instructions,
  fires after 3+ meals logged, dismissible, 30-day cool-off)
- PA-2 Privacy + Terms pages (privacy.html + terms.html at project root,
  linked from landing-page footer and from Settings -> About)
- PA-7 Feedback channel (Settings -> Send feedback opens an in-app modal with
  textarea + optional debug context, hands off to user's mail client targeting
  hi@caloriecorrect.com — no server needed)
- Service worker bumped to cc-shell-v9

**Blocked on Seth's homework before continuing:**
- PA-3 Cloudflare D1 database — needs D1 instance created in Cloudflare
  dashboard (same account as Worker), name suggestion: `calorie-correct-db`
- PA-4 Auth (Google OAuth + email magic link) — needs:
  - Resend account + verified `caloriecorrect.com` domain + API key
  - Google Cloud OAuth 2.0 Client ID + Secret, redirect URI
    `https://caloriecorrect.com/api/auth/google/callback`
  - Sender email decision (recommend `hi@caloriecorrect.com`)
- PA-5 Sync push/pull endpoints — depends on PA-3 + PA-4
- PA-6 Sign-in UI — depends on PA-4

**Still in Phase A scope (added 2026-05-06):**
- PA-8 Fitness tracker integrations — Fitbit, Apple Health, Garmin, Google
  Health Connect. Pull daily steps, active calories, workouts so users don't
  have to log exercise manually. Apple needs the Capacitor native shell first
  (Phase C item) so the realistic alpha targets are Fitbit + Google.
- PA-9 Smart scale integration — Withings, Fitbit Aria, Garmin Index, Eufy.
  Auto-import morning weights + body composition (body fat %, muscle, water).
  Mostly flows through the same OAuth integrations as PA-8.

**To resume:**
1. Knock off any one of the homework items above (D1 is fastest).
2. Tell Claude which one is ready and Phase A picks up from there.
3. Decide whether to ship PA-1/PA-2/PA-7 now (live on caloriecorrect.com) or
   batch with the auth work and ship Phase A as one drop.

Next step after that: alpha start date, then PA-3 -> PA-4 -> PA-5 -> PA-6 ->
PA-8/PA-9 in priority order.
