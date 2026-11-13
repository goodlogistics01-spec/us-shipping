# Good Logistics Website

This repository contains the GOOD LOGISTICS B2B website for China-side cargo operations and China-to-USA freight and final-delivery coordination. `Good Logistics Co., Ltd.` is owner-approved public wording; whether it is the official registered English legal name still requires a source document.

## Public routes

- Homepage at `/`
- Nine substantive service pages under `/services/`
- Destination pages for Hawaii, Alaska and Puerto Rico under `/destinations/`
- Resource hub at `/resources/`
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
pnpm test:preview http://127.0.0.1:3000
```

The root `pnpm-lock.yaml` is the only package lock. Do not add npm, Yarn or Bun lock files.
`test:preview` only accepts a loopback origin and verifies current sitemap pages,
internal links and fragments, legacy redirects, SEO metadata, brand/contact
consistency, image attributes/assets and thank-you indexing/cookie boundaries.

## Inquiry delivery

All active forms submit to the same-origin `/api/inquiry/` route. Service-page links open `/quote/` with editable service and shipping-method preselection; the receiving-checks page also preselects the receiving-check type.

The shared schema keeps these concepts separate:

- Shipping method
- Multi-value service needs
- Receiving checks: agreed quantity, outer-carton, label and visible-damage checks
- Product-quality inspection: project-specific scope, sampling, criteria and reporting to confirm
- Legacy generic `Inspection`: retained as “type not specified; confirm scope,” never promoted to professional inspection

The provider body includes the original requested service, shipping method, every service need, every inspection type, customer fields, source attribution and a non-sensitive submission ID. The subject may summarize the first service needs, but the body is not shortened.

The provider wait defaults to 24 seconds inside the 30-second route limit so the application has time to return an honest `PENDING` result when acceptance cannot be confirmed. Status rules are strict:

- `SUCCESS` is returned only after an explicit upstream acceptance. It sets a five-minute HttpOnly cookie bound to that request ID and redirects to the matching `/thank-you/?request_id=...` URL.
- `FAILED` covers validation, configuration and explicit provider rejection. The customer may correct the form and retry.
- `PENDING` covers timeouts, network uncertainty, HTTP 202, non-JSON and ambiguous provider replies. It is not counted as success and is not resent automatically.

Protection currently includes browser validation, server allowlists, a consent checkbox, honeypot, 32 KB request limit, same-page submit locking, a bounded per-instance IP rate limit and a bounded per-instance idempotency store keyed to one normalized cargo submission. Different cargo is not blocked merely because it shares an email address or IP. The two Maps are best-effort single-instance controls only; they do not survive a restart and are not reliable across multiple deployment instances. A durable distributed store remains a deployment-platform decision.

### Provider configuration

On a public host, the existing FormSubmit endpoint is used when no override is configured. A remote `INQUIRY_PROVIDER_ENDPOINT` override must use HTTPS; malformed, `.invalid`, loopback, link-local and private-network production targets fail clearly instead of reporting success.

Local requests are blocked from contacting the real provider by default. Controlled browser QA requires all of the following and is accepted only when the incoming site host is also loopback:

```bash
INQUIRY_PROVIDER_MODE=local-mock
INQUIRY_PROVIDER_ENDPOINT=http://127.0.0.1:3199/mock
INQUIRY_ALLOW_LOCAL_MOCK=true
```

These values are local-QA settings and must not be copied into deployment. `INQUIRY_ALLOW_REAL_PROVIDER_LOCAL=true` is reserved for a separately approved controlled inbox test. See `.env.example`; `.env*` files are ignored except for that secret-free template.

### Verification status

- Local unit and route tests use injected or loopback-only mocks and never contact FormSubmit.
- A historical owner-approved test reached `zoe@gdlogi.com` on 2026-10-21, before the current multi-service and inspection-type schema.
- One owner-approved current-schema call was made on 2026-11-11. The application conservatively returned `PENDING / PROVIDER_RESPONSE_UNKNOWN` for request `GL-20261111-5D836B44`, did not set a success cookie and did not retry. The owner then confirmed exactly one message arrived, the complete current field body was present and clicking Reply addressed the controlled contact mailbox. Delivery of a manually sent reply remains `NOT_VERIFIED`; see `artifacts/controlled-real-inbox-test-2026-11-11.md`.
- Production status must be verified against the live domain and the recorded Vercel deployment for the release commit; do not infer it from a local repository snapshot.

## Analytics

The application emits anonymous local events. It does not load Google Tag Manager unless a valid `GTM_CONTAINER_ID` is configured and analytics consent is explicitly granted. No real container ID is committed, and current production collection is not claimed. Success events fire only after explicit provider acceptance and contain no name, email, phone number or free-text cargo data. See `docs/ANALYTICS-SETUP.md`.

## Release readiness

Unverified certificates, shipment outcomes, detailed office address, case-publication rights and final legal details remain unpublished. Review `artifacts/launch-readiness-checklist.md` and the latest local validation record before any production release.
