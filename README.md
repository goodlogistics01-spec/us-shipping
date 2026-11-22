# Good Logistics Website

This repository contains the GOOD LOGISTICS B2B website for China-side cargo operations and China-to-USA freight and final-delivery coordination. `Good Logistics Co., Ltd.` is owner-approved public wording; whether it is the official registered English legal name still requires a source document.

## Public routes

- Homepage at `/`
- Ten substantive service pages under `/services/`, including International Express
- Destination pages for Hawaii, Alaska and Puerto Rico under `/destinations/`
- Resource hub at `/resources/` and the original multi-supplier consolidation checklist
- Company and Zoe Zhou profile pages under `/about/`
- Unified inquiry form at `/quote/`, plus the homepage and Sea Freight forms
- Contact, privacy, terms, custom 404, `robots.txt` and `sitemap.xml`

Legacy source files remain in `public/` for compatibility and rollback, but their HTTP requests are intercepted by the exact redirects in `next.config.mjs` before static-file serving. The old standalone inquiry file redirects permanently to `/quote/`. Five legacy article URLs redirect permanently and one-to-one to the closest current service or destination page; their embedded popups are not active inquiry entry points. No blanket legacy-directory redirect is used.

## Runtime and commands

- Node.js `>=20.9.0`
- pnpm `11.25.0`
- Next.js `16.3.1`
- React / React DOM `19.2.8`

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm dev
pnpm build
pnpm start
pnpm mock:inquiry-provider
pnpm test:preview http://127.0.0.1:3000
```

The root `pnpm-lock.yaml` is the only package lock. Do not add npm, Yarn or Bun lock files.
`test:preview` only accepts a loopback origin and verifies current sitemap pages,
internal links and fragments, legacy redirects, SEO metadata, brand/contact
consistency, image attributes/assets and thank-you indexing/cookie boundaries.

## Inquiry delivery

All active forms submit to the same-origin `/api/inquiry/` route. Service-page links open `/quote/` with editable service and shipping-method preselection; the receiving-checks page also preselects the receiving-check type.

The shared schema keeps these concepts separate:

- Destination country, plus the editable destination city / postal code / warehouse field retained as legacy `destination`
- Shipping method
- Multi-value service needs
- Receiving checks: agreed quantity, outer-carton, label and visible-damage checks
- Product-quality inspection: project-specific scope, sampling, criteria and reporting to confirm
- Legacy generic `Inspection`: retained as “type not specified; confirm scope,” never promoted to professional inspection

The HubSpot record and Resend notification body retain the original requested service, shipping method, every service need, every inspection type, customer fields, source attribution and a non-sensitive submission ID. HubSpot is the primary inquiry record; Resend is a secondary inbox notification. They are called serially, never in parallel.

The route reserves time for four 3-second shared-store operations, an 8-second HubSpot call, a 5-second Resend call and response headroom inside the 30-second Vercel limit. Status rules are strict:

- `SUCCESS` is returned only after HubSpot explicitly accepts the inquiry. It sets a five-minute HttpOnly cookie bound to that request ID and redirects to the matching `/thank-you/?request_id=...` URL. Resend acceptance and actual inbox receipt remain separate facts.
- `FAILED` covers validation, configuration and explicit HubSpot rejection before the inquiry is stored. The customer may correct the form and retry.
- `PENDING` covers an uncertain HubSpot result or an uncertain CRM checkpoint. It is not counted as success and is not resent automatically.
- Once HubSpot has accepted the inquiry, a Resend rejection or uncertain notification does not turn the customer result into failure or invite a duplicate inquiry. The CRM record remains the recovery source.

Protection includes browser validation, server allowlists, a consent checkbox, honeypot, 32 KB request limit, same-page submit locking, IP-based rate limiting and an idempotency claim keyed to one normalized cargo submission. Different cargo is not blocked merely because it shares an email address or IP.

Public Preview and Production requests require an explicitly configured Upstash Redis store. Atomic Redis scripts claim an idempotency key, apply the shared rate limit and move an accepted inquiry through `PROCESSING → CAPTURED → final`. `CAPTURED` contains only non-PII status/Provider identifiers and is already a replayable overall success because HubSpot has accepted the inquiry. A replay never resumes either Provider. A request still marked `PROCESSING` returns the same submission ID as `PENDING`. This reduces identified duplicate-delivery paths but is not an absolute “never duplicate” guarantee: storage loss, expiry, a new submission key or Provider behavior outside the application remain outside that claim.

Process memory is permitted only for loopback QA when `INQUIRY_STATE_STORE=memory` and `INQUIRY_ALLOW_MEMORY_STATE=true` are both explicit. Public requests never silently fall back to a `Map`. Missing or invalid shared-store configuration fails before provider delivery with `STATE_STORE_CONFIGURATION_ERROR`.

### Provider configuration

Before the controlled Preview, configure these server-only values in the Vercel Preview scope only:

```text
INQUIRY_DELIVERY_MODE=hubspot-resend
INQUIRY_ALLOW_REAL_PROVIDER_PREVIEW=true
HUBSPOT_PORTAL_ID=<HubSpot account ID>
HUBSPOT_FORM_GUID=<dedicated website-inquiry form GUID>
HUBSPOT_ACCESS_TOKEN=<supported server credential>
HUBSPOT_DETAILS_FIELD=gdlogi_inquiry_details
HUBSPOT_SUBMISSION_TIMEOUT_MS=8000
RESEND_API_KEY=<server credential>
RESEND_FROM_EMAIL=GOOD LOGISTICS Website <website@mail.gdlogi.com>
INQUIRY_TO_EMAIL=zoe@gdlogi.com
RESEND_NOTIFICATION_TIMEOUT_MS=5000
INQUIRY_STATE_STORE=upstash-redis
UPSTASH_REDIS_REST_URL=<injected by the Redis integration>
UPSTASH_REDIS_REST_TOKEN=<injected by the Redis integration>
INQUIRY_STATE_KEY_SECRET=<independent random server-only secret>
INQUIRY_STATE_NAMESPACE=gdlogi:inquiry:preview
```

Do not expose credentials through `NEXT_PUBLIC_*`. Missing credentials, the wrong Vercel scope, an unapproved environment gate or an unexpected recipient fail closed before either external Provider is called. Production requires a separate `INQUIRY_ALLOW_REAL_PROVIDER_PRODUCTION=true` decision and Production-scoped credentials; Preview settings do not authorize Production.

The HubSpot form must contain the standard contact fields and a multiline contact property matching `HUBSPOT_DETAILS_FIELD`. Resend must use a verified sender for general delivery. Provider-issued DNS records are prepared separately and must not be changed without owner approval. The legacy FormSubmit adapter remains only for the loopback mock and historical rollback analysis; the public candidate has no implicit FormSubmit fallback.

Local requests are blocked from contacting the real provider by default. Controlled browser QA requires all of the following and is accepted only when the incoming site host is also loopback:

```bash
INQUIRY_DELIVERY_MODE=legacy-formsubmit
INQUIRY_PROVIDER_MODE=local-mock
INQUIRY_PROVIDER_ENDPOINT=http://127.0.0.1:3218/mock
INQUIRY_ALLOW_LOCAL_MOCK=true
INQUIRY_STATE_STORE=memory
INQUIRY_ALLOW_MEMORY_STATE=true
```

`pnpm mock:inquiry-provider` starts the repository's loopback-only controllable legacy adapter. Its default result is explicit acceptance; local QA may switch it to `failed`, `pending` or `ambiguous` through its loopback control path. It is test tooling only and must never be used as a public endpoint.

These values are local-QA settings and must not be copied into deployment. `INQUIRY_ALLOW_REAL_PROVIDER_LOCAL=true` is reserved for a separately approved controlled inbox test. See `.env.example`; `.env*` files are ignored except for that secret-free template.

### Verification status

- Local unit, route and dual-provider integration tests use injected or loopback-only mocks and contact neither HubSpot, Resend nor FormSubmit.
- HubSpot + Resend code and the CRM `CAPTURED` checkpoint are verified locally. HubSpot account/form credentials, Resend sender/domain, Vercel Preview variables, actual CRM creation, Resend acceptance, inbox receipt and Reply-To remain `NOT_VERIFIED` until the controlled Preview test.
- A historical owner-approved test reached `zoe@gdlogi.com` on 2026-10-21, before the current multi-service and inspection-type schema.
- One owner-approved pre-country-split call was made on 2026-11-11. The application conservatively returned `PENDING / PROVIDER_RESPONSE_UNKNOWN` for request `GL-20261111-5D836B44`, did not set a success cookie and did not retry. The owner confirmed exactly one message arrived, the then-current field body was present and clicking Reply addressed the controlled contact mailbox. The new separate `destination_country` field, the shared production store and delivery of a manually sent reply remain `NOT_VERIFIED` in a real deployed environment; see `artifacts/controlled-real-inbox-test-2026-11-11.md`.
- Current Production remains on its previously deployed implementation and has not been changed by this local/Preview migration work. Production status must be verified against the live domain and recorded Vercel deployment; do not infer it from this working tree.

The repository itself stores no customer inquiries. When the candidate is configured, HubSpot stores the private inquiry record and Resend sends the notification; deployment activation is not claimed until verified. Use `docs/INQUIRY-FOLLOW-UP-RECORD.md` to reconcile CRM, notification and actual inbox status.

The internal 30-day publishing sequence is documented in `docs/CONTENT-PLAN-30-DAYS-2026-11-15.md`. Every item still requires the listed source material before publication.

## Analytics

The application emits anonymous local events. It does not load Google Tag Manager unless a valid `GTM_CONTAINER_ID` is configured and analytics consent is explicitly granted. No real container ID is committed, and current production collection is not claimed. Success events fire only after explicit provider acceptance and contain no name, email, phone number or free-text cargo data. See `docs/ANALYTICS-SETUP.md`.

## Release readiness

Unverified certificates, shipment outcomes, detailed office address, case-publication rights and final legal details remain unpublished. Review `artifacts/launch-readiness-checklist.md` and `artifacts/final-release-validation-2026-11-15.md` before any production release.
