# Good Logistics Co., Ltd. Website

This repository contains the Good Logistics Co., Ltd. B2B logistics website for China-to-USA shipping services.

## Included Pages

- Homepage rendered at `/`
- SEO resource hub at `/good-shipping-homepage/resources/index.html`
- Long-form article pages under `/good-shipping-homepage/blog/`
- Zoe Zhou author profile at `/good-shipping-homepage/author/zoe-zhou/index.html`
- B2B inquiry form at `/good-shipping-inquiry-form.html`
- `robots.txt` and `sitemap.xml`

## Tech Stack

- Next.js App Router
- Static HTML resources served from `public/`
- Homepage content loaded from `content/good-shipping-homepage-preview.html`

## Local Commands

```bash
npm install
npm run dev
npm run build
```

## Inquiry delivery

The homepage quote form and `/good-shipping-inquiry-form.html` submit directly to FormSubmit and deliver inquiries to `zoe@gdlogi.com`.

- The first live submission triggers a FormSubmit activation email. Open it in `zoe@gdlogi.com` and activate the form before testing delivery.
- FormSubmit's default CAPTCHA remains enabled for spam protection.
- Successful submissions redirect to `/thank-you.html`.
- The detailed form keeps its existing front-end validation and FormSubmit honeypot field.
