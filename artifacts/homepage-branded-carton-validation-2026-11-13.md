# Homepage branded-carton validation — 2026-11-13

## Owner direction

- Zoe explicitly confirmed that the customer-branded carton photo may be used publicly on the website.
- The brand remains visible inside the cargo photograph; the page does not present it as a customer logo, testimonial, endorsement or named case.

## Placement and crop

- Source: `Desktop/芝加哥整柜直送/柜门封尾.jpg`.
- Published crop: `left: 0`, `top: 900`, `width: 3072`, `height: 2304`.
- Homepage placement: hero image.
- The crop excludes the truck plate, truck body identifiers, seal and container identifiers.
- No route, customer name, Chicago case or delivery result is asserted from the image.
- Responsive output: 480, 800 and 1200 px AVIF/WebP plus 1200 px JPEG fallback.

## Delivery-location evidence review

- `oversized-delivery-1/2` visibly show `ROYAL LIVER BUILDING 360 TOUR`; the second also shows Liverpool wording.
- `uk-unload.jpg` has UK-consistent rear-plate, double-yellow-line and `01442` telephone evidence, but no verified city.
- `uk-arrival.jpg` and `uk-crane-delivery.jpg` do not contain enough unique visible evidence to assert an exact location.
- None of these photos is used as evidence of U.S. delivery.

## Technical validation

- `git diff --check`: passed.
- `node --check scripts/generate-operation-images.mjs`: passed.
- `pnpm test`: passed, 40/40 tests.
- `pnpm build`: passed with Next.js 16.3.1.
- Desktop visual check: 1440 × 900.
- Mobile visual check: 390 × 844.
- No inquiry was submitted.
- No push or production deployment was performed.

## Screenshots

- `homepage-branded-carton-desktop-2026-11-13.jpg`
- `homepage-branded-carton-mobile-390-2026-11-13.jpg`
- `homepage-branded-carton-mobile-image-390-2026-11-13.jpg`

Local validation preview: `http://127.0.0.1:3157/`
