# Supplement Work Baseline — 2026-11-10

This checkpoint records the inherited first-round repair state before the China-operations and service-architecture supplement was implemented.

- Branch: `codex/inquiry-first-round-20261110`
- Existing uncommitted changes were preserved in place; no reset, checkout, cleanup, deployment, DNS change, or live inquiry was performed.
- The related task had completed its active code edits and was only running preview checks. Conflict-file modification times were stable across two checks before this task became the sole writer.
- Baseline unit tests: `npm test` — 18 passed, 0 failed.
- Existing P0 behavior retained as the implementation base:
  - same-origin `/api/inquiry/` delivery route;
  - explicit `SUCCESS`, `FAILED`, and `PENDING` semantics;
  - client duplicate-submit lock and server rate limit;
  - exact legacy-home redirects;
  - protected `/thank-you/` confirmation behavior;
  - analytics events emitted only after the corresponding state.

## Supplement implementation order

1. Add separate shipping-method and multi-value service-needs fields to the existing API schema, provider payload, and mock tests.
2. Reuse the same submission flow in the React quote form, homepage form, and maintained legacy form entry.
3. Upgrade homepage positioning, customer paths, service structure, verified case content, navigation, and internal links.
4. Expand existing service URLs and add only substantive new service pages.
5. Run unit tests, production build, redirect/link checks, mock submission checks, and responsive/keyboard preview QA.

