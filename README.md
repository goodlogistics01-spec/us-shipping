# Good Logistics Website

This repository contains the GOOD LOGISTICS B2B website for China-side cargo operations and China-to-USA freight and final-delivery coordination. `Good Logistics Co., Ltd.` is owner-approved public wording; its status as an official registered English legal name still requires source-document verification.

## Included Pages

- Homepage rendered at `/`
- Nine substantive service pages under `/services/`, covering China operations and international freight/delivery
- Destination pages for Hawaii, Alaska, and Puerto Rico under `/destinations/`
- SEO resource hub at `/resources/`
- Draft long-form article pages under `/good-shipping-homepage/blog/` (not included in the current sitemap pending review)
- Company and Zoe Zhou profile pages under `/about/`
- B2B inquiry form at `/quote/` and contact page at `/contact/`
- Privacy, terms, custom 404, `robots.txt`, and `sitemap.xml`

Legacy service, destination, resource, author, and inquiry files remain available at their original URLs. `next.config.mjs` uses only explicit compatibility redirects for duplicate legacy-home URLs, the old thank-you URL, and canonical resource/author paths; it does not redirect the whole legacy directory.

## Tech Stack

- Next.js App Router
- Static HTML resources served from `public/`
- Homepage content loaded from `content/good-logistics-homepage-v2.html`

## Local Commands

```bash
npm install
npm run dev
npm run build
npm run start
```

## Inquiry delivery

The homepage quick quote, standalone inquiry page, `/quote/`, Sea Freight form, and article popup forms submit to the same-origin `/api/inquiry/` route. The route validates and normalizes fields, preserves separate shipping-method and multi-value service-needs data, applies a honeypot and lightweight rate limit, and then sends accepted data to the configured delivery provider for `zoe@gdlogi.com`.

- FormSubmit is the current default provider, but production activation and final mailbox delivery remain unverified in this local-only repair round.
- FormSubmit CAPTCHA is not explicitly disabled. The AJAX flow and provider spam response must be confirmed during the approved end-to-end test.
- `/thank-you/` displays the received message only when the API has received an explicit success response and set a short-lived confirmation cookie.
- A provider-confirmed success redirects to `/thank-you/`. Explicit validation or provider rejection stays on the form with failure guidance. A timeout or otherwise unknown provider response stays on the form in a non-error `PENDING` state and keeps the submit button locked to prevent a duplicate inquiry.
- Each accepted attempt receives a non-sensitive `submission_id` in the format `GL-YYYYMMDD-XXXXXXXX`; it is included in the provider payload, email subject, API response, and client state.
- Forms include native and server validation, accessible status regions, consent text, a honeypot, request-size limits, and duplicate-submit protection.
- Local QA must use a local provider stub. No additional live inquiry may be sent without owner approval.

Provider test overrides are available through `INQUIRY_PROVIDER_ENDPOINT` and `INQUIRY_PROVIDER_TIMEOUT_MS`. Analytics events are emitted anonymously without loading an external tag; set `GTM_CONTAINER_ID` and grant analytics consent before Google Tag Manager may load. See `docs/ANALYTICS-SETUP.md`.

## Launch readiness

The codebase intentionally keeps unverified certificates, shipment outcomes,
the detailed Shenzhen office address, and final legal details unpublished.
Review `artifacts/launch-readiness-checklist.md` before any production release.
