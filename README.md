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

The provider body includes the original requested service, shipping method, every service need, every inspection type, customer fields, source attribution and a non-sensitive submission ID. The subject may summarize the first service needs, but the body is not shortened.

The provider wait is capped at 18 seconds inside the 30-second route limit. That reserves up to three 3-second shared-store operations plus response headroom, so the application can return an honest `PENDING` result when acceptance cannot be confirmed. Status rules are strict:

- `SUCCESS` is returned only after an explicit upstream acceptance. It sets a five-minute HttpOnly cookie bound to that request ID and redirects to the matching `/thank-you/?request_id=...` URL.
- `FAILED` covers validation, configuration and explicit provider rejection. The customer may correct the form and retry.
- `PENDING` covers timeouts, network uncertainty, HTTP 202, non-JSON and ambiguous provider replies. It is not counted as success and is not resent automatically.

Protection includes browser validation, server allowlists, a consent checkbox, honeypot, 32 KB request limit, same-page submit locking, IP-based rate limiting and an idempotency claim keyed to one normalized cargo submission. Different cargo is not blocked merely because it shares an email address or IP.

Public Preview and Production requests require an explicitly configured Upstash Redis store. Atomic Redis scripts claim an idempotency key, record `SUCCESS` / `FAILED` / `PENDING`, and apply the shared rate limit before the provider is called. A request already marked `PROCESSING` returns the same submission ID as `PENDING`; it does not call the provider again. If the provider has been called but the final state write cannot be confirmed, the route returns `PENDING / STATE_STORE_WRITE_UNKNOWN`, sets no success cookie and does not automatically resend. This reduces identified duplicate-delivery paths but is not an absolute “never duplicate” guarantee: storage loss, expiry, or a genuinely new submission key remain outside that claim.

Process memory is permitted only for loopback QA when `INQUIRY_STATE_STORE=memory` and `INQUIRY_ALLOW_MEMORY_STATE=true` are both explicit. Public requests never silently fall back to a `Map`. Missing or invalid shared-store configuration fails before provider delivery with `STATE_STORE_CONFIGURATION_ERROR`.

### Provider configuration

Before a public Preview or Production deployment, connect an Upstash Redis integration through the Vercel Marketplace and configure these server-only values in the matching environment scope:

```text
INQUIRY_STATE_STORE=upstash-redis
UPSTASH_REDIS_REST_URL=<injected by the Redis integration>
UPSTASH_REDIS_REST_TOKEN=<injected by the Redis integration>
INQUIRY_STATE_KEY_SECRET=<independent random server-only secret>
INQUIRY_STATE_NAMESPACE=gdlogi:inquiry
```

Do not expose the URL token or key secret through `NEXT_PUBLIC_*`. The application does not contain a production credential and cannot verify the Vercel dashboard values from this working tree.

On a public host, the existing FormSubmit endpoint is used when no override is configured. A remote `INQUIRY_PROVIDER_ENDPOINT` override must use HTTPS; malformed, `.invalid`, loopback, link-local and private-network production targets fail clearly instead of reporting success.

Local requests are blocked from contacting the real provider by default. Controlled browser QA requires all of the following and is accepted only when the incoming site host is also loopback:

```bash
INQUIRY_PROVIDER_MODE=local-mock
INQUIRY_PROVIDER_ENDPOINT=http://127.0.0.1:3218/mock
INQUIRY_ALLOW_LOCAL_MOCK=true
INQUIRY_STATE_STORE=memory
INQUIRY_ALLOW_MEMORY_STATE=true
```

`pnpm mock:inquiry-provider` starts the repository's loopback-only controllable provider. Its default result is explicit acceptance; local QA may switch it to `failed`, `pending` or `ambiguous` through its loopback control path. It is test tooling only and must never be used as a production endpoint.

These values are local-QA settings and must not be copied into deployment. `INQUIRY_ALLOW_REAL_PROVIDER_LOCAL=true` is reserved for a separately approved controlled inbox test. See `.env.example`; `.env*` files are ignored except for that secret-free template.

### Verification status

- Local unit and route tests use injected or loopback-only mocks and never contact FormSubmit.
- A historical owner-approved test reached `zoe@gdlogi.com` on 2026-10-21, before the current multi-service and inspection-type schema.
- One owner-approved pre-country-split call was made on 2026-11-11. The application conservatively returned `PENDING / PROVIDER_RESPONSE_UNKNOWN` for request `GL-20261111-5D836B44`, did not set a success cookie and did not retry. The owner confirmed exactly one message arrived, the then-current field body was present and clicking Reply addressed the controlled contact mailbox. The new separate `destination_country` field, the shared production store and delivery of a manually sent reply remain `NOT_VERIFIED` in a real deployed environment; see `artifacts/controlled-real-inbox-test-2026-11-11.md`.
- Production status must be verified against the live domain and the recorded Vercel deployment for the release commit; do not infer it from a local repository snapshot.

The website does not persist customer inquiries in this repository and does not claim a CRM integration. After inbox receipt, use the private follow-up fields and status rules in `docs/INQUIRY-FOLLOW-UP-RECORD.md` in the company's existing private spreadsheet or CRM.

The internal 30-day publishing sequence is documented in `docs/CONTENT-PLAN-30-DAYS-2026-11-15.md`. Every item still requires the listed source material before publication.

## Analytics

The application emits anonymous local events. It does not load Google Tag Manager unless a valid `GTM_CONTAINER_ID` is configured and analytics consent is explicitly granted. No real container ID is committed, and current production collection is not claimed. Success events fire only after explicit provider acceptance and contain no name, email, phone number or free-text cargo data. See `docs/ANALYTICS-SETUP.md`.

## Release readiness

Unverified certificates, shipment outcomes, detailed office address, case-publication rights and final legal details remain unpublished. Review `artifacts/launch-readiness-checklist.md` and `artifacts/final-release-validation-2026-11-15.md` before any production release.
