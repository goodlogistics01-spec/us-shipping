# Homepage media-balance validation — 2026-11-13

## Scope

- Replaced the crate-led homepage hero with a privacy-cropped paper-carton handling photo.
- Rebalanced the homepage operations strip across consolidation staging, carton handling and container handoff.
- Kept a wooden-crate photo only where it accurately supports oversized-cargo planning.
- Added a fully opaque-redacted delivery-record example to the U.S. delivery section.
- Did not use UK delivery photos as evidence of U.S. delivery and did not publish the customer-branded carton-loading photo.

## Privacy and authenticity checks

- The carton derivative excludes the visible face, uniform mark, plates, vehicle and container identity from the source image.
- The delivery-record source remains outside Git and the public asset directory.
- Driver, vehicle/container, date, times, full address, ZIP and signature values are covered in the public derivative.
- Captions stay neutral and do not identify a customer, facility, route, case result or asset ownership.

## Technical validation

- `git diff --check`: passed.
- `node --check scripts/generate-operation-images.mjs`: passed.
- `pnpm test`: passed, 40/40 tests.
- `pnpm build`: passed with Next.js 16.3.1.
- Desktop visual check: 1440 × 900.
- Mobile visual and navigation check: 390 × 844; menu opened and exposed the expected links and quote CTA.
- No inquiry was submitted.
- No production deployment or push was performed.

## Screenshots

- `homepage-media-desktop-1440-2026-11-13.jpg`
- `homepage-media-operations-desktop-2026-11-13.jpg`
- `homepage-media-delivery-desktop-2026-11-13.jpg`
- `homepage-media-mobile-390-2026-11-13.jpg`
- `homepage-media-mobile-390-hero-image-2026-11-13.jpg`

Local validation preview: `http://127.0.0.1:3157/`
