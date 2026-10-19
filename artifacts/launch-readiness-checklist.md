# Good Logistics Launch Readiness Checklist

Status definitions:

- `VERIFIED`: supported by the current codebase or a supplied operational asset.
- `NOT_VERIFIED`: must not be published as a company fact without source evidence.
- `BLOCKED`: requires company access, a third-party account, or a production action.

## Company and qualification claims

| Item | Status | Evidence required before publication |
| --- | --- | --- |
| Good Logistics Co., Ltd. company name | VERIFIED | Current brand materials and website identity |
| Zoe Zhou contact name, email and WhatsApp | VERIFIED | Current project contact data |
| Zoe Zhou title: Director of International Logistics | VERIFIED | User-specified website role |
| Freight-forwarding filing name, number, issuer and date | NOT_VERIFIED | Original readable filing and approved public-safe copy |
| NVOCC-related filing name, number, issuer and date | NOT_VERIFIED | Original readable filing and approved public-safe copy |
| Chinese legal entity and registration details | NOT_VERIFIED | Company registration record and approved English rendering |
| Company founding year | NOT_VERIFIED | Registration record or written company confirmation |
| Team size, shipment volume, customer count and on-time rate | NOT_VERIFIED | Dated company records and publication approval |
| Detailed Shenzhen office address | NOT_VERIFIED | Company confirmation and publication approval |

The supplied composite certificate graphic is treated as a marketing reference,
not as an original source certificate.

## Shipment case records

For each of the three supplied operational photo sets, confirm:

- Cargo description that can be published.
- Origin and destination that can be published.
- Freight mode and final-delivery scope.
- Operational challenge.
- Good Logistics responsibility and solution.
- Result that can be supported without a time or performance guarantee.
- Customer permission to publish the photos and shipment context.

Until these fields are confirmed, the homepage presents the images as
operational photo records and labels route, mode and result as pending
verification.

## Inquiry delivery

| Check | Status | Required action |
| --- | --- | --- |
| Required fields and browser validation | VERIFIED | Covered by local QA |
| Consent checkbox, honeypot and duplicate-submit guard | VERIFIED | Covered by code review and local QA |
| FormSubmit activation for `zoe@gdlogi.com` | BLOCKED | Site owner must activate the endpoint from the recipient inbox |
| Successful production inbox delivery | BLOCKED | Send one approved non-customer test after activation |
| Failure and retry behavior in production | BLOCKED | Test provider failure or rejected request on the production domain |

No real inquiry is submitted during automated or local QA.

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
2. Complete the approved FormSubmit inbox test.
3. Complete desktop, tablet and mobile visual QA on the deployment preview.
4. Run production build, link checks, console checks and form validation.
5. Review the production diff and obtain explicit approval before changing the live site.
