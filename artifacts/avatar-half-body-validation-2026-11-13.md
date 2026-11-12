# Zoe Zhou Upper-Body Portrait Validation — 2026-11-13

## Scope and authorization

- Public-use authorization remains the owner's explicit confirmation for `/Users/zoe/Desktop/头像.png`.
- The source and existing 640×904 AVIF/JPEG web assets already include Zoe's full head, shoulders and upper torso.
- This change adjusts only how those existing assets are displayed. No AI generation, face editing, source crop, stretching or invented body area was used.
- Zoe Zhou's name, role, contact information and page layout content were retained.

## Root cause and display change

- The previous current-page styles used `object-fit: cover` inside containers whose aspect ratios did not match the source. At some widths this enlarged and cropped the portrait so it appeared head-only.
- The homepage contact card and Zoe profile page now use `object-fit: contain` and top-center positioning.
- The medium-width homepage photo column is 220px instead of 160px so the complete upper-body portrait remains legible before the mobile single-column breakpoint.
- The profile page uses the intrinsic 640:904 aspect ratio instead of a fixed 430px crop box.
- Current-page alt text is `Upper-body portrait of Zoe Zhou, Director of International Logistics at Good Logistics`.

## Responsive browser validation

| Check | Result | Evidence |
| --- | --- | --- |
| Homepage contact card, 1440×1000 | PASS | 640×904 asset; `contain`; top-center; no horizontal overflow; `artifacts/avatar-half-body-previews-2026-11-13/home-zoe-upper-body-1440.jpg` |
| Homepage contact card, 768×900 | PASS | 220px photo column; `contain`; no horizontal overflow |
| Homepage contact card, 390×844 | PASS | Full head, shoulders and upper torso visible in the single-column card; no horizontal overflow; `artifacts/avatar-half-body-previews-2026-11-13/home-zoe-upper-body-390.jpg` |
| Zoe profile, 1440×1000 | PASS | Rendered at 360×509, matching the 640:904 source ratio; `contain`; no overflow; `artifacts/avatar-half-body-previews-2026-11-13/profile-zoe-upper-body-1440.jpg` |
| Zoe profile, 390×844 | PASS | Rendered at 347×490, matching the 640:904 source ratio; full upper body visible; no overflow; `artifacts/avatar-half-body-previews-2026-11-13/profile-zoe-upper-body-390.jpg` |
| Browser console | PASS | No warning or error entries during the responsive checks |

## Build and regression checks

- `pnpm test`: PASS, 40/40 tests.
- `pnpm build`: PASS under Next.js 16.3.1; all 24 static pages generated and `/api/inquiry` retained as a server route.
- `git diff --check`: PASS.
- Inquiry submission, provider delivery and real-email tests were not repeated because this change does not touch inquiry code or configuration.
- No real inquiry was sent. Nothing was deployed or pushed.

Local production preview used for this check: `http://127.0.0.1:3142/`.
