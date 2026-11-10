# Good Logistics Integrated Release Validation — 2026-11-10

## Decision

The integrated local version is **ready to enter controlled release acceptance**.
It is **not deployed** and is not yet represented as production-verified. One
current-schema inbox test and the deployment-topology decision remain release
gates. The profile-photo gate was resolved later on 2026-11-10 by the
owner-supplied replacement and explicit confirmation of public website use.
No real inquiry or email-provider request was made during this work.

This avatar addendum only updates the photo-rights gate. The broader validation
record below was not repeated or expanded during the avatar-only change.

## Protected baseline and rollback

- Branch: `codex/inquiry-first-round-20261110`
- Original inherited HEAD: `cb239f40165f1a542593907db3f23030ffe795c5`
- Integrated mixed-worktree checkpoint: `8cabd42 chore: checkpoint integrated site work`
- External restore bundle: `/private/tmp/gdlogi-integration-baseline.LZShj3`
  - `tracked-working-tree.patch`: `d59d8f6c511106c1bcb58b1a0ab0b3611007591ce8655c376943f764f8b30f72`
  - `untracked-files.tar.gz`: `a89de8babc8d77da7d0b13b7e745a53d6cabb3b949dab05f5f465ad99a796b2d`
- No reset, clean, checkout, force overwrite, push or deployment was used.
- `.env*` is ignored except for the secret-free `.env.example`; no credential,
  customer-data or unrelated file was added to Git.
- The pre-existing port-3001 preview processes were not stopped or restarted.

The repair commits after the checkpoint are:

| Commit | Topic |
| --- | --- |
| `56fc4b8` | Unified inquiry validation, state handling, cookies, mock isolation, rate limit and idempotency |
| `d426c05` | Truthful public content, inspection boundaries, unpublished-case removal and destination wording |
| `c5d607b` | Exact tool versions, pnpm lock, provider/analytics documentation and release boundaries |
| `b49919d` | Repeatable loopback-only SEO, link, redirect, indexing and image acceptance test |

The final evidence/screenshots and checklist updates are stored in the commit
that contains this validation record.

## De-duplicated findings from both reports

