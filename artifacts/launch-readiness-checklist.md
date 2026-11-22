# Good Logistics Launch Readiness Checklist

Status definitions:

- `VERIFIED`: supported by the current codebase or a supplied operational asset.
- `NOT_VERIFIED`: must not be published as a company fact without source evidence.
- `BLOCKED`: requires company access, a third-party account, or a production action.

## Company and qualification claims

| Item | Status | Evidence required before publication |
| --- | --- | --- |
| GOOD LOGISTICS public brand | VERIFIED | Owner-confirmed public presentation on 2026-11-10 |
| Good Logistics Co., Ltd. public English company name | VERIFIED for public display | Owner-confirmed wording also appears on a private foreign-trade operator filing inspected on 2026-11-16; do not treat that filing as NVOCC or international freight-forwarder qualification evidence |
| 深圳市谷得供应链有限公司 public Chinese company name | VERIFIED | A private business license was inspected on 2026-11-16; registration number, registered address and other sensitive fields remain unpublished |
| Zoe Zhou contact name, email and WhatsApp | VERIFIED | Current project contact data |
| Zoe Zhou title: Director of International Logistics | VERIFIED | User-specified website role |
| Zoe Zhou replacement profile photo | VERIFIED for website use | User supplied the exact replacement file and explicitly confirmed public website display on 2026-11-10; source hash and derivatives are recorded in `docs/GDLOGI-SOURCE-OF-TRUTH.md` |
| Freight-forwarding filing name, number, issuer and date | NOT_VERIFIED | Original readable filing and approved public-safe copy |
| NVOCC-related filing name, number, issuer and date | NOT_VERIFIED | Original readable filing and approved public-safe copy |
| Company registration number and registered address | VERIFIED privately; not approved for public display | Keep the unredacted license and its sensitive fields out of Git and the public website |
| Company founding year | VERIFIED privately; withdrawn from public display | Owner directed on 2026-11-16 that the website should not use the 2019 establishment claim |
| `10+ years` industry experience | NOT_VERIFIED | Define whose experience is counted and supply the starting basis before publication |
| Warehouse area | NOT_VERIFIED | Clarify whether “30000 万平方” means 30,000 m² or another value, whether the space is owned, operated or partner-provided, the locations included and the as-of date |
| `190,000+` cooperating customers | NOT_VERIFIED | Define the counted entity, deduplication method, period and as-of date; competitor material is not evidence |
| Team size, shipment volume, other customer counts and on-time rate | NOT_VERIFIED | Dated company records and publication approval |
| Detailed Shenzhen office address | NOT_VERIFIED | Company confirmation and publication approval |

The private business license and foreign-trade operator filing are identity
evidence, not public website assets. The foreign-trade filing is not evidence of
NVOCC status or an international freight-forwarder enterprise filing. The
supplied composite certificate graphic remains a marketing reference, not an
original source certificate.

## Shipment case records

For each supplied operational photo set, confirm:

- Cargo description that can be published.
- Origin and destination that can be published.
- Freight mode and final-delivery scope.
- Operational challenge.
- Good Logistics responsibility and solution.
- Result that can be supported without a time or performance guarantee.
- Customer permission to publish the photos and shipment context.

Selected operational photos now appear only through the privacy-treated
derivatives and neutral placements recorded in
`docs/GDLOGI-SOURCE-OF-TRUTH.md`. They are not presented as customer
endorsements or case evidence. Named case use, shipment attribution and any
third-party rights beyond the owner's website-selection approval remain
`NOT_VERIFIED`. Zoe Zhou's new public profile image is separately approved for
website use and does not authorize any shipment photo.

The Ningbo-to-Chicago background remains an internal draft. Its factual scope is
limited to three factories, one 40HQ, Los Angeles customs clearance, rail to
Chicago and door delivery, but separate traceable publication authorization is
`NOT_VERIFIED`. It is therefore absent from the current public pages and must not
be paired with unrelated photos or expanded with cargo type, inspection,
labeling, kitting, dates, savings or testimonials.

## Inquiry delivery

