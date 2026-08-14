# Public intake forms (DailyBot)

Both public Corag forms post to the Cloudflare Pages Function
`POST /api/contact` (`functions/api/contact.ts`), which forwards structured
responses to the **DailyBot Forms** public API. DailyBot is the **system of
record**. An optional **Resend** auto-acknowledgement may run after a successful
DailyBot `201` and must never block success.

There is no local DailyBot mock — exercising Forms against a real
`DAILYBOT_API_KEY` hits the live workspace. Prefer unit tests for mapping; when
you must smoke-test, prefix subjects and messages with `[TEST]` and delete the
junk responses afterwards.

## The two forms

| Form | UI | Route | `_form` |
|------|----|-------|---------|
| Contact | `ContactForm.svelte` | `/contact`, `/en/contact` | `contact` |
| Code of Conduct | `ConductReportForm.svelte` | `/conduct#conduct-report-form` | `conduct` |

Newsletter signup is disabled in the UI and has no backend.

## Form and question ids come from the environment

This is the part most likely to surprise you. The DailyBot form uuid and its
question uuids are **not** in source. They are read at request time from:

| Variable | Shape |
|----------|-------|
| `DAILYBOT_CONTACT_FORM` | `{"uuid":"<form-uuid>","q":{"NAME":"…","EMAIL":"…","TOPIC":"…","SUBJECT":"…","MESSAGE":"…","LANG":"…","PAGE_PATH":"…"}}` |
| `DAILYBOT_CONDUCT_FORM` | `{"uuid":"…","q":{"INCIDENT":"…","WHEN":"…","PEOPLE":"…","ANONYMOUS":"…","REPORTER_NAME":"…","REPORTER_EMAIL":"…","FOLLOWUP":"…","LANG":"…","PAGE_PATH":"…"}}` |

`resolveFormConfig()` in `functions/api/_dailybot.ts` parses them and validates
that every required question id is present. **A missing, unparseable or partial
mapping returns 503 and sends nothing.**

That is deliberate. The ids used to be baked into source, and they belonged to a
different workspace — a misconfigured deploy would have silently posted real
submissions into somebody else's forms. Failing closed is the safe direction.

## Environment

| Variable | Where | Notes |
|----------|-------|-------|
| `DAILYBOT_API_KEY` | Cloudflare / local Functions only | **Never** `PUBLIC_*`. Sent as `X-API-KEY`. |
| `DAILYBOT_CONTACT_FORM`, `DAILYBOT_CONDUCT_FORM` | Same | Required. Without them the endpoint 503s. |
| `PUBLIC_CONTACT_API_ENDPOINT` | Build | Optional override. Defaults to `/api/contact`. |
| `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` | Optional | Submitter acknowledgement after DailyBot success |
| `CONTACT_RATE_LIMIT` / `CONTACT_RATE_WINDOW_MS` | Optional | Default 8 requests / 600000 ms |
| `CONTACT_ALLOWED_ORIGINS` | Optional | CORS allowlist |

**Local Functions:** plain `pnpm run dev` does **not** run Cloudflare Pages
Functions. Use `wrangler pages dev` (or a preview deploy) with the variables
bound for an end-to-end smoke test.

## API contract

```json
{
  "_form": "contact",
  "name": "…",
  "email": "…",
  "topic": "ally",
  "subject": "…",
  "message": "…",
  "lang": "es",
  "page_path": "/contact/",
  "website": ""
}
```

- `_form`: `contact` | `conduct`
- Without `_form`, `reason`/`topic` maps `conduct`/`coc` → `conduct`, everything
  else → `contact`
- Honeypot `website` must be empty. If filled, the endpoint returns a fake `200`
  and forwards nothing
- DailyBot POST: `https://api.dailybot.com/v1/forms/{uuid}/responses/` with
  `{ content, automation: true }`

## Contact topics

The canonical set lives in `src/lib/contact-form.ts` and is mirrored for the
Function in `functions/_lib/intake-helpers.ts`:

`general` · `organization` · `ally` · `press` · `report` · `conduct` · `other`

Retired topics from the previous site (`sponsorship`, `collaboration`,
`tech-talk`, `cfs`, `speaker`, `project`) are kept in the alias table so an old
bookmarked link still lands on a live topic instead of falling through.

### Multiple-choice values

This workspace's DailyBot forms use **choice value === label** (e.g. `"General"`,
`"Ally"`). `lookupChoice` in `_dailybot.ts` maps site slugs to labels. Do not
invent a parallel slugified POST contract — the API rejects it.

Booleans send JSON `true` / `false`, not `"Yes"` / `"No"`.

## The conduct form's anonymity guarantee

When `anonymous` is set, the handler clears `email` **before** any mapping, so:

- No name or email reaches DailyBot, even if the client sends them.
- No Resend acknowledgement fires, because there is nowhere to send it.

`tests/unit/functions/contact-dailybot.test.ts` pins both behaviours, including
the case where a client sneaks an address into an anonymous payload.

## Error mapping

| Upstream | Returned | `error` |
|----------|----------|---------|
| No `DAILYBOT_API_KEY` | 503 | `backend_not_configured` |
| Form mapping missing or partial | 503 | `backend_not_configured` |
| DailyBot 401 / 403 | 502 | `backend_not_configured` |
| DailyBot rejects a choice | 400 | `invalid_choice` |
| DailyBot missing required | 400 | `missing_required` |
| Network failure | 502 | `send_failed` |

A 401 from DailyBot is our misconfiguration, not the caller's — the client gets
a 502 and a message that does not leak the upstream status.

## Related

- [Contact Form](./CONTACT_FORM.md) — the client-side component contract
- [Security](../SECURITY.md) — the threat model these rules come from
