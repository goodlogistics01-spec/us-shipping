# GDLOGI.US Release Candidate Closure — 2026-11-16

## Release identity

- Release version: `GDLOGI-WEB-2026.11.16-RC1`
- Requested baseline: `68624a92c587cc8a6bb80e552b84841523272890`
- Working branch: `codex/gdlogi-v2-optimization-20261115`
- Production branch observed from the public GitHub repository: `main`
- Production project observed from the successful Vercel status target: team `good-logistics-projects`, project `us-shipping`
- Formal domain: `https://gdlogi.us/`; `https://www.gdlogi.us/` redirects to the apex domain

This record separates repository evidence, public deployment records and items
that require authenticated account access. It does not record or expose any
secret value.

## Deployment trigger and environment evidence

Public GitHub deployment records show feature-branch updates producing Preview
deployments and `main` updates producing Production deployments. The repository
has no deployment workflow or `vercel.json`; deployment is therefore observed
as a connected Vercel Git integration. The authenticated Vercel Project Settings
page was not available in this audit, so the production-branch toggle, branch
protection and environment-variable scopes remain `NOT_VERIFIED` at the account
setting level.

Only the feature branch may be pushed for release acceptance. Do not merge or
push this release candidate to `main`, and do not reassign `gdlogi.us`, until the
manual preview inquiry test and the authenticated project-setting check are
complete.

| Configuration name | Purpose | Required state for Preview / Production | Current evidence |
| --- | --- | --- | --- |
| `INQUIRY_PROVIDER_ENDPOINT` | Optional HTTPS provider override; when absent on a public host, the application uses the existing FormSubmit endpoint for `zoe@gdlogi.com` | Either absent, or the approved HTTPS production provider | Repository contract verified; actual Vercel value and scopes `NOT_VERIFIED` |
| `INQUIRY_PROVIDER_TIMEOUT_MS` | Provider response timeout | Optional; code default is valid | Repository contract verified; actual Vercel value and scopes `NOT_VERIFIED` |
| `INQUIRY_PROVIDER_MODE` | Enables local mock mode | Must be absent in Preview and Production | Local isolation tests pass; actual Vercel value and scopes `NOT_VERIFIED` |
| `INQUIRY_ALLOW_LOCAL_MOCK` | Allows loopback mock calls during local QA | Must be absent in Preview and Production | Local isolation tests pass; actual Vercel value and scopes `NOT_VERIFIED` |
| `INQUIRY_ALLOW_REAL_PROVIDER_LOCAL` | One-time local real-provider gate | Must be absent in Preview and Production | Local-only contract verified; actual Vercel value and scopes `NOT_VERIFIED` |
| `GTM_CONTAINER_ID` | Loads GTM after analytics consent | Leave absent until a real container and consent UI are approved | Code prepared; external collection not configured or claimed |

## Current inquiry evidence and acceptance gate

The owner confirmed exactly one live FormSubmit message for request
`GL-20261111-5D836B44`: it reached `zoe@gdlogi.com`, contained the then-current
service and inspection fields, arrived once and exposed the controlled sender as
Reply-To. That proves the live route/provider combination used on 2026-11-11,
but it does not by itself prove this release candidate or the future Preview
environment. The candidate adds controlled-test handling and an explicit
submission timestamp, so one owner-submitted, clearly marked inquiry on the
candidate Preview is still required.

The acceptance submission must include `[TEST-GDLOGI]` and non-customer data,
select ocean freight, multiple services, Receiving Checks and Product Quality
Inspection, and be submitted exactly once. An HTTP response or Provider
acceptance is not proof of inbox delivery. Record separately:

1. Browser result and request ID.
2. Server/provider classification (`SUCCESS`, `FAILED` or `PENDING`).
3. Whether exactly one message reaches `zoe@gdlogi.com`.
4. All fields in the received message, including the two inspection types.
5. Reply-To target; the owner sends and verifies any reply manually.

If the result is `PENDING`, do not resend. Check the inbox and provider state
first.

## Rollback deployment mapping

The previous release commit has a real successful production deployment record:

| Item | Recorded value | Verification boundary |
| --- | --- | --- |
| Git commit | `4e5809153dfa06e86dccd57e7f6babf4d4d66842` | Exists on remote `main` |
| GitHub Production deployment record | `7786416521` | Public GitHub deployment record, state `success`, created 2026-11-14 10:44:53 UTC |
| GitHub deployment status record | `22189280530` | Public deployment status, state `success`, description “Deployment has completed” |
| Vercel dashboard deployment reference | `8PB5CPCpF83fxKex7bHyD4bsJJAb` | Associated successful Vercel status target; this is not represented as a `dpl_...` UID |
| Recorded immutable deployment URL | `https://us-shipping-k1i6z64zx-good-logistics-projects.vercel.app` | Recorded as the successful deployment environment URL; anonymous direct reachability was not confirmed in this audit |

