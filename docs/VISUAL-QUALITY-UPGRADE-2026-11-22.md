# Visual Quality Upgrade Record — 2026-11-22

This internal record defines the baseline, protected functionality, factual boundaries, and final evidence required for the November 2026 site-wide visual quality upgrade.

## Baseline and rollback point

| Item | Record |
| --- | --- |
| Baseline commit | `c6261ceb8459c99820b6a8fc10583f5fb83047a2` |
| Baseline screenshots | `artifacts/visual-quality-upgrade-2026-11-22/before/` |
| Baseline browser report | `artifacts/visual-quality-upgrade-2026-11-22/before/before-browser-report.json` |
| Production action in this task | None — local implementation and validation only |
| Real inquiry submission in this task | None |

The baseline commit is the rollback checkpoint for this upgrade. Existing user work must not be discarded, reset, cleaned, or reconstructed from an older project state.

## Upgrade objective

The upgrade is intended to establish one coherent visual and content system across the homepage, service pages, destination pages, About, Quote, Contact, and Resources. The first calibration pair is the homepage and China-to-USA sea-freight page. The resulting system should then be applied to the other active pages without creating duplicate URLs or a separate demonstration site.

Primary outcomes:

- replace the carton-close-up homepage hero with a restrained international-freight visual;
- use consistent typography, spacing, containers, buttons, cards, navigation, and footer treatment;
- turn authorised operational photographs into concise, accurately bounded capability evidence;
- keep international English-market framing while preserving established USA and special-destination content;
- reduce repeated, internal-review-style copy and shorten the mobile path to contact or quote;
- retain searchable HTML text, accurate alternative text, existing metadata relationships, and working internal links.

## Protected functionality

The implementation and final validation must preserve:

- the existing inquiry endpoint and field contract;
- separate transport-mode and service-needs selections;
- editable service preselection from contextual links;
- the two inspection choices: receiving checks and separately scoped product-quality inspection;
- `SUCCESS`, `FAILED`, and `PENDING` submission semantics;
- honeypot, validation, rate-limit, idempotency, and duplicate-click protections;
- existing formal URLs, exact redirects, canonical URLs, robots rules, and sitemap relationships;
- express-freight content and all confirmed USA, Hawaii, Alaska, and Puerto Rico entry points;
- current analytics event boundaries, with confirmed success counted only after the server accepts the inquiry.

No final validation may send an inquiry to a real provider.

## Content and evidence boundaries

Safe public facts and service descriptions are governed by `docs/GDLOGI-SOURCE-OF-TRUTH.md`. Operational image use is governed by `docs/OPERATIONAL-MEDIA-PLAN.md` and the asset register created for this upgrade.

The public implementation must not add or imply:

- NVOCC, licensed-freight-forwarder, laboratory, inspection, or other credential claims without a verifiable public document and matching legal entity;
- a founding year, years-in-business claim, warehouse area, customer count, on-time rate, savings percentage, or other scale metric without evidence;
- ownership of warehouses, vehicles, port facilities, handling equipment, overseas networks, or partner resources;
- a public customer case, testimonial, customer logo, delivery result, transit time, or named route result without confirmed source material and publication authority;
- AQL, laboratory testing, certification, or 100% inspection as part of general receiving checks.

The following neutral facts may be used when relevant:

- based in Shenzhen, China;
- ocean, air, and express options;
- supplier pickup, consolidation, cargo preparation, and delivery coordination;
- service planning for the USA, Canada, the UK, Europe, Australia, and New Zealand, without implying unconditional country-wide coverage or DDP availability.

## Visual evidence set

The baseline set contains matching desktop and mobile screenshots for:

- homepage;
- China-to-USA sea freight;
- a representative generic service page;
- a representative destination page;
- About;
- Quote;
- Contact;
- Resources.

Baseline visual checks found no horizontal overflow or broken images at the captured viewports. The final set must use the same routes and viewport dimensions so that page height, hierarchy, image treatment, and mobile compression can be compared directly.

## Final acceptance ledger

The final checks below were run against the production build served at `http://127.0.0.1:3277` with the inquiry endpoint connected only to the loopback mock provider at `http://127.0.0.1:3278/mock`.

