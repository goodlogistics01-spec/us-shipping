# Incremental conversion validation — 2026-11-21

## Scope and baseline

- Branch: `codex/gdlogi-v2-optimization-20261115`
- Starting commit: `4faedc5ef4bebcb5bf1ed880c9710f405b4e0f35`
- Scope: customer scenarios, evidence-led photo captions, a clearer first-shipment process, contextual quote entry points and anonymous CTA attribution.
- Deployment: local implementation and validation only. No push, production deployment or real provider request was made.
- Reference use: the Xiaohongbao Alibaba storefront was used only as structural inspiration for buyer scenarios, proof placement, process clarity and contact prompts. Its text, images, metrics, credentials and commercial claims were not copied.

## Evidence and claim decisions

### Used

- User-confirmed capabilities already recorded in the project: supplier pickup, receiving records, consolidation, warehousing coordination, labeling, repacking, kitting/light assembly, receiving checks, scoped product-quality inspection, international freight and agreed final delivery.
- Existing public brand and contact facts: GOOD LOGISTICS, Good Logistics Co., Ltd., 深圳市谷得供应链有限公司, Zoe Zhou, Shenzhen, email, phone and WhatsApp.
- Existing privacy-treated operation media already recorded for public website use: staged packaged cargo, cartoned container loading and redacted delivery-handoff record.

### Deliberately omitted or retained as internal-only

- NVOCC and international freight-forwarder qualification claims: evidence not verified for public wording.
- Warehouse ownership, warehouse area, customer count, employee count, years-in-business metric, on-time rate and similar scale claims: no accepted supporting record.
- Chicago multi-supplier shipment as a public case study: public authorization, image-to-shipment traceability and final result remain insufficient.
- Customer testimonials: no authorized, source-verifiable testimonial supplied.

No unsupported metric, credential, customer identity, fixed transit time, cost saving or case outcome was added.

## Implemented conversion map

| Context | Customer question | Primary action | Editable quote preselection |
| --- | --- | --- | --- |
| Multi-supplier buyers | Different factories finishing at different times | Plan My Consolidated Shipment | Shipping, Supplier Pickup, Consolidation; method Not Sure |
| FBA and e-commerce | Labeling or packing before freight | Discuss My FBA Shipment | Shipping, FBA Prep / Labeling, Repacking; method Not Sure |
| Complex cargo and addresses | Large/difficult cargo or special address | Review My Shipping Options | Shipping only; method Not Sure |

The homepage process is now three steps: customer inputs, Good Logistics scope mapping, and the written quotation/next steps the customer receives. Detailed service boundaries remain on service pages.

## Analytics status

- Local anonymous events verified: `page_view` and `quote_cta_click` with an allowlisted `link_location`.
- Homepage scenario, header and hero locations are allowlisted. Generic service-page and sea-freight in-page quote CTAs are also allowlisted.
- URL queries, visible link copy, names, email, phone and free-form cargo text are not used as event parameters.
- `quote_start`, `quote_submit_success`, `quote_submit_failed`, `quote_submit_pending`, WhatsApp and email events remain in the existing implementation.
- Production collection status: **code ready but not active or verified**. The repository contains no approved production `GTM_CONTAINER_ID` and no completed public consent UI. No ranking, traffic or conversion collection claim is made.

## Validation matrix

| Check | Result | Evidence |
| --- | --- | --- |
| Unit and route tests | PASS — 48/48 | `pnpm test` |
| Production build | PASS | `pnpm build` |
| Public routes, links, redirects, canonical, sitemap, robots, brand/contact and images | PASS | `pnpm test:preview http://127.0.0.1:3247`: 22 sitemap pages, 997 internal links, 41 redirects, 63 rendered images |
| Responsive widths | PASS | 375, 390, 768 and 1440 CSS px; no horizontal overflow; CTA heights 46–48 px |
| Mobile menus | PASS | Homepage and Quote headers opened with Enter; Escape closed them and restored focus |
| Scenario preselection | PASS | All three service sets and `not-sure` shipping method matched the field allowlist |
| Editable selection | PASS | Warehousing could be added and removed; original selections remained editable |
| Inspection branching | PASS | Inspection revealed separate receiving-check and product-quality options; both could be selected |
| Controlled browser submission | PASS, local mock only | One double-click produced one provider request, one request ID, a bound HttpOnly success cookie and the thank-you redirect |
| Provider payload | PASS, local mock only | Shipping, pickup, consolidation, warehousing, inspection and both inspection types were present |
| Real provider / inbox delivery | NOT RUN | Out of scope; no real email request was sent |
| Physical phone soft keyboard and dynamic browser chrome | NOT VERIFIED | Headless Chrome validated keyboard navigation and responsive layout, not a physical handset keyboard |

The controlled request contained the `[TEST-GDLOGI]` marker, used `qa@example.invalid`, stayed on loopback, and did not emit a confirmed-lead analytics event.

## Screenshots

### Current candidate

- `artifacts/incremental-conversion-2026-11-21/home-mobile-375.png`
- `artifacts/incremental-conversion-2026-11-21/home-mobile-390.png`
- `artifacts/incremental-conversion-2026-11-21/home-tablet-768.png`
- `artifacts/incremental-conversion-2026-11-21/home-desktop-1440.png`
- `artifacts/incremental-conversion-2026-11-21/home-mobile-menu-390.png`
- `artifacts/incremental-conversion-2026-11-21/quote-consolidation-mobile-390.png`
- Browser measurements and mock evidence: `artifacts/incremental-conversion-2026-11-21/browser-qa-results.json`

### Earlier comparison captures

- `artifacts/optimization-2026-11-15/before/home-baseline-mobile-390.jpg`
- `artifacts/optimization-2026-11-15/after/final-home-mobile-390.jpg`
- `artifacts/optimization-2026-11-15/after/final-home-tablet-768.jpg`
- `artifacts/optimization-2026-11-15/after/final-home-desktop-1440.jpg`

## Recommendation

The local candidate is suitable for stakeholder review. It does not introduce a new publication blocker. Production analytics activation, real inquiry-chain revalidation against the eventual release configuration, and the previously documented rollback/deployment checks remain separate pre-release tasks. This validation does not authorize deployment.
