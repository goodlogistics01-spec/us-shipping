# Operational media selection validation — 2026-11-13

## Scope

The owner confirmed that all materials uploaded to the project may be considered for public website use. Selection remains page-task based: authorization does not make every file factually suitable, privacy-safe or useful for the current China-to-USA site.

No inquiry logic, provider configuration or form field was changed in this media-only round.

## Selected additions

| Page | Public derivative | Source treatment | Public wording boundary |
| --- | --- | --- | --- |
| Sea Freight | `container-handoff-*` | Vertical crop excludes the plate, trailer identifiers and most surroundings; container identity is blurred; metadata is stripped | Neutral closed-container handoff context only; no Chicago case, route or result claim |
| Oversized Cargo | `specialist-lifting-*` | Crop excludes people, equipment-provider branding, vehicle identity and readable shipment details; metadata is stripped | Specialist lifting context only; no owned equipment, facility, route or project claim |

The existing `loading-coordination-*` image remains active on the homepage. The sea-freight and oversized pages replace repeated uses with the two selected derivatives, so the pages gain distinct imagery without adding new page sections.

## Materials intentionally not selected

- UK delivery images: geographically mismatched with the current U.S.-focused proof positions and contain faces, plates or identifiable locations.
- `早到柜子.jpg`: faces, plates, container identity, location clues and prominent third-party branding would require excessive anonymization.
- Chicago-folder customer carton close-ups and seal detail: customer marks, product data or seal number remain visible; the exact folder-to-case mapping is not verified.
- Generic aircraft, ocean and support-team images: insufficient provenance and unsuitable as Good Logistics operational or team proof.
- Private chat, payment, backend, POD/CMR, electronic seal, business-license and filing originals: contain third-party, account, commercial or legal personal information.
- Old author card, old logo and Amazon illustration: conflicting brand/fact or trademark/source risk.
- Duplicate crops: not added when the source operation was already represented.

## Automated verification

- `pnpm test`: **40/40 passed**.
- `pnpm build`: **passed** in an isolated temporary project copy using Next.js 16.3.1.
- `pnpm test:preview http://127.0.0.1:3194`: **passed**.
  - 20 sitemap pages
  - 878 internal link checks / 28 unique targets
  - 25 legacy redirects
  - 58 rendered-image checks
  - 17 image-asset checks; 13 AVIF sources rendered
  - title, description, H1 and canonical present on every sitemap page
  - brand/contact consistency passed
  - robots, sitemap and thank-you indexing controls passed
- `git diff --check`: **passed**.
- Image generator syntax and changed JavaScript syntax checks: **passed**.

The first isolated build attempt used an external `node_modules` symlink and was rejected by Turbopack's filesystem-root rule. The successful build copied the existing installed dependency tree into the isolated directory; no dependency version was changed.

## Browser and responsive verification

Checked the final isolated production build at 375, 390, 768 and 1440 CSS-pixel widths.

- No horizontal page overflow on either changed page (`scrollWidth === clientWidth`).
- The oversized page loaded `specialist-lifting` through AVIF responsive sources with explicit alt text and intrinsic dimensions.
- The sea-freight page loaded `container-handoff` through AVIF responsive sources with explicit alt text and intrinsic dimensions.
- Mobile images remain proportionate and use `object-fit: cover`; no stretching or broken crop was observed.
- Mobile navigation opened and closed successfully.
- The oversized primary CTA resolves to `/quote/?shipping_method=not-sure&service_need=shipping`.
- No form submission was made.

## Screenshots

- `media-placement-oversized-desktop-2026-11-13.jpg`
- `media-placement-oversized-mobile-390-2026-11-13.jpg`
- `media-placement-sea-freight-desktop-2026-11-13.jpg`
- `media-placement-sea-freight-mobile-390-2026-11-13.jpg`

Deployment status at this validation checkpoint: **not yet deployed**.