| Area | Required evidence | Current state |
| --- | --- | --- |
| Final commit | Local commit hash and clean-worktree check | PASS — committed locally on `codex/gdlogi-v2-optimization-20261115`; the handoff records the resulting hash because a commit cannot include its own hash. |
| Final build | Successful production build output | PASS — `pnpm build`; 26 static pages generated, `/api/inquiry` and `/thank-you` remain dynamic. |
| Automated tests | Applicable unit/integration test totals and result | PASS — `pnpm test`; 49/49 tests passed. |
| Controlled inquiry mock | Explicit success, failure, pending, validation, and duplicate-submit results without a real provider request | PASS — SUCCESS, FAILED, HTTP 202 PENDING, ambiguous-response PENDING, idempotent replay and browser double-click covered. Provider was reset to `success`; no external provider was called. |
| Responsive layout | 375, 390, 768, and 1440 px checks, including menu, CTAs, forms, fixed elements, and horizontal overflow | PASS — 32 route/viewport combinations; no horizontal overflow or unexpected fixed overlays. Report: `after/after-responsive-qa.json`. |
| Final screenshots | Matching files under `artifacts/visual-quality-upgrade-2026-11-22/after/` | PASS — 16 matching desktop/mobile screenshots plus `after-browser-report.json`. |
| Mobile page height | Before/after height comparison for the homepage and sea-freight page | PASS — homepage 11,725 → 8,452 px; sea freight 16,422 → 9,016 px at 390 px. |
| Navigation and links | Header, footer, internal links, active service/destination CTAs, and contextual quote preselection | PASS — 1,219 rendered internal links checked across 22 sitemap pages; scenario preselection verified and editable. |
| Search controls | Canonical, robots, sitemap, heading hierarchy, metadata, and redirect regression | PASS — title, description, H1 and canonical on all 22 sitemap pages; 41 legacy redirects checked; thank-you remains noindex and cookie-bound. |
| Image delivery | Responsive source selection, intrinsic dimensions, lazy loading where appropriate, no broken images | PASS — 65 rendered images checked; 19 unique assets requested; 18 AVIF sources rendered; intrinsic dimensions present. |
| Accessibility smoke check | Keyboard menu/form flow, visible focus, labels, alternative text, and reduced-motion handling | PASS — mobile menu opens and closes by Escape, empty-form focus reaches the first invalid field, labels/alts/CTA target sizes checked, no auto carousel or video added, homepage motion is reduced under the user preference. |
| Production status | Confirm no push, deployment, domain switch, or real inquiry occurred | PASS — no push, deployment, domain switch or real-provider inquiry occurred. |

## Measured before and after heights

| Page | Desktop before | Desktop after | Mobile 390 before | Mobile 390 after |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 6,970 px | 5,719 px | 11,725 px | 8,452 px |
| Sea freight | 9,349 px | 5,449 px | 16,422 px | 9,016 px |
| Supplier consolidation | 5,247 px | 4,089 px | 9,500 px | 7,006 px |
| Hawaii destination | 3,371 px | 2,869 px | 5,886 px | 5,319 px |
| About | 3,709 px | 2,913 px | 6,162 px | 4,796 px |
| Quote | 1,903 px | 1,982 px | 3,536 px | 3,400 px |
| Contact | 1,247 px | 1,408 px | 2,504 px | 2,549 px |
| Resources | 1,665 px | 1,611 px | 3,598 px | 3,360 px |

The Quote and Contact desktop pages are slightly taller because the shared navigation/footer and direct-contact information are more complete; their main task areas remain shorter and visually clearer. Homepage mobile height decreased by 27.9%, and sea-freight mobile height decreased by 45.1%.

## Production-only and business-evidence limits

- No real inquiry was sent during this task. The current build was tested only with the controlled loopback provider.
- The previously reported real receipt does not by itself re-verify this final local build or its eventual production environment.
- Analytics events are implemented, but external collection is not considered active unless a valid production container and consent path are configured and verified.
- Shared Upstash Redis state is implemented for atomic rate limiting and idempotency; real Vercel Preview configuration and cross-instance behavior remain unverified and are still a release gate. Public requests do not fall back to process memory.
- No public credential document, authorised customer case, testimonial, transit-time table, or company-scale metric was added because matching evidence and publication authority were not available. Hero video is not required for release; the current static hero uses separately recorded licensed industry photography.
- The container-ship Hero is licensed industry context, not evidence of a GOOD LOGISTICS-owned vessel, facility, shipment, vehicle, container, or route.

## Rollback

The exact rollback checkpoint is `c6261ceb8459c99820b6a8fc10583f5fb83047a2`. Use a normal Git revert of the visual-upgrade commit after it is created; do not reset or clean a worktree that may contain later user changes.
