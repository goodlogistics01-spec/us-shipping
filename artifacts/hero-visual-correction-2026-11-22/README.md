# Hero visual correction evidence — 2026-11-22

## Scope and baseline

- Baseline commit: `3016ff03e67792ad93390567ad1f489ab779d5bc`
- Branch: `codex/gdlogi-v2-optimization-20261115`
- Scope: homepage and Sea Freight hero layout, responsive imagery and necessary styles only.
- No production push, deployment or real inquiry was performed.

## Screenshot matrix

| Page | Viewport | Before | After | Layout metrics |
| --- | --- | --- | --- | --- |
| Homepage | 1440 × 1000 | `before/home-desktop-1440.png` | `after/home-desktop-1440.png` | `after/home-desktop-1440.png.json` |
| Homepage | 390 × 844 | `before/home-mobile-390.png` | `after/home-mobile-390.png` | `after/home-mobile-390.png.json` |
| Sea Freight | 1440 × 1000 | `before/sea-desktop-1440.png` | `after/sea-desktop-1440.png` | `after/sea-desktop-1440.png.json` |
| Sea Freight | 390 × 844 | `before/sea-mobile-390.png` | `after/sea-mobile-390.png` | `after/sea-mobile-390.png.json` |

The after screenshots were captured from the final production build served locally at `http://127.0.0.1:3311/` with Chrome DevTools device metrics. At 390 px, both pages report `scrollWidth = clientWidth = 390`; both CTA controls and hero image cards remain inside the viewport. The mobile image candidates selected at runtime are the dedicated 640 px AVIF crops.

## Visual result

- Homepage: white hero, dark navy copy, primary quote button, outlined WhatsApp button and an aerial international terminal image with the container ship, cranes and containers visible.
- Sea Freight: the same page system but a distinct vessel-and-terminal photograph focused on container ships, cargo cranes and a tug.
- Desktop and mobile use separate image crops. Images use AVIF, WebP and JPEG fallback with intrinsic dimensions and responsive `sizes`.

## Source and use boundary

Source page, photographer, licence, crop basis and non-ownership boundary are recorded in `docs/VISUAL-ASSET-REGISTER-2026-11-22.md`. Both photographs are licensed industry context and are not represented as GOOD LOGISTICS facilities, vessels, cargo or completed shipments.

## Verification completed

- `pnpm test` — 66/66 passed.
- `pnpm build` — passed; 26 pages generated.
- `pnpm test:preview http://127.0.0.1:3311` — passed, including 22 sitemap pages, 1,219 internal links, 41 redirects and rendered responsive images.
- Exact-width browser evidence — passed at 1440 px and 390 px for both pages.
- Protected inquiry, Redis, destination, redirect, sitemap and robots files — no diff from baseline.
- No real email provider request was made.
