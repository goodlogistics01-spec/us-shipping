# Targeted Release Closeout — 2026-11-22

## Release identity and scope

- Release label: `GDLOGI-WEB-2026.11.22-RC3`
- Requested and actual starting commit: `41b0457773e14dd6c6e8c089c301ab9e15168cca`
- Branch: `codex/gdlogi-v2-optimization-20261115`
- Scope: replacement Hero asset, international destination handoff, and production-suitable shared inquiry state.
- Excluded: production push/deployment, DNS/domain changes, live Provider calls, new video, new cases, new qualifications, and unverified scale claims.

## Hero asset

The homepage and Sea Freight page now use a container ship on calm blue-grey water. The previous photograph with prominent port signage and a rust-coloured road vehicle was removed from active assets.

- Source: [Container Ship on Sea](https://www.pexels.com/photo/container-ship-on-sea-20821680/)
- Photographer: Martin Hungerbühler
- Licence reviewed: [Pexels Licence](https://www.pexels.com/license/)
- Role: decorative industry context only; not a GOOD LOGISTICS vessel, shipment, carrier, route, facility, or case.
- Derivatives: AVIF and WebP with JPEG fallback; 16:9 desktop crops at 960, 1600, and 2400 px; 8:5 mobile crops at 640 and 960 px.
- Full provenance, dimensions, file sizes, crop basis, and use boundaries: `docs/VISUAL-ASSET-REGISTER-2026-11-22.md`.

Rendered evidence:

- `home-desktop-1440.png`
- `home-mobile-390.png`
- `sea-desktop-1440.png`
- `sea-mobile-390.png`

## Destination handoff

- Homepage entries prefill United States, Canada, United Kingdom, Australia, or New Zealand in an editable country field.
- Europe opens the Quote page without inventing a country and requires the customer to enter a specific European country.
- The generic Quote page now separates required `destination_country` from the retained `destination` city / postal code / warehouse field.
- `destination_country` and legacy `destination` are both normalized, validated, fingerprinted, sent to the API, and included in the Provider body.
- Historical payloads without `form_schema_version=2` remain accepted; legacy `country` is an alias for `destination_country`.
- U.S. destination and service pages keep their U.S. routes and default the country to United States. Generic China-operation pages remain international.

Browser evidence on the final local build:

- Canada entry: `destination_country=Canada`, editable.
- Europe entry: country blank, specific-country guidance visible; broad values such as `Europe` are rejected before Provider delivery.
- Sea Freight embedded form: `destination_country=United States`.
- Controlled mock success retained `destination_country=France` and `destination=Paris 75001` as separate fields.

## Production inquiry state

The public API is a dynamic Vercel Function. Live read-only requests returned `server: Vercel`, while `/api/inquiry/` returned `x-matched-path: /api/inquiry` and a multi-segment Vercel request ID. This deployment model cannot use a process-local `Map` as cross-instance protection.

The candidate therefore requires an Upstash Redis integration for public Preview and Production. Atomic Lua operations provide:

1. idempotency claim and conflict detection;
2. final `SUCCESS`, `FAILED`, or `PENDING` state recording; and
3. a shared sliding-window IP rate limit using a server-secret HMAC, without storing the raw IP.

Only the claim owner may call the Provider. A concurrent `PROCESSING` request returns the original request ID as `PENDING`; stored `PENDING` results replay without another Provider call. If the Provider has been called but state completion cannot be confirmed, the customer receives `PENDING / STATE_STORE_WRITE_UNKNOWN`, no success cookie is set, and no automatic resend occurs.

Public requests fail with `STATE_STORE_CONFIGURATION_ERROR` if the shared store is absent or invalid. They do not silently use process memory. Memory mode requires an explicit loopback-only QA configuration.

This design reduces known duplicate-delivery paths; it is not an absolute guarantee against duplicates after storage loss, record expiry, or a genuinely new submission key.

## Environment checklist

Configure these as server-only variables in both Vercel Preview and Production. No values are committed.

| Name | Purpose | Required state |
| --- | --- | --- |
| `INQUIRY_STATE_STORE` | Select shared state adapter | `upstash-redis` |
| `UPSTASH_REDIS_REST_URL` | Upstash HTTPS REST endpoint | Present in Preview and Production |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash server credential | Present in Preview and Production |
| `INQUIRY_STATE_KEY_SECRET` | HMAC key for non-PII rate keys | Independent random server-only value, at least 16 characters |
| `INQUIRY_STATE_NAMESPACE` | Optional key namespace | `gdlogi:inquiry` or an approved environment-specific namespace |
| `INQUIRY_PROVIDER_ENDPOINT` | Optional Provider override | Absent for existing FormSubmit or approved HTTPS endpoint |
| `INQUIRY_PROVIDER_TIMEOUT_MS` | Provider wait limit | Optional; capped at 18 seconds to stay within the 30-second route budget |
| `INQUIRY_PROVIDER_MODE` | Local mock selector | Absent in public environments |
| `INQUIRY_ALLOW_LOCAL_MOCK` | Local mock gate | Absent in public environments |
| `INQUIRY_ALLOW_MEMORY_STATE` | Local memory gate | Absent in public environments |
| `INQUIRY_ALLOW_REAL_PROVIDER_LOCAL` | Controlled local-real gate | Absent in public environments |

Actual Vercel variable values and scopes were not accessible from the working tree and remain `NOT_VERIFIED`. A public Preview should not be accepted while the route reports `STATE_STORE_CONFIGURATION_ERROR`.

## Validation results

| Check | Result | Boundary |
| --- | --- | --- |
| `pnpm test` | PASS — 65/65 | Local, injected or loopback-only Provider/state doubles |
| `pnpm build` | PASS — 26 routes | Local Next.js 16.3.1 production build |
| `pnpm test:preview` | PASS | 22 sitemap pages, 1,219 internal links, 41 redirects, 65 rendered images |
| Responsive browser checks | PASS | Home and Quote at 375, 390, 768, 1440 px; Sea Freight at 390 and 1440 px; no document-level horizontal overflow |
| Mobile navigation | PASS | Opened by keyboard/click path and exposed its links without covering form content |
| Mock Provider states | PASS | Explicit success, explicit failure, and uncertain/pending branches |
| Cross-instance concurrency | PASS locally | Two state-store clients shared one test backend; Provider called once |
| Process restart | PASS locally | Reconstructed client replayed stored result without Provider resend |
| Shared rate limit | PASS locally | Two clients shared one limit; sixth request was rejected |
| Store read/write failures | PASS locally | Fail-closed before Provider; post-Provider write uncertainty returned PENDING |
| Real Upstash on Vercel Preview | NOT_VERIFIED | Requires integration, variables, and deployed Preview exercise |
| Current-schema real inbox receipt | NOT_VERIFIED | No real inquiry was sent during this closeout |

Local-only mock request IDs and HTTP acceptance are test artifacts; they do not prove email delivery.

## Controlled real-inbox acceptance after Preview configuration

1. Connect Upstash Redis, set the Preview variables above, redeploy the feature-branch Preview, and confirm mock/memory switches are absent.
2. Open the Preview Quote page. Submit exactly once using non-customer data and `[TEST-GDLOGI] Website release acceptance` in the message.
3. Include ocean freight, multiple services, Receiving Checks, Product Quality Inspection, destination country, destination city/postal code, and the optional shipment fields.
4. Record the browser state, request ID, and server classification. Provider acceptance proves only acceptance. If the result is `PENDING`, do not resend.
5. Zoe confirms manually that exactly one message reached `zoe@gdlogi.com`, both destination fields and every selected service/check are present, and Reply-To targets the test sender.
6. Zoe sends any reply herself and confirms reply delivery separately. Only then promote the exact accepted commit to Production.

## Release and rollback boundary

- No push, deployment, domain switch, or real inquiry was performed in this closeout.
- Code can enter a Vercel Preview acceptance run after the required variables are configured.
- Production is still gated by authenticated environment-scope verification, real Preview Redis behavior, one controlled current-schema inbox check, and confirmation that the recorded rollback deployment is still promotable.
- Git rollback baseline for this closeout: `41b0457773e14dd6c6e8c089c301ab9e15168cca`.
- Historical Vercel rollback mapping and account-access boundaries remain recorded in `artifacts/release-candidate-closure-2026-11-16.md`.
