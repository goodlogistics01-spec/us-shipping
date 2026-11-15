# GDLOGI Final Local Release Validation — 2026-11-15

## Release identity

- Branch: `codex/gdlogi-v2-optimization-20261115`
- Rollback baseline: `4e5809153dfa06e86dccd57e7f6babf4d4d66842`
- Validated implementation commit: `1c9bd91df27be039bb9f8affd9b68bee124d7022`
- Package manager: pnpm 11.25.0, using the repository's only lockfile, `pnpm-lock.yaml`
- Framework/runtime: Next.js 16.3.1, React 19.2.8, Node.js 20.9 or later
- Scope at validation: local code, isolated production build and loopback-only inquiry provider
- Push/deployment status: **not pushed and not deployed**

## Implemented release scope

- Reworked the homepage around verifiable China-side cargo coordination and China-to-USA delivery, with a shorter route to Quote and Zoe's WhatsApp.
- Preserved three buyer scenarios while moving detailed scope and boundaries to substantive service pages.
- Added truthful, privacy-treated operational-photo placements and retained Zoe's owner-approved public profile image.
- Added substantive Supplier Pickup & Consolidation and International Express content, plus a multi-supplier consolidation checklist.
- Improved About, destination and Sea Freight content without claiming owned facilities, guaranteed timing, unsupported prices or unverified qualifications.
- Shortened the Quote introduction, moved reply preference and phone closer to email, and preserved the existing field contract and conditional inspection controls.
- Added controlled-test marking and timestamps to the provider payload while keeping explicit `SUCCESS`, `FAILED` and `PENDING` semantics.
- Updated internal links, exact redirects, canonical relationships, sitemap, source-of-truth records, SEO map and release documentation.

## Final-code validation evidence

| Check | Result | Evidence / boundary |
| --- | --- | --- |
| Production build | PASS | `pnpm build`; Next.js 16.3.1 generated 26 pages from the isolated final source tree |
| Unit and route tests | PASS | `pnpm test`; 41 of 41 tests passed |
| Preview crawler | PASS | `pnpm test:preview http://127.0.0.1:3227`; 22 sitemap URLs, 997 internal link occurrences (32 unique), 41 legacy redirects, 63 rendered images and 22 image assets (14 AVIF) checked |
| SEO metadata | PASS within local scope | Every sitemap page had a title, description, H1 and canonical; `robots.txt`, sitemap and thank-you `noindex`/cookie boundary passed |
| Brand/contact consistency | PASS | Automated preview check found consistent public brand and contact details |
| Source and staged diff checks | PASS | `git diff --check`, JavaScript syntax checks and sensitive-pattern scan passed before the implementation commit |
| Browser layout | PASS | Homepage checked at 375, 390, 768 and 1440 CSS-pixel viewport widths; representative consolidation and Quote pages checked at mobile and desktop widths; no horizontal overflow observed |
| Mobile navigation | PASS | Pointer and keyboard Enter open/close behavior checked; focus remained on the menu control and body scroll locking worked |
| Quote preselection | PASS | Ocean Freight plus Supplier Pickup, Consolidation, Inspection and both inspection types remained editable and distinct |
| Controlled browser inquiry | PASS against loopback mock only | Explicit success, failure and uncertain/pending UI branches were exercised without contacting a real provider |
| Field-complete mock record | PASS | Request `GL-20261115-2D529CFE` contained ocean shipping, all selected services, both inspection types and boundaries, optional shipment details, source fields, Reply-To and UTC submission time |
| Duplicate/spam controls | PASS within implemented boundary | Unit/browser checks covered submit locking, honeypot, per-instance rate limiting and per-instance idempotency; the Maps are not durable or cross-instance |
| Real provider in this release run | NOT RUN | No FormSubmit or other real provider request was made during this implementation/validation run |
| Performance field data / Lighthouse score | NOT VERIFIED | Responsive behavior and image assets were checked; no production field Core Web Vitals or reproducible Lighthouse score is claimed |

## Responsive result and screenshots

