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
remain off the current public homepage. Zoe Zhou's approved public profile image
remains in use; its source-rights record is still requested.

The Ningbo-to-Chicago background remains an internal draft. Its factual scope is
limited to three factories, one 40HQ, Los Angeles customs clearance, rail to
Chicago and door delivery, but separate traceable publication authorization is
`NOT_VERIFIED`. It is therefore absent from the current public pages and must not
be paired with unrelated photos or expanded with cargo type, inspection,
labeling, kitting, dates, savings or testimonials.

## Inquiry delivery

| Check | Status | Required action |
| --- | --- | --- |
| Required fields and browser validation | VERIFIED | Covered by local QA, including separate shipping method and multi-value service needs |
| Consent checkbox, honeypot and duplicate-submit guard | VERIFIED | Covered by code review and local QA |
| Same-origin API validation and three-state UX | VERIFIED | Local SUCCESS, FAILED and PENDING paths re-tested with a local-only provider stub on 2026-11-10 |
| Multi-service provider payload | VERIFIED | Local mock received Shipping, FBA Prep / Labeling and Kitting / Light Assembly as separate selected needs |
| FormSubmit delivery for `zoe@gdlogi.com` | VERIFIED | Owner confirmed the single test email was received on 2026-10-21 |
| Successful inbox delivery | VERIFIED | The one approved non-customer test reached `zoe@gdlogi.com` with the expected subject and fields |
| Provider timeout response | VERIFIED | The first live test delivered the email but the original 12-second timeout incorrectly displayed failure; handling was revised so unknown responses become PENDING |

### Owner-approved live test — 2026-10-21

| Verification | Result |
| --- | --- |
| Email Delivery | PASS |
| Duplicate Submission | PASS |
| Field Delivery | PASS |
| UTM Tracking | PASS |
| Service Tracking | PASS |
| Thank-you Protection | PASS |
| Timeout Handling | FAIL — original 12-second implementation; corrected locally after this test |

No additional live inquiry is submitted during automated or local QA.

## Legal and measurement

| Item | Status | Required action |
| --- | --- | --- |
| Privacy Policy legal entity, regions, retention and recipients | NOT_VERIFIED | Company and qualified legal review |
| Terms contracting entity, governing law and dispute process | NOT_VERIFIED | Company and qualified legal review |
| Hosting logs and cross-border processing | NOT_VERIFIED | Confirm production hosting configuration |
| Analytics and `generate_lead` measurement | BLOCKED | Select provider, configure consent where required, then validate without exposing secrets |

## Release gate

Before production deployment:

1. Close or intentionally remove every `NOT_VERIFIED` public claim.
2. Obtain owner approval before the second and final FormSubmit inbox test.
3. Repeat desktop, tablet and mobile visual QA on the deployment preview after deployment is explicitly approved.
4. Run production build, link checks, console checks and form validation.
5. Review the production diff and obtain explicit approval before changing the live site.
