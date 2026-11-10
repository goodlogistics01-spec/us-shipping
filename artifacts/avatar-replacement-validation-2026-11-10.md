# Zoe Zhou Avatar Replacement Validation — 2026-11-10

## Scope and authorization

- Source supplied by the owner: `/Users/zoe/Desktop/头像.png`
- Source SHA-256: `a11452c32f68bfa77c3cfc725fb73e922b9e65db643ddf690ebf7cdbfdf3e9ec`
- Confirmed scope: this specific uploaded photo may be displayed publicly on the website.
- Processing: deterministic resize and compression only. No AI generation, face editing, stretching or source-image crop was used.
- Name, title and page structure were retained.

## Generated web assets

| Asset | Dimensions | Size | SHA-256 | Use |
| --- | --- | ---: | --- | --- |
| `public/good-shipping-homepage/assets/authors/zoe-zhou-headshot-640.avif` | 640×904 | 18,872 bytes | `c3521ae06a11d56c61098b2bd342b3cbd22f626acef7d1994fbe94b825c19cfe` | Modern browser source for homepage and profile page |
| `public/good-shipping-homepage/assets/authors/zoe-zhou-headshot.jpg` | 640×904 | 63,693 bytes | `47b171a040fcdad56b74e1bdf6ad5d274c759cf0c73f1414be4116724695d9ad` | JPEG fallback, metadata and Schema image URL |
| `public/good-shipping-homepage/assets/authors/zoe-zhou-headshot-240.jpg` | 240×339 | 13,990 bytes | `4546b1ea8aee3c22731fab811485fb0ca852354af0ac796a125665d04549bce2` | Retained legacy resource sidebars displayed at 92×112 |

The original aspect ratio is preserved in every generated file. Existing fixed display boxes use `object-fit: cover`; top-center positioning keeps the full face visible without stretching.

## Reference coverage

- Current homepage contact card: `content/good-logistics-homepage-v2.html`
- Current Zoe profile page, page metadata and ProfilePage Schema: `app/about/zoe-zhou/page.js`
- Retained legacy resource/author sidebars: `public/good-shipping-homepage/resources/index.html` and `public/good-shipping-homepage/author/zoe-zhou/index.html`
- The old designed `zoe-zhou-author-card.jpg` has no tracked public-page reference and remains marked `DO NOT USE`; it was not modified.

## Targeted validation

| Check | Result | Evidence |
| --- | --- | --- |
| Isolated production build | PASS | Next.js 16.3.1 compiled and generated all 24 static pages, including `/about/zoe-zhou/` |
| Profile page, 1440px viewport | PASS | AVIF loaded at 640×904; rendered at 304×430; full face visible; `artifacts/avatar-previews-2026-11-10/zoe-profile-1440.jpg` |
| Profile page, 390px viewport | PASS | AVIF loaded at 640×904; rendered at 304×430; no horizontal overflow; `artifacts/avatar-previews-2026-11-10/zoe-profile-390.jpg` |
| Homepage card, 1440px viewport | PASS | AVIF loaded at 640×904; rendered at 332×543; full face visible; `artifacts/avatar-previews-2026-11-10/zoe-home-1440.jpg` |
| Homepage card, 390px viewport | PASS | AVIF loaded at 640×904; rendered at 345×429; no horizontal overflow; `artifacts/avatar-previews-2026-11-10/zoe-home-390.jpg` |
| Alt text and intrinsic dimensions | PASS | Current-page image markup uses `Portrait of Zoe Zhou, Director of International Logistics at Good Logistics` and 640×904 dimensions |

## Intentionally not run

- Inquiry submission and email-provider tests were not repeated because no inquiry code or business field changed.
- No real inquiry was submitted, no provider request was made, and nothing was deployed or pushed.
- Existing release gates unrelated to this photo—controlled current-schema inbox testing, deployment topology and production environment/legal review—remain unchanged.

Local isolated preview used for this targeted check: `http://127.0.0.1:3120/`.
