# Operational media validation — 2026-11-13

## Scope

- Added privacy-reduced, responsive operational photos to the homepage, selected service pages and the sea-freight cargo-facts section.
- Did not change inquiry logic, submit a real inquiry, deploy, push or stop the existing shared preview.
- Final-build preview: `http://127.0.0.1:3170/`.

## Build and automated checks

- `pnpm test`: PASS — 40/40 tests.
- `pnpm build`: PASS in an isolated temporary project copy, so the shared `.next` directory was not used.
- `pnpm test:preview http://127.0.0.1:3170`: PASS.
  - 20 sitemap pages.
  - 878 internal links / 28 unique targets.
  - 25 legacy redirects.
  - 58 rendered image elements.
  - 13 image asset paths and 13 AVIF sources.
  - Titles, descriptions, H1s, canonicals, robots, sitemap, brand and contact consistency passed.

## Browser checks

Homepage widths checked: 375, 390, 768 and 1440 CSS px.

| Width | Horizontal overflow | Operational image references | Hero image loaded |
| --- | ---: | ---: | --- |
| 375 | 0 px | 5 | Yes |
| 390 | 0 px | 5 | Yes |
| 768 | 0 px | 5 | Yes |
| 1440 | 0 px | 5 | Yes |

At 390 px, the following pages also had 0 px horizontal overflow and loaded the intended responsive image when scrolled into view:

- `/services/supplier-consolidation/`
- `/services/warehousing-inventory-coordination/`
- `/services/oversized-cargo-shipping/`
- `/services/sea-freight-china-to-usa/`

The browser selected 480 px AVIF derivatives on the 390 px homepage and generic service pages. Both sea-freight operation images loaded after scrolling into view.

Final responsive regression after the privacy and copy adjustments:

- At 768 px, the homepage operations grid remained two columns with no horizontal overflow; the browser selected the 480 px AVIF for a 346 px displayed image.
- At 390 px, the sea-freight quote-factor list computed as one column and had no horizontal overflow.

## Screenshots

- `operational-media-previews-2026-11-13/homepage-desktop-1440.jpg`
- `operational-media-previews-2026-11-13/homepage-mobile-390.jpg`
- `operational-media-previews-2026-11-13/homepage-operations-desktop-1440.jpg`
- `operational-media-previews-2026-11-13/homepage-operations-mobile-390.jpg`
- `operational-media-previews-2026-11-13/supplier-consolidation-mobile-390.jpg`
- `operational-media-previews-2026-11-13/sea-freight-operations-mobile-390.jpg`

## Rights and factual boundary

- Selected source photos were cropped to remove or reduce people, location signs, customer labels and third-party branding; remaining readable shipment markings were blurred and metadata was stripped.
- Captions describe visible cargo context only; they do not assert a photo location, owned warehouse, vehicle, equipment or a specific China-to-USA case.
- UK delivery images and `早到柜子.jpg` remain unused.
- RELEASE AUTHORIZATION RECORDED: on 2026-11-13, Zoe instructed that the current selected materials be published on `gdlogi.us` while supplemental materials are prepared later. This is recorded as owner approval for the five privacy-reduced derivative sets; photographer/customer provenance remains unverified and no project facts are inferred.

## Deployment status

This validation snapshot predates the authorized release. Confirm the live deployment against the release commit rather than inferring production status from this file.
