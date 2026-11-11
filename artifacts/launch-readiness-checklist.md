# Good Logistics Launch Readiness Checklist

Status definitions:

- `VERIFIED`: supported by the current codebase or a supplied operational asset.
- `NOT_VERIFIED`: must not be published as a company fact without source evidence.
- `BLOCKED`: requires company access, a third-party account, or a production action.

## Company and qualification claims

| Item | Status | Evidence required before publication |
| --- | --- | --- |
| GOOD LOGISTICS public brand | VERIFIED | Owner-confirmed public presentation on 2026-11-10 |
| Good Logistics Co., Ltd. public English company name | VERIFIED for public display | Official registered-English-name status still requires a primary document |
| 深圳市谷得供应链有限公司 public Chinese company name | VERIFIED for public display | Registration number, registered address and other license fields remain unpublished pending document review |
| Zoe Zhou contact name, email and WhatsApp | VERIFIED | Current project contact data |
| Zoe Zhou title: Director of International Logistics | VERIFIED | User-specified website role |
| Zoe Zhou replacement profile photo | VERIFIED for website use | User supplied the exact replacement file and explicitly confirmed public website display on 2026-11-10; source hash and derivatives are recorded in `docs/GDLOGI-SOURCE-OF-TRUTH.md` |
| Freight-forwarding filing name, number, issuer and date | NOT_VERIFIED | Original readable filing and approved public-safe copy |
| NVOCC-related filing name, number, issuer and date | NOT_VERIFIED | Original readable filing and approved public-safe copy |
| Company registration number and registered address | NOT_VERIFIED | Original company registration record and publication approval |
| Company founding year | NOT_VERIFIED | Registration record or written company confirmation |
| Team size, shipment volume, customer count and on-time rate | NOT_VERIFIED | Dated company records and publication approval |
| Detailed Shenzhen office address | NOT_VERIFIED | Company confirmation and publication approval |

The supplied composite certificate graphic is treated as a marketing reference,
not as an original source certificate.

## Shipment case records

For each supplied operational photo set, confirm:

- Cargo description that can be published.
- Origin and destination that can be published.
- Freight mode and final-delivery scope.
- Operational challenge.
- Good Logistics responsibility and solution.
- Result that can be supported without a time or performance guarantee.
- Customer permission to publish the photos and shipment context.

Until these fields and publication rights are confirmed, the operational photos
remain off the current public homepage. Zoe Zhou's new public profile image is
separately approved for website use and does not authorize any shipment photo.

The Ningbo-to-Chicago background remains an internal draft. Its factual scope is
limited to three factories, one 40HQ, Los Angeles customs clearance, rail to
Chicago and door delivery, but separate traceable publication authorization is
`NOT_VERIFIED`. It is therefore absent from the current public pages and must not
be paired with unrelated photos or expanded with cargo type, inspection,
labeling, kitting, dates, savings or testimonials.

## Inquiry delivery

| Check | Status | Required action |
| --- | --- | --- |
| Server validation, provider classification and route behavior | VERIFIED locally | 39 unit/route tests pass, including valid international email/phone forms, `SUCCESS` / `FAILED` / `PENDING`, honeypot, rate limit, idempotency and configuration failure |
| Active browser forms and responsive interaction | VERIFIED locally on final build | Homepage, `/quote/` and Sea Freight forms were checked against the controlled loopback provider at 375, 390, 768 and 1440 widths; no real provider was contacted |
| Separate shipping method and multi-value service needs | VERIFIED locally | Route tests preserve all selected values in the provider body |
| Receiving checks versus product-quality inspection | VERIFIED locally | Both types can be selected together; legacy generic `Inspection` remains scope-not-specified; current real inbox rendering still needs the approved test |
| Consent, honeypot and same-page duplicate-submit guard | VERIFIED locally on final build | Honeypot makes zero provider calls; a double-click success sample produced one mock record and the browser lock remained active for `PENDING` |
| Per-instance rate limit and idempotency | VERIFIED within stated boundary | Bounded in-memory Maps protect one running instance only; deployment platform and any cross-instance store remain `NOT_VERIFIED` |
| Mock / production provider isolation | VERIFIED in route tests | Local mock requires explicit QA mode, loopback endpoint, loopback site request and local-only switch; public-host loopback configuration fails clearly |
| Historical FormSubmit delivery to `zoe@gdlogi.com` | VERIFIED for 2026-10-21 schema only | Owner confirmed one non-customer test reached the inbox before the current service and inspection fields were added |
| Current full-field inbox delivery and Reply-To | PENDING manual verification | One approved call on 2026-11-11 returned `PENDING / PROVIDER_RESPONSE_UNKNOWN` with request `GL-20261111-5D836B44`; no retry was made. Check the recipient inbox and junk folder for exactly one copy, all fields, Reply-To and reply delivery |
| Provider timeout / ambiguous response | VERIFIED locally and observed in the controlled call | The controlled call remained `PENDING`, did not set a success cookie, did not fire success and was not resent automatically |

### Historical owner-approved live test — 2026-10-21 (pre-current schema)

| Verification | Result |
| --- | --- |
| Email Delivery | PASS |
| Duplicate Submission | PASS |
| Field Delivery | PASS |
| UTM Tracking | PASS |
| Service Tracking | PASS |
| Thank-you Protection | PASS |
| Timeout Handling | FAIL — original 12-second implementation; corrected locally after this test |

That historical result does not verify the current inspection-type fields,
complete current email body, Reply-To header or reply delivery. No additional
live inquiry is submitted during automated or local QA.

## Legal and measurement

| Item | Status | Required action |
| --- | --- | --- |
| Privacy Policy legal entity, regions, retention and recipients | NOT_VERIFIED | Company and qualified legal review |
| Terms contracting entity, governing law and dispute process | NOT_VERIFIED | Company and qualified legal review |
| Hosting logs and cross-border processing | NOT_VERIFIED | Confirm production hosting configuration |
| Deployment platform and multi-instance behavior | NOT_VERIFIED | Confirm platform topology before claiming distributed rate limiting or idempotency |
| GTM / GA collection | NOT_VERIFIED and disabled | No production ID is committed; configure an applicable consent flow and validate before claiming collection |
| Anonymous success-event gating | VERIFIED locally in code and state tests | `SUCCESS` is reachable only from explicit provider acceptance; browser `FAILED`/`PENDING` states did not navigate to success. Event payload builders include only form/source, allowlisted service/inspection selections and result fields, not contact or cargo text. GTM remains disabled without a real ID and consent |

## Release gate

Before production deployment:

1. Close or intentionally remove every `NOT_VERIFIED` public claim.
2. Final local production build, controlled-mock browser QA, link, redirect, SEO and screenshot checks completed on 2026-11-10.
3. Confirm the deployment platform and decide whether single-instance rate limiting and idempotency are sufficient.
4. Owner approval was obtained and the single controlled current-schema FormSubmit call was made on 2026-11-11; do not submit it again.
5. Complete the manual inbox check for request `GL-20261111-5D836B44`: exactly one copy, every current field, Reply-To and reply delivery.
6. Review the production diff and obtain explicit approval before changing the live site.