| Combined finding | Integrated resolution | Status |
| --- | --- | --- |
| Two tasks shared one dirty tree without a rollback boundary | Preserved the original patch/untracked bundle, then committed the complete mixed result as checkpoint `8cabd42` before thematic repairs | **FIXED** |
| Email and international phone validation were inconsistent or insufficiently evidenced | Browser and server validation now accept normal international punctuation and reject malformed email/phone values; final-build browser checks reproduced both error messages | **FIXED** |
| Homepage, Quote, Sea Freight, standalone HTML and article popups could diverge | Homepage, Quote and Sea Freight are the only active forms and share `/api/inquiry/`; the standalone form redirects permanently to `/quote/`; five draft articles redirect temporarily to `/resources/`, so their embedded popups are inactive | **FIXED** |
| Shipping method, multi-service needs and inspection detail could be lost | Shipping remains separate from service multi-select; provider body carries requested service, shipping method, every service need and every inspection type. Subject shortening does not shorten the body | **FIXED** |
| Receiving checks and professional product inspection were merged | Separate selectable types and separate provider wording were added. They can coexist. Historic generic `Inspection` remains scope-not-specified and is never promoted to professional inspection | **FIXED** |
| SUCCESS / FAILED / PENDING or redirect semantics could regress | Explicit upstream acceptance alone yields `SUCCESS`; explicit rejection yields retryable `FAILED`; timeout, network uncertainty, HTTP 202, non-JSON and ambiguous replies remain `PENDING`, do not navigate to success and are not auto-resent | **FIXED** |
| Thank-you, refresh and multi-tab confirmation could produce false success | A five-minute HttpOnly cookie is unique to each accepted request ID; unmatched IDs show no confirmation; two accepted IDs can coexist; refresh preserves a matching confirmation | **FIXED** |
| Duplicate clicks, spam, rate limiting and idempotency needed clearer behavior | Same-page lock, honeypot, 32 KB limit, bounded per-instance IP limiter and same-submission idempotency are retained. Different cargo is not blocked by a shared email/IP. Final browser double-click produced one mock record | **FIXED within documented single-instance boundary** |
| Process-local Maps might be described as distributed protection | README and checklist explicitly state that rate/idempotency Maps do not survive restart and are not cross-instance reliable | **WAITING FOR DEPLOYMENT TOPOLOGY** |
| Local mock or unreachable localhost provider could leak into production or appear successful | Local mock requires explicit mode, loopback endpoint, loopback site host and allow switch; unsafe public-host/private endpoints fail with a configuration error; local real-provider calls are blocked by default | **FIXED** |
| Current expanded email body and Reply-To were never inbox-verified | Local mock confirms full body and `_replyto`; no real provider was contacted | **WAITING FOR ONE APPROVED REAL INBOX TEST** |
| Chicago consolidation case lacked traceable publication authorization | Removed the public module, links and any case-schema exposure. Facts remain only as an internal draft; no fake case page or photo was added | **FIXED for this release** |
| Warehouse, kitting or inspection ownership model was unconfirmed | Public wording describes services and coordination without claiming an owned warehouse, laboratory or overseas network | **FIXED through conservative wording** |
| Special-destination pages could imply unsupported coverage/time/price | Hawaii, Alaska and Puerto Rico remain available for confirmed-address planning, without blanket coverage, rate or transit-time promises | **FIXED for current facts; deeper detail is later optimization** |
| A separate case page, real-operation media and exact old CTA/header requests were incomplete | Latest instruction supersedes placeholder/case expansion. No empty page, fake photo or customer-visible TODO was added; current CTA wording and navigation follow the integrated brief | **LATER, only with authorized material** |
| Old static files, brand assets and article code remained in the repository | Effective requests are covered by 25 exact redirect rules, verified before filesystem serving. Source files remain for rollback and were not bulk-deleted solely because they are old | **FIXED for public access; repository cleanup later** |
| Package manager, framework version and locks were unclear | pnpm 11.25.0 is declared; Next 16.3.1 and React 19.2.8 are exact; root `pnpm-lock.yaml` is the only lockfile; clean frozen install passed | **FIXED** |
| Brand/contact consistency, SEO, robots, sitemap and images needed final evidence | All 20 sitemap pages passed title, description, H1, canonical, GOOD LOGISTICS/email/phone, internal link/fragment and image checks; thank-you is noindex and absent from sitemap; AVIF sources render | **FIXED locally** |
| Mobile navigation and CTA usability needed rendered verification | 375/390/768/1440 checks passed; menu, grouped Services, Escape close/focus restore, CTA and editable service preselection work | **FIXED locally** |
| GTM/GA might be implied without a real configuration | No ID is committed; GTM loads only for a valid ID after explicit analytics consent. No production collection is claimed | **DISABLED; LATER if approved** |
| Production status was unclear | The work is local only. Nothing was pushed or deployed | **CLEARLY DOCUMENTED** |

## Final-build validation

The production build was created from a clean archive in
`/private/tmp/gdlogi-release.WrHyms`, not in the shared worktree or the shared
preview directory.

