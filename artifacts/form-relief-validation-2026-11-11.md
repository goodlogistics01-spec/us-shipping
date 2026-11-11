# Inquiry Form Relief Validation — 2026-11-11

## Scope

Baseline: `d7d1c1ed49683547d086e2ac32b68e2787600b6c` on
`codex/inquiry-first-round-20261110`.

This change only reorganizes the homepage and shared React inquiry forms:

- The core fields remain visible.
- Weight and volume remain optional and explicitly accept unknown values.
- Company, phone, cargo-ready date, package count, packed dimensions and notes
  are grouped under a native, default-closed `Add shipment details (optional)`
  disclosure.
- Inspection types remain conditional on selecting Inspection.
- The API route, client submission contract, Provider payload, email body,
  SUCCESS / FAILED / PENDING semantics, honeypot, rate limiting and idempotency
  were not changed.

The sea-freight quote layout also changes to one column at 860px and below so
the form and its optional-detail grid remain readable at the required 768px
tablet width.

## Automated checks

| Check | Result |
| --- | --- |
| `pnpm test` | PASS — 39/39 inquiry tests |
| `pnpm build` | PASS — Next.js 16.3.1 production build, 24 pages |
| `git diff --check` | PASS |
| Browser console warnings/errors | PASS — none captured |

The full SEO/link/redirect acceptance was not repeated because this change
does not touch routing, metadata, robots, sitemap, images or redirects.

## Browser and controlled-mock checks

The exact production build was served at `http://127.0.0.1:3131`. Its only
Provider endpoint was the loopback mock at `http://127.0.0.1:3199/mock`.
No request could reach FormSubmit or another real email Provider.

| Check | Evidence | Result |
| --- | --- | --- |
| Homepage default state | 390px; optional disclosure closed; required-field microcopy present | PASS |
| Quote default state | 375px; disclosure closed; service URL preselection remained editable | PASS |
| Sea-freight tablet layout | 768px; form becomes a 713px single column with the contact card below | PASS |
| Desktop details | 1440px; form and nested detail grid stay within the 920px form shell | PASS |
| Keyboard disclosure | Enter opened and Space closed the native summary | PASS |
| Hidden field error | WhatsApp selected, details closed, empty phone: details reopened and phone received focus | PASS |
| Inspection | Conditional fieldset appeared; receiving checks and product-quality inspection were selected together | PASS |
| Homepage SUCCESS | `GL-20261111-83D46DC3` | PASS |
| Quote explicit FAILED | `GL-20261111-A4872BAE`; button re-enabled and values remained editable | PASS |
| Corrected Quote SUCCESS | `GL-20261111-2FDA5E62` | PASS |
| Sea-freight PENDING | `GL-20261111-9B2E9D8C`; no redirect, button locked, no automatic resend | PASS |

The homepage SUCCESS mock record retained the values entered while the
disclosure was closed: company, shipping method, phone, cargo-ready date,
package count, packed dimensions and notes. It also retained ocean freight,
multiple services, both inspection types, weight and volume.

Form containers had no horizontal overflow at 375, 390, 768 or 1440px. A
pre-existing hidden desktop Services dropdown still makes the overall Quote
document scroll width wider at 1440px; that navigation issue was not introduced
or changed in this form-only task.

## Screenshots

- `artifacts/form-relief-previews-2026-11-11/home-390-collapsed.png`
- `artifacts/form-relief-previews-2026-11-11/quote-375-collapsed.png`
- `artifacts/form-relief-previews-2026-11-11/sea-freight-768-expanded.png`
- `artifacts/form-relief-previews-2026-11-11/quote-1440-expanded.png`

## Release status

- Real email Provider: **not contacted**
- Real inbox: **not retested**
- Production: **not deployed**
- Push: **not performed**