Rollback procedure:

1. In the authenticated Vercel project, open the deployment associated with
   commit `4e5809153dfa06e86dccd57e7f6babf4d4d66842` and dashboard reference
   `8PB5CPCpF83fxKex7bHyD4bsJJAb`.
2. Confirm the commit and deployment output before using Vercel's rollback or
   promote/redeploy control; do not rely on a `?release=4e58091` query string.
3. Verify the apex homepage, Quote page, `/api/inquiry/`, exact legacy redirects,
   canonical tags, robots and sitemap after rollback.
4. If repository history must also be corrected, create explicit revert commits;
   do not reset or rewrite shared history.

The authenticated Vercel `dpl_...` UID and anonymous reachability of the recorded
deployment URL remain `NOT_VERIFIED`. Dashboard access is therefore required
before production release to confirm that this rollback target is still
promotable.

## Legal, media and proof status

- Privacy Policy still needs an effective date, controller/site-operator
  identity, actual production providers and processing regions, cross-border
  basis, retention schedule, legal basis, recipient categories and the rights
  request procedure. These facts were not invented.
- Terms still needs an effective date, exact site operator/contracting entity,
  governing law, jurisdiction/dispute route and legal approval.
- Current hero status: static photo. No video is implemented in Git. Candidate
  videos found outside the repository have not passed rights, privacy, claim and
  page-fit review, so video-first hero acceptance is `NOT_COMPLETED`.
- A private business license supports the Chinese entity and the text
  “Established in Shenzhen in 2019.” A private foreign-trade operator filing
  supports the approved English public name. Neither document proves NVOCC or
  international freight-forwarder qualification; raw documents remain private.
- No shipment case has traceable public authorization and a complete evidence
  record. The Ningbo-three-supplier-to-Chicago record remains an internal draft
  and is not exposed as a public case or structured data.
- Existing selected operational derivatives are owner-approved for this site and
  remain neutrally captioned. Independent third-party rights and appearance
  consent are not promoted to verified claims.

## Measurement and search status

| Capability | Status | Meaning |
| --- | --- | --- |
| Anonymous inquiry-event code | Code implemented | Events use allowlisted non-contact fields and success fires only after explicit provider acceptance |
| GTM / GA conversion collection | Code prepared but not configured | No real container or complete visitor consent UI is evidenced; collection is not claimed |
| CRM / qualified / quoted / won lifecycle | Not implemented | The site does not persist a sales pipeline |
| `robots.txt`, sitemap and page metadata | Implemented in code; current production endpoints respond | This is technical SEO readiness, not proof of ranking or traffic |
| Google Search Console | Not implemented; account state not verified | No repository verification or connected first-party report is available |
| Bing Webmaster Tools | Not implemented; account state not verified | No repository verification or connected first-party report is available |
| Rankings, index coverage and organic traffic | Not verified | No connected first-party search-performance data was reviewed |

## Release decision at record creation

**TEMPORARILY NOT READY FOR PRODUCTION.** The code can proceed to a feature-branch
Preview, but production release remains gated by:

1. A feature-branch Vercel Preview with no Production deployment record.
2. One owner-submitted controlled Preview inquiry with inbox/fields/Reply-To
   confirmation.
3. Authenticated confirmation of the Vercel Production Branch, environment
   scopes and the rollback target's promotability.

Legal-detail completion, hero video, public cases, GTM/GA and search-console
connections remain accurately disclosed follow-up work unless Zoe or legal
counsel makes them a release condition.

## Local validation of this closure

| Check | Result |
| --- | --- |
| `pnpm test` | PASS — 41/41 tests |
| `pnpm build` | PASS — Next.js 16.3.1 generated 26 routes; `/api/inquiry/` remains a server route |
| `pnpm test:preview` against the final local build | PASS — 22 sitemap pages, 997 internal links, 41 configured legacy redirects and 22 unique image assets checked |
| Exact old-home URLs | PASS — `/good-shipping-homepage`, `/good-shipping-homepage/` and `/good-shipping-homepage/index.html` redirect through Next; the unsupported legacy qualification/case copy was not served |
| Controlled mock API states | PASS — explicit success produced `SUCCESS`; explicit rejection produced `FAILED`; HTTP 202 produced `PENDING` |
| Pending duplicate | PASS — same request ID returned with `Idempotency-Replayed: true`; mock provider request count remained unchanged |
| Multi-service and inspection payload | PASS — mock record retained ocean freight, Shipping, Consolidation, Inspection, Receiving Checks, Product Quality Inspection and the separate truthful scope text |
| Responsive smoke check | PASS — 375, 390, 768 and 1440 px had no horizontal page overflow on the affected Home, About, Sea Freight, Quote and destination samples; mobile navigation opened at 375 px |

No real Provider request was made during these checks. Local mock request IDs
are test artifacts and do not prove email delivery.
