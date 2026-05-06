# Calorie Correct — Coach Worker

Cloudflare Worker that proxies chat messages to the Anthropic API. The
frontend on caloriecorrect.com calls this Worker; the Worker calls Claude.

## First-time deploy (run from this `worker/` directory)

```
wrangler secret put ANTHROPIC_API_KEY
```

You'll be prompted to paste your Anthropic key. The key is encrypted by
Cloudflare and never lives in the repo.

```
wrangler deploy
```

Wrangler prints the deployed URL — something like
`https://calorie-correct-coach.<your-subdomain>.workers.dev`.

## Verify it's live

Curl the health endpoint:

```
curl https://calorie-correct-coach.<your-subdomain>.workers.dev/api/health
```

Should return `{"ok":true,"model":"claude-haiku-4-5-20251001"}`.

## Test a real chat call

```
curl -X POST https://calorie-correct-coach.<your-subdomain>.workers.dev/api/coach \
  -H "Content-Type: application/json" \
  -d '{"message":"hi, are you working?"}'
```

Should return a JSON object with a `reply` field containing real Claude text.

## Subsequent deploys

Just `wrangler deploy` again. The secret is already set; you don't need to
re-do `wrangler secret put` unless you rotate the key.

## Endpoints

- `GET /api/health` — sanity check
- `POST /api/coach` — body: `{ message, history?, userContext? }`, returns `{ reply, model, usage }`

## Costs

Free tier: 100K Worker requests/day. Anthropic API costs roughly
$0.001-0.003 per coach turn with Haiku 4.5 — see Anthropic console for
running balance.
