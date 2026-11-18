# CMC Pharmacy Cabo

Next.js 16 (App Router, Tailwind 4) rebuild of https://cmcpharmacycabo.com, generated from a scrape of the WordPress/WooCommerce site.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Deploy

Import the repo in Vercel (framework preset: Next.js). Set `NEXT_PUBLIC_SITE_URL=https://www.cmcpharmacycabo.com` (must match the primary domain in Vercel — it drives canonicals, sitemap and robots). Optional: `NEXT_PUBLIC_GA_ID` (GA4, tracks `whatsapp_click` / `phone_click` / `email_click`) and `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Search Console meta tag).

## Layout

- `content/pages.json` – 109 pages/posts extracted from the old site (`scripts/extract-pages.mjs`)
- `data/products/` – 4,827 products: `index.json` (listing/search), `items/<id>.json` (detail), `categories.slim.json` (`scripts/build-products.mjs`)
- `public/wp-content/uploads/` – images referenced by the pages (`scripts/copy-assets.mjs`)
- `site/` – raw static mirror of the original site (reference only, not used at runtime)

Product images are still loaded from cmcpharmacycabo.com. If that domain stops serving WordPress, download them first.
There is no cart/checkout: products are ordered via WhatsApp/phone.