At a configured 390 × 844 browser viewport, the homepage document height changed from 12,259 px at the rollback baseline to 11,885 px in the final build: a reduction of 374 px, approximately 3.1%. The final document heights were 11,932 px at 375 width, 8,888 px at 768 width and 6,896 px at 1440 width. These are layout measurements, not performance scores.

Screenshot filenames record the configured browser viewport. The JPEG raster is 15 px narrower where the browser's vertical scrollbar is excluded from capture; the page itself was still tested at the named CSS viewport width.

- Baseline mobile: `optimization-2026-11-15/before/home-baseline-mobile-390.jpg`
- Final homepage: `optimization-2026-11-15/after/final-home-mobile-375.jpg`, `final-home-mobile-390.jpg`, `final-home-tablet-768.jpg`, `final-home-desktop-1440.jpg`
- Representative service: `final-consolidation-mobile-390.jpg`, `final-consolidation-desktop-1440.jpg`
- Quote: `final-quote-mobile-390.jpg`, `final-quote-desktop-1440.jpg`
- Additional review: `final-express-desktop-1440.jpg`, `final-about-desktop-1440.jpg`
- Mock result states: `mock-success-mobile-390.jpg`, `mock-failed-mobile-390.jpg`, `mock-pending-mobile-390.jpg`

## Inquiry-delivery status

The current run used the repository's loopback-only controllable provider. The final field-complete accepted mock request was recorded once; it was not a real email and does not prove inbox delivery.

Separately, the owner previously confirmed that exactly one current-schema FormSubmit message for request `GL-20261111-5D836B44` reached `zoe@gdlogi.com`, contained the expected fields and used the controlled contact address as Reply-To. A manual reply's eventual delivery to that mailbox remains `NOT_VERIFIED`. No repeat real submission is needed for this release record.

## SEO and content records

- Current page/query map: `../docs/SEO-PAGE-MAP-2026-11-15.md`
- Thirty-day evidence-gated content sequence: `../docs/CONTENT-PLAN-30-DAYS-2026-11-15.md`
- Company/content source boundaries: `../docs/GDLOGI-SOURCE-OF-TRUTH.md`
- Operational-media usage record: `../docs/OPERATIONAL-MEDIA-PLAN.md`
- Launch gates: `launch-readiness-checklist.md`

## Remaining production decisions

1. Confirm the Vercel production project, production branch, environment variables and release trigger against the exact release commit. They are not recoverable from the repository alone.
2. Decide whether best-effort per-instance limiting/idempotency is acceptable. Vercel's scalable/serverless execution requires an atomic TTL-capable shared store before these controls can be described as cross-instance reliable.
3. Complete qualified review of the privacy notice and terms: legal entity details, processing regions/recipients, retention, governing law and dispute route remain unverified.
4. Confirm any named-case or certificate publication rights before adding them. The current release deliberately omits unsupported claims.
5. If reply-path confirmation is required, Zoe should manually reply to the already received controlled message and confirm arrival at the controlled test mailbox. Do not submit the inquiry again.

## Controlled release procedure

1. Review this branch and the diff from `4e5809153dfa06e86dccd57e7f6babf4d4d66842`.
2. Push only after explicit approval, preserving both the baseline and final local commits.
3. Create a Vercel preview from the exact approved commit and configure only the verified production environment values; never copy local-mock settings.
4. Recheck the homepage, consolidation page, Quote, a destination page, redirects, canonical/sitemap and `/api/inquiry/` configuration on the preview.
5. Promote that exact deployment to production, then run non-submitting smoke checks and verify the live deployment SHA/domain mapping.
6. Do not send another live inquiry unless a separately approved mailbox test is needed. If authorized, use one marked non-customer request, never auto-retry `PENDING`, and distinguish provider acceptance from inbox receipt.

## Rollback

- Preferred operational rollback: use Vercel's deployment rollback to the deployment built from `4e5809153dfa06e86dccd57e7f6babf4d4d66842`.
- Repository rollback: create explicit revert commits for the release commits; do not reset or rewrite shared history.
- After rollback, verify the live domain mapping, homepage, Quote route and inquiry configuration before declaring the rollback complete.
