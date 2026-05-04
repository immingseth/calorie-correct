# Calorie Correct — Development Workflow

The protocol for changing the live site without breaking it.

---

## The three rules

1. **Never edit files directly on the Bluehost server.** All changes start locally, get committed to Git, get pushed to GitHub, then get pulled by Bluehost. The server is downstream — never upstream.
2. **Test locally before every push.** Open `app/index.html` in a real browser. Click through Today, Trend, Insights, Coach. If anything errors in the Console, do not push.
3. **One change per commit.** A commit should be revertible without losing other work. "Fix net-deficit calculation" is a commit. "Net deficit + add 30 foods + redesign Today" is three commits.

---

## Pre-change checklist

Before changing anything:

- [ ] `git status` shows a clean tree (no uncommitted work to lose)
- [ ] `git pull` to make sure you have the latest (relevant if anything was changed elsewhere)
- [ ] If the change is non-trivial, create a branch: `git checkout -b fix-something`

---

## Making a change

1. **Edit** the file(s) you need to change
2. **Test locally** — open the relevant HTML file in your browser, hard-refresh (Ctrl+Shift+R or Cmd+Shift+R), check for errors in DevTools Console (F12 → Console tab)
3. **Click through the four views** (Today, Trend, Insights, Coach) and the affected feature path
4. **Verify the test scenarios** for the change (see "Test scenarios" below)
5. **Diff what you're about to commit:** `git diff` (or open the change in a Git GUI)
6. **Commit** with a clear message: `git commit -am "Fix net deficit math when exercise is 0"`

---

## Deploy to live

After committing locally:

1. **Push to GitHub:** `git push origin main`
2. **Open Bluehost cPanel** → Git Version Control → click the project's "Manage" link
3. **Pull tab** → click **Update from Remote** (this fetches your push)
4. **Deployment tab** → verify the latest commit hash matches what you just pushed → click **Deploy HEAD Commit**
5. **Hard-refresh https://caloriecorrect.com/** in an incognito window (so cache doesn't lie to you) — wait 10 seconds, then refresh again
6. **Smoke check:** landing page loads → click "Get Started" → app loads → onboarding or Today view renders

If smoke check fails: **do not start fixing forward**. Roll back first (see below), then debug locally.

---

## Rollback (when something breaks live)

The whole reason for this setup. Two flavors:

### Just-broke rollback (last commit was the bad one)

```bash
git revert HEAD
git push origin main
```

Then in cPanel → Git Version Control → Update from Remote → Deploy HEAD Commit.

This creates a new commit that undoes the broken one. History is preserved (you can see exactly what was reverted), and the live site goes back to the last known good state.

### Rollback to a specific known-good version

Find the commit hash of the version you want:

```bash
git log --oneline
```

Pick the hash (e.g. `a1b2c3d`). Then:

```bash
git revert --no-commit a1b2c3d..HEAD
git commit -m "Revert to a1b2c3d"
git push origin main
```

Then deploy via cPanel as above.

### Emergency: live site is broken right now

If the site is fully broken and you need to revert in 30 seconds without thinking:

1. cPanel → Git Version Control → Manage → **Deployment tab**
2. There's a list of recent commits. Click "Deploy" on a previous one.

This rolls the *server* back without touching your local repo. Useful as a panic button. Once you're recovered, do a proper `git revert` + push to keep the repo in sync with what's live.

---

## Test scenarios (run after any change to app.js)

These are the sanity-check paths to walk through:

**Onboarding (in incognito, so localStorage is empty):**
- Land on https://caloriecorrect.com/app/
- Welcome screen appears → click Continue
- Each of the 7 steps (welcome, weight, basics, scale, plan, expectations, done) progresses without console errors
- Land on Today with the user's name showing

**Logging:**
- On Today, type a meal in the parser ("Greek yogurt with berries 200 cal")
- Save → it appears in today's meals
- Click the meal → edit modal opens → change calories → save → updates
- Click Weigh in → enter weight → save → appears on Trend

**Math sanity:**
- Trend chart renders with weight line + 7-day average + target trajectory
- Today shows current weight, today's intake, today's target, and net deficit
- Calibration card on Today shows a sensible message (not "NaN", not blank)

**Persistence:**
- Refresh the page — all logged data persists
- Hit the "Settings" gear → "Export data" → JSON file downloads with all data
- Settings → "Import Seth's spreadsheet" → 84 days of historical data populates Trend

**No console errors at any point.** Open DevTools → Console tab. Red text = bad.

