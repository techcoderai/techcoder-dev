# Newsletter

Readers subscribe through the `NewsletterBox` form (homepage and article
pages). Subscribers are stored as contacts in [Resend](https://resend.com);
TechCoder has no database of its own.

## How it works

```
NewsletterBox (client)  ──POST { email }──►  app/api/newsletter/route.ts
                                                      │
                                                      ▼
                                           lib/newsletter.ts  ──►  Resend API
```

1. `components/ui/NewsletterBox.tsx` posts the email to `/api/newsletter`.
2. `app/api/newsletter/route.ts` validates the request body and calls
   `subscribeToNewsletter()`.
3. `lib/newsletter.ts` normalizes the email, asks Resend whether the contact
   already exists, creates it if not, and sends a welcome email.

`lib/newsletter.ts` is the only file that talks to Resend. To switch
providers, rewrite just this file and keep the same `SubscribeResult` return type.

## Response statuses

| `status` | HTTP | Meaning | UI shows |
| --- | --- | --- | --- |
| `subscribed` | 200 | New contact created, welcome email sent | Success |
| `duplicate` | 200 | Email already subscribed | "Already subscribed" |
| `invalid` | 400 | Bad body or email format | Validation message |
| `error` | 502 | Missing API key, or Resend failed | Generic error |

A failed welcome email is logged, but the signup still counts as `subscribed`.

## Local setup

1. Create a Resend account and an API key.
2. Verify a sending domain or address in Resend.
3. In `morya-techcoder/.env`:
   ```bash
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL="TechCoder <hello@your-verified-domain>"
   # RESEND_AUDIENCE_ID=...   # only for older, audience-scoped Resend workspaces
   ```
4. Restart `npm run dev`.

Without `RESEND_API_KEY` the form returns `error` ("fails closed": it refuses
rather than pretending to work), and the rest of the site works normally.
Without `RESEND_FROM_EMAIL`, signups still succeed but no welcome email is sent.

## Known gaps

- **No unsubscribe link or route.** The privacy page promises an unsubscribe
  link in every email, and the welcome email doesn't have one yet. Fix this
  before sending any real campaign.
- **No abuse protection** (no rate limit, CAPTCHA, or honeypot) on `/api/newsletter`.
- **No double opt-in.** Anyone can subscribe any address.
- **No way to send new-post emails yet.** Subscribers are only collected.
