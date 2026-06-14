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

## Notes

The inquiry form HTML includes front-end validation and demo submission feedback. To send real inquiries to email or a database, connect the example API handler in `examples/next-api-inquiries-example.js` to your preferred email service, CRM, or database.