| Check | Status | Required action |
| --- | --- | --- |
| Server validation, provider classification and route behavior | VERIFIED locally | Unit/route tests cover valid international email/phone forms, destination country plus legacy destination, `SUCCESS` / `FAILED` / `PENDING`, honeypot, rate limit, idempotency, controlled-test marking and configuration failure |
| Active browser forms and responsive interaction | VERIFIED locally on final build within stated scope | `/quote/` completed a full controlled-loopback success path with every current field and both inspection types. Homepage, Sea Freight and service-page entries share the validated contract or route to the editable Quote form; their links, preselection and responsive layouts were checked without additional provider submissions. No real provider was contacted |
| Separate shipping method and multi-value service needs | VERIFIED locally | Route tests preserve all selected values in the provider body |
| Receiving checks versus product-quality inspection | VERIFIED locally and in the controlled inbox message | Both types and their separate scope boundaries were present in request `GL-20261111-5D836B44`; legacy generic `Inspection` remains scope-not-specified |
| Consent, honeypot and same-page duplicate-submit guard | VERIFIED locally on final build | Honeypot makes zero provider calls; a double-click success sample produced one mock record and the browser lock remained active for `PENDING` |
| Shared rate limit and idempotency code | VERIFIED locally with a shared test backend; deployed Redis remains `NOT_VERIFIED` | Atomic claim, `CAPTURED`, final state and rate-limit behavior are covered across two local instances, restart, concurrent duplicates and storage failures. Preview and Production still require separately scoped Upstash variables and deployment tests; public requests never fall back to memory |
| Mock / public-provider isolation | VERIFIED in route tests | Loopback mock requires explicit legacy/mock mode and local switches. HubSpot + Resend requires an explicit Preview or Production gate; wrong scope, missing credentials and changed recipient fail before external calls |
| HubSpot primary inquiry storage | Code VERIFIED locally; account and Preview `NOT_VERIFIED` | Fixed authenticated Forms endpoint, full-field details, conservative result classification and CRM-first checkpoint are tested with injected responses. Configure the dedicated HubSpot form/property and supported server credential, then confirm exactly one TEST record in Preview |
| Resend secondary notification | Code VERIFIED locally; sender, Preview and inbox `NOT_VERIFIED` | Fixed API host, fixed Zoe recipient, customer Reply-To, full text body and 24-hour Provider idempotency key are tested with injected responses. Verify the sending domain and perform one owner-controlled Preview receipt check; Provider acceptance is not inbox delivery proof |
| Historical FormSubmit delivery to `zoe@gdlogi.com` | VERIFIED for 2026-10-21 schema only | Owner confirmed one non-customer test reached the inbox before the current service and inspection fields were added |
| Previous full-field inbox delivery and Reply-To | VERIFIED for the 2026-11-11 pre-country-split schema; current release remains `NOT_VERIFIED` | The owner confirmed exactly one copy, the then-current fields and correct Reply-To target for request `GL-20261111-5D836B44`. A controlled deployed test must additionally confirm `destination_country`, the retained destination field and shared-store behavior. Manual reply delivery remains to be confirmed |
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
| Deployment platform and multi-instance behavior | Vercel hosting VERIFIED; production Redis settings and deployed cross-instance behavior NOT_VERIFIED | Current response headers and server route identify Vercel hosting. The release now requires an atomic Upstash Redis store, but the Vercel project variables and a real Preview exercise cannot be verified from this local worktree |
| GTM / GA collection | NOT_VERIFIED and disabled | No production ID is committed; configure an applicable consent flow and validate before claiming collection |
| Anonymous success-event gating | VERIFIED locally in code and state tests | `SUCCESS` is reachable only from explicit provider acceptance; browser `FAILED`/`PENDING` states did not navigate to success. Event payload builders include only form/source, allowlisted service/inspection selections and result fields, not contact or cargo text. Marked `[TEST-GDLOGI]` submissions do not emit outcome or generated-lead events. GTM remains disabled without a real ID and consent |

## Release gate

Before production deployment:

1. Close or intentionally remove every `NOT_VERIFIED` public claim.
2. Final local production build, controlled-mock browser QA, link, redirect, SEO and screenshot checks completed on 2026-11-15.
3. Configure Upstash, HubSpot and Resend in Vercel Preview scope only, then verify the deployed release commit and cross-instance behavior. Do not publish while any public delivery configuration fails closed.
4. Run exactly one newly authorized, clearly marked non-customer Preview inquiry only after the owner confirms the Preview configuration. Confirm one HubSpot record first, then distinguish Resend acceptance from actual inbox receipt and Reply-To behavior. Do not automatically retry a `PENDING` result.
5. The 2026-11-11 FormSubmit receipt remains historical evidence only; do not repeat that old test or use it as proof of the HubSpot + Resend candidate.
6. Review the production diff and obtain explicit approval before changing the live site.
