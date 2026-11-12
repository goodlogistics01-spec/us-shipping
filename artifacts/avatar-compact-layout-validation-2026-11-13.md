# Zoe Zhou Compact Portrait Layout Validation — 2026-11-13

## Scope

- Reduce the current-page portrait from a large visual panel to a compact contact thumbnail.
- Keep the approved 640×904 upper-body asset, intrinsic aspect ratio, alt text, name, role and contact details unchanged.
- Do not crop, stretch, regenerate or otherwise alter the source photo.
- Do not change inquiry behavior, business content, navigation or deployment configuration.

## Implemented dimensions

- Homepage contact card: 132px wide on desktop/tablet and 112px on mobile.
- Zoe profile: 132px wide on desktop, 112px at the tablet breakpoint and 104px on narrow mobile.
- For comparison, the site navigation logo is 126px on desktop and 112px on mobile, so the final portrait is intentionally in the same visual-size range.
- The portrait remains `height: auto` with a 640:904 aspect ratio and `object-fit: contain`.

## Responsive validation

| Page and viewport | Result | Measured evidence |
| --- | --- | --- |
| Homepage, 1440×1000 | PASS | Portrait 132×186; contact card 1280×541; no horizontal overflow; `artifacts/avatar-compact-previews-2026-11-13/home-compact-1440.jpg` |
| Homepage, 768×900 | PASS | Portrait 132×186; contact card 713×556; no horizontal overflow |
| Homepage, 390×844 | PASS | Portrait 112×158; contact card reduced from the previous 1139px to 872px; no horizontal overflow; `artifacts/avatar-compact-previews-2026-11-13/home-compact-390.jpg` |
| Zoe profile, 1440×1000 | PASS | Portrait 132×186; hero grid 1160×285; no horizontal overflow; `artifacts/avatar-compact-previews-2026-11-13/profile-compact-1440.jpg` |
| Zoe profile, 768×900 | PASS | Portrait 112×158; hero grid 713×276; no horizontal overflow |
| Zoe profile, 390×844 | PASS | Portrait 104×147; hero grid 347×387; name remains on one line; no horizontal overflow; `artifacts/avatar-compact-previews-2026-11-13/profile-compact-390.jpg` |
| Browser console | PASS | No warning or error entries during the responsive checks |

## Automated checks

- `pnpm test`: PASS, 40/40 tests.
- `pnpm build`: PASS with Next.js 16.3.1; all expected static pages generated and `/api/inquiry` retained as a server route.
- `git diff --check`: PASS.

## Not run

- No inquiry was submitted and no email provider was contacted because inquiry code was not changed.
- No production deployment or push was performed.

Local production preview used for this check: `http://127.0.0.1:3142/`.
