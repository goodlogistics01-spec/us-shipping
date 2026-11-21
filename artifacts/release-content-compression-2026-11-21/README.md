# Release content compression acceptance

Local-only acceptance evidence captured on 2026-11-21. No production deployment or real-provider request was made during this run.

## Page compression

| View | Previous capture | Final capture | Change |
| --- | ---: | ---: | ---: |
| Homepage, 375 px | 13,477 px | 11,775 px | -1,702 px (-12.6%) |
| Homepage, 390 px | 13,340 px | 11,725 px | -1,615 px (-12.1%) |
| Homepage, 768 px | 9,932 px | 8,962 px | -970 px (-9.8%) |
| Homepage, 1440 px | 7,721 px | 6,970 px | -751 px (-9.7%) |

The final homepage order is: hero, customer situations, transport modes, selected operations evidence, Zoe contact, compact three-step quote guidance, destinations, FAQ, and quote form.

## Responsive browser checks

- Homepage: 375, 390, 768, and 1440 px; no horizontal overflow.
- Mobile menu: 44 x 44 px button; Enter opened the menu and Services submenu, and Escape closed both and returned focus to the menu button.
- Quote page: no horizontal overflow at 390 or 1440 px.
- Quote form begins at 334 px from the top at 390 px and 318 px at 1440 px.
- Ocean freight, Shipping, Inspection, Receiving Checks, and Product Quality Inspection URL preselection remained visible and editable.

## Controlled mock form checks

An isolated loopback mock received exactly three requests. No real provider was contacted.

- SUCCESS: navigated to `/thank-you/` with a request reference and the expected confirmation heading.
- FAILED: stayed on the quote page, showed a corrective error, and re-enabled submit.
- PENDING: stayed on the quote page, stated that acceptance was not confirmed, did not auto-resend, and kept repeat submission disabled.
- The mock payload retained shipping method, multiple service needs, both inspection types, and the test marker.

## Automated checks

- `pnpm test`: 49/49 passed.
- `pnpm build`: passed; 26 pages generated and `/api/inquiry` remained a dynamic server route.
- `LOCAL_PREVIEW_ORIGIN=http://127.0.0.1:3257 pnpm test:preview`: passed, including canonical, robots, sitemap, legacy redirects, internal links, images, contact consistency, and thank-you-page checks.

See `browser-report.json` for measurements and request-state details. Screenshots in this folder are the final local render.
