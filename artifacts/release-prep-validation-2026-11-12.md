# Release-prep patch validation — 2026-11-12

## Scope

- Baseline: `d19be0d5d12aece66e19b7c876d7aea3674b45d9`
- Branch: `codex/inquiry-first-round-20261110`
- Local-only validation; no push, deployment or inquiry submission
- Changes limited to navigation behavior, accurate redirects and metadata, form-label presentation, provider timeout headroom, resource CTA wording and supporting documentation/tests

## Source-of-truth decisions

- `GOOD LOGISTICS`, `Good Logistics Co., Ltd.` and `深圳市谷得供应链有限公司` remain approved public names.
- Because the registered English legal name is not verified, homepage Organization JSON-LD does not use `legalName`; both public company-name variants are represented as `alternateName` values.
- Five legacy article URLs now redirect one-to-one to the closest completed service or destination page. No unpublished article body or unapproved case content is published.
- FormSubmit ambiguous responses remain `PENDING`; no 2xx-only response is promoted to `SUCCESS`.

## Automated validation

- `git diff --check`: PASS
- `pnpm test`: PASS, 40/40
- `pnpm build`: PASS, 24 generated application routes/pages
- `pnpm test:preview http://127.0.0.1:3142`: PASS
  - 20 sitemap pages
  - 875 internal-link checks covering 28 unique targets
  - 25 legacy redirect checks, including the five exact article redirects
  - 50 rendered-image checks, 3 image assets and 2 rendered AVIF sources
  - title, description, H1 and canonical present on each sitemap page
  - consistent public brand, email and phone
  - thank-you remains noindex and confirmation-cookie bound

## Browser validation

| Viewport | Result | Evidence |
| --- | --- | --- |
| 1440px desktop homepage | PASS | Closed and open Services states had `scrollWidth === clientWidth`; dropdown stayed within the viewport. |
| 1265px desktop Quote | PASS | Hidden dropdown used `display:none`; open menu was 650px wide and inside the viewport; Escape hid it and returned focus to Services. |
| 1024px breakpoint | PASS | Desktop header remained usable with no horizontal overflow. |
| 768px tablet/mobile header | PASS | Menu and nested Services opened without overflow; Escape closed both and returned focus to the menu button. |
| 390px mobile | PASS | Navigation and CTA were usable; Quote labels kept required stars on the same line. |
| 375px mobile | PASS | Quote form and submit button stayed inside the viewport with no horizontal overflow. |

Additional checks:

- Focus ring on the restored Services button: solid 3px outline with 3px offset.
- Homepage Organization schema: `name=GOOD LOGISTICS`, two `alternateName` values, no `legalName` property.
- Resources: all five CTA labels accurately describe their service or destination target.
- Browser console: no warnings or errors observed.

## Screenshots

- `release-prep-previews-2026-11-12/home-1440-services-open.jpg`
- `release-prep-previews-2026-11-12/quote-390-menu-open.jpg`
- `release-prep-previews-2026-11-12/quote-390-form.jpg`

## Not verified / deployment dependencies

- No real provider request was sent in this patch. The previously controlled receipt result remains the evidence for one-message delivery, complete fields and Reply-To behavior.
- The in-process rate-limit and idempotency Maps remain single-instance best effort. Cross-instance reliability requires deployment-side WAF/shared atomic storage and production verification.
- Production analytics, provider environment values and actual platform configuration remain unverified until controlled release setup.
- Production was not deployed.