| Check | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | PASS — exact lockfile versions, 22 packages reused from pnpm store |
| `pnpm test` | PASS — 39/39, 0 failed |
| `pnpm build` | PASS — Next.js 16.3.1, 24 pages generated, API and thank-you dynamic as designed |
| `pnpm test:preview http://127.0.0.1:3110` | PASS — 20 sitemap pages, 875 rendered internal links / 28 unique targets, 25 legacy redirects, 50 rendered image instances / 3 unique assets / 2 AVIF sources |
| Controlled API mock | PASS — SUCCESS, explicit FAILED, HTTP-202/ambiguous/non-JSON/timeout PENDING, FILTERED and RATE_LIMITED branches |
| Field delivery | PASS — shipping, multi-service needs, both inspection types/scope, message and Reply-To reached the local mock body |
| Cookie / refresh / multi-tab / idempotent replay | PASS |
| Final browser mock | PASS — invalid email, invalid phone, international phone, FAILED retry, PENDING lock, SUCCESS navigation and double-click protection |
| Mock-record count for final browser samples | PASS — one double-click success record, one failed record and one pending record |
| Responsive / keyboard | PASS — target widths 375, 390, 768 and 1440; mobile menu and Escape/focus recovery verified |
| Browser console | PASS — no warning or error captured on the final service/thank-you flow |
| Real provider and inbox | **NOT VERIFIED in this round** |
| Production deployment | **NOT PERFORMED** |

The browser mock used synthetic local-only data. No customer data was used and
no request went to FormSubmit or another real mail provider.

## Preview and screenshots

Exact final-build preview: <http://127.0.0.1:3110/>

It runs with the loopback mock on port 3199 so accidental preview submissions
cannot become real inquiries. The older shared port-3001 service remains
untouched.

- `artifacts/final-previews-2026-11-10/home-1440.jpg`
- `artifacts/final-previews-2026-11-10/home-390.jpg`
- `artifacts/final-previews-2026-11-10/home-mobile-menu-390.jpg`
- `artifacts/final-previews-2026-11-10/quote-inspection-375.jpg`
- `artifacts/final-previews-2026-11-10/service-inspection-768.jpg`
- `artifacts/final-previews-2026-11-10/quote-success-390.jpg`

## Release-acceptance gates

The code/content version can enter release acceptance now. Before production:

1. Confirm whether the target platform is one long-lived instance or multiple
   instances/serverless. For multi-instance deployment, add a shared durable
   limiter/idempotency store or explicitly accept the documented limitation.
2. Run exactly one owner-approved current-schema inbox test.
3. Verify the production environment contains no local-mock variables. Keep
   GTM disabled unless a real container and applicable consent decision exist.
4. Review the final production diff and obtain explicit deployment approval.

## Controlled real-inbox test procedure

1. Agree a short test window, the controlled sender mailbox and recipient
   `zoe@gdlogi.com`; use synthetic non-customer cargo details.
2. Enable the real provider only for that approved test environment. If testing
   locally, set `INQUIRY_ALLOW_REAL_PROVIDER_LOCAL=true` only for the test and
   remove it immediately afterward.
3. Submit one request containing an ocean method, several operation services,
   both receiving checks and scoped product-quality inspection, quantities,
   weight/volume, notes and a unique test marker.
4. Record the HTTP classification, request ID, success-cookie binding and
   thank-you URL. If the result is `PENDING`, do not click again or auto-resend;
   inspect the provider/inbox first.
5. In the received message, verify every visible field: customer identity,
   phone, product, origin, destination, shipping method, all service needs,
   both inspection types and boundary text, cargo measurements, notes, source
   and submission ID. The subject may be summarized; the body may not.
6. Verify the message `Reply-To` equals the controlled sender mailbox. Reply
   from Zoe's inbox and confirm delivery to that mailbox; then reply back once
   and confirm delivery to Zoe's inbox.
7. Confirm exactly one provider message arrived and no duplicate success event
   was recorded. Save redacted evidence, then remove the temporary real-provider
   local allowance.

## Minimum business confirmation still required from Zoe

No unresolved public-asset fact remains for the replacement Zoe Zhou profile
photo: the owner supplied the exact file and explicitly confirmed public website
display. This does not assert photographer ownership or authorize unrelated use.

Chicago-case permission, deeper destination coverage, warehouse/partner
operating model, certificates and additional real-operation photos are not
release blockers because the current public version does not assert or publish
those unverified details.