---

## Conventions for AI-assisted changes (Claude / Cowork)

When I (Seth) ask Claude to make changes:

1. **Claude must work in this Git workflow.** Each change should result in a commit with a clear message. No "and also I cleaned up these other 5 files" sneaking in.
2. **Before committing, Claude should run `node --check app/app.js`** to catch syntax errors. (CSS doesn't have a syntax check; brace balance via `python3 -c "c=open('app/styles.css').read(); print(c.count('{') == c.count('}'))"` is a reasonable approximation.)
3. **Claude should not deploy.** Push to GitHub is fine; the cPanel deploy step is mine to do, so I always know what just went live.
4. **For non-trivial changes (cycle-level work), Claude should create a feature branch** and only merge to main after I've reviewed and tested locally.
5. **Claude should never delete files in the deploy folder on the server.** Server is downstream-only.

---

## What's actually in version control

In:
- `index.html`, `app/index.html`, `app/app.js`, `app/styles.css`, `app/chart.umd.min.js`
- `mockup.html`, `onboarding.html` (reference designs)
- `README.md`, `WORKFLOW.md`, `Calorie_Correct_Roadmap.docx`

Out (see `.gitignore`):
- `*.bak` files (local safety copies)
- `*.zip` (deploy artifacts)
- `deploy/`, `calorie-correct-deploy/` (old build folders)
- `app-test.js`, `app-fresh.js`, `sync-test.txt` (debugging cruft)
- `node_modules/`, `.DS_Store`, editor configs

---

## Branching strategy

**The lean workflow: commit straight to main, no feature branches.**

There is only ever one branch in active use (`main`) and one folder (`C:\Users\immin\Documents\Claude\Projects\Calorie Correct\`). Two scripts in the project root automate everything:

- **`ship.bat "message"`** — stages all changes, commits with the message, pushes to GitHub. One command for the entire git workflow.
- **`rollback.bat`** — creates a revert commit that undoes the most recent ship, then pushes. Asks for confirmation before doing anything.

**Standard deploy flow:**

1. Claude makes changes to files locally (you wait while he works + smoke-tests)
2. Open `app/index.html` in your browser, click through Today / Trend / Insights / Coach (1–2 min)
3. In your terminal in the project folder, run:
   ```
   ship.bat "Short description of what changed"
   ```
4. Open Bluehost cPanel → Git Version Control → Manage on `calorie-correct`
5. Click **Update from Remote**, then **Deploy HEAD Commit**
6. Hard-refresh https://caloriecorrect.com in an incognito window to verify

Total: 1 command + 2 clicks.

**Rollback flow (when something breaks live):**

1. In your terminal, run:
   ```
   rollback.bat
   ```
2. Confirm `y` when prompted
3. cPanel: Update from Remote → Deploy HEAD Commit (same as a normal deploy)

Total: 1 command + 2 clicks.

**Where the safety comes from:**

- Claude smoke-tests every change in JSDOM before reporting "ready to ship", catching JS syntax errors and obvious render bugs before they ever reach your machine
- You test once locally in a real browser before running `ship.bat`, catching anything visual or interactive
- If something still slips through, `rollback.bat` undoes it in one step. The live site goes back to the last known good version.
- All commits stay in the GitHub history forever, so you can always inspect or revert any specific commit by hash if needed

**When to use a feature branch instead:**

Only when you want to abandon the work entirely without committing it to main. For example: experimenting with a major redesign you might throw away. In that case:

```
git checkout -b experiment/something
# work happens
git checkout main           # Throws away everything; never merged
git branch -D experiment/something
```

For everything else — including big multi-file feature batches like the logging overhaul — commit to main directly. Claude's pre-commit testing handles the safety.

**What about a staging environment?**

Not yet. For static-site changes that you can fully test by opening `app/index.html` locally, a staging deploy adds friction without much new safety. The real bugs that would justify staging (server-side caching, HTTPS-only behaviors, cross-browser issues we can't reproduce locally) haven't bitten us. If they do, we'll add a `staging` branch and a `caloriecorrect.com/staging/` deploy then.

---

## When in doubt

- **Don't push if local browser shows console errors.**
- **Don't deploy if `git status` is dirty after committing.** That means there's unfinished work that won't go to prod.
- **Always smoke-test live in an incognito window** so browser cache can't mask a broken deploy.
- **Keep commits small.** It's much easier to revert one of fifteen tiny commits than to surgically extract one bug from a giant one.
