# Inquiry delivery Preview migration — 2026-11-23

## Scope and baseline

- Branch: `codex/gdlogi-v2-optimization-20261115`
- Baseline: `310ed09062805390e9caf5e67dbb9e4946711d09`
- Scope: replace the candidate's public FormSubmit dependency with HubSpot free CRM as the primary inquiry record and Resend as a separate email notification.
- Production: unchanged. No Production environment variable, DNS record, domain, deployment or live inquiry was changed by this implementation.
- Payment: none authorized or performed.

## Implemented contract

1. The same-origin form route validates the existing field contract, honeypot, consent, request size and idempotency key.
2. Shared Redis claims the submission and applies the shared rate limit.
3. HubSpot receives the complete inquiry first through its fixed authenticated Forms endpoint.
4. Explicit HubSpot acceptance is atomically recorded as a replayable `CAPTURED` success without storing contact or cargo text in Redis.
5. Resend is called once as a secondary notification with a fixed Zoe recipient, the validated customer email as Reply-To and `inquiry-notification/<submission_id>` as its Provider idempotency key.
6. A notification rejection or uncertain result does not erase the CRM record or invite a duplicate customer submission.

`SUCCESS` means HubSpot explicitly accepted the inquiry. It does not mean Resend delivered the notification to Zoe's inbox. `PENDING` is not automatically retried. The application reduces known duplicate paths but does not claim an absolute never-duplicate guarantee.

## Local verification

Status at initial implementation:

- HubSpot adapter tests: PASS with injected responses; no external call.
- Resend adapter tests: PASS with injected responses; no external call.
- Dual-provider route tests: PASS for configuration isolation, full-field transfer, HubSpot failure/uncertainty, CRM checkpoint failure, Resend failure/uncertainty, final-state failure, concurrent instances and restart replay.
- Shared-store tests: PASS for atomic claim, `CAPTURED`, final write and rate limiting with local test backends.
- Full project tests: PASS — 91/91.
- Production build: PASS — Next.js 16.3.1 generated 26 pages and retained `/api/inquiry` plus `/thank-you` as dynamic routes.
- Mobile browser mock regression at 390 × 844: PASS — SUCCESS redirected to the bound thank-you URL; FAILED stayed on Quote with retry enabled; PENDING stayed on Quote with submit disabled. A deliberate double click produced exactly one mock request in every state. No external Provider was called.
- Local preview acceptance: PASS — 22 sitemap pages, 1,219 internal-link references (43 unique targets), 41 legacy redirects, 65 rendered images and 22 image assets; metadata, canonical, brand/contact, robots, sitemap and thank-you noindex/cookie boundaries passed.

## External configuration and acceptance status

| Item | Status |
| --- | --- |
| Upstash Redis on current Vercel Preview | Previously connected for the candidate; must be rechecked after the new deployment |
| HubSpot free account, form, details property and supported server credential | `NOT_VERIFIED` |
| Resend account and API key | `NOT_VERIFIED` |
| Resend sending domain and Provider-issued DNS records | `NOT_VERIFIED`; DNS unchanged and requires separate owner confirmation |
| Vercel Preview variables and release-commit match | `NOT_VERIFIED` |
| One HubSpot TEST record | `NOT_VERIFIED` |
| One Resend accepted notification | `NOT_VERIFIED` |
| Actual receipt at `zoe@gdlogi.com`, one-copy count and Reply-To | `NOT_VERIFIED` |
| Production activation | Not performed |

The exact environment variable names are documented in `.env.example` and `README.md`; secret values must remain in Vercel and must never be committed or copied into public evidence.

## Historical FormSubmit archive

The owner received the FormSubmit API-key email on 2026-11-23. Archive reconciliation is pending the owner saving the API response locally without sharing the key. Any archive review must report only redacted counts, dates, request IDs and delivery status; the downloaded file must not enter Git.

## Rollback

This migration is being prepared as an independent local commit on top of `310ed09062805390e9caf5e67dbb9e4946711d09`. Before Preview deployment, record the final commit and Vercel Preview deployment ID. Production remains on its existing deployment, so no Production rollback action is created by this Preview-only work.
