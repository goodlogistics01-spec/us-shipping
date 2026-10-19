# Good Logistics Co., Ltd. Website

This repository contains the Good Logistics Co., Ltd. B2B logistics website for China-to-USA shipping services.

## Included Pages

- Homepage rendered at `/`
- Six service pages under `/services/`
- Destination pages for Hawaii, Alaska, and Puerto Rico under `/destinations/`
- SEO resource hub at `/resources/`
- Long-form article pages under `/good-shipping-homepage/blog/`
- Company and Zoe Zhou profile pages under `/about/`
- B2B inquiry form at `/quote/` and contact page at `/contact/`
- Privacy, terms, custom 404, `robots.txt`, and `sitemap.xml`

Legacy service, destination, resource, author, and inquiry URLs are retained as
permanent redirects in `next.config.mjs`.

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

The homepage quote form, `/quote/`, `/contact/`, and article inquiry forms submit directly to FormSubmit and deliver inquiries to `zoe@gdlogi.com`.

- The first live submission triggers a FormSubmit activation email. Open it in `zoe@gdlogi.com` and activate the form before testing delivery.
- FormSubmit's default CAPTCHA remains enabled for spam protection.
- Successful submissions redirect to `/thank-you/`.
- Forms include native validation, an accessible status region, consent text, a honeypot, and duplicate-submit protection.
- FormSubmit activation and live inbox receipt must be verified by the site owner before launch; no real submission is sent during automated QA.

## Launch readiness

The codebase intentionally keeps unverified certificates, shipment outcomes,
the detailed Shenzhen office address, and final legal details unpublished.
Review `artifacts/launch-readiness-checklist.md` before any production release.
