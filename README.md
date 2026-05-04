# Calorie Correct

The honest calorie counter that calibrates to your real weight loss.

**Live site:** https://caloriecorrect.com

## Project layout

```
Calorie Correct/
├── index.html              # Landing page (caloriecorrect.com/)
├── app/                    # The actual app (caloriecorrect.com/app/)
│   ├── index.html          # App shell
│   ├── app.js              # All app logic (~173 KB, 2,800 lines)
│   ├── styles.css          # Design system + components (~61 KB)
│   └── chart.umd.min.js    # Chart.js v4.4.0 bundled locally
├── mockup.html             # Original design mockup (reference)
├── onboarding.html         # Original onboarding mockup (reference)
└── Calorie_Correct_Roadmap.docx   # Living roadmap doc
```

Everything is plain static HTML/CSS/JS. No build step. State persists in the browser's `localStorage`.

## Development workflow

See [WORKFLOW.md](./WORKFLOW.md) for the full deploy + rollback protocol.

**Short version:**

1. Make changes locally
2. Test by opening `app/index.html` in a browser
3. `git commit` with a clear message
4. `git push origin main`
5. In Bluehost cPanel → Git Version Control → click **Update from Remote** then **Deploy HEAD Commit**
6. Hard-refresh https://caloriecorrect.com/app/ and verify

## Stack

- Vanilla HTML/CSS/JS — no framework, no build, no compile
- Chart.js for the trend chart and bar charts
- `localStorage` for persistence
- Hosted on Bluehost shared hosting via cPanel

## Status

End of Cycle Personal — production live, ready for 30-day daily-use calibration test.
