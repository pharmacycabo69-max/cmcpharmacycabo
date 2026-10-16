# CMC Pharmacy Cabo

Next.js 16 (App Router, Tailwind 4) rebuild of https://cmcpharmacycabo.com, generated from a scrape of the WordPress/WooCommerce site.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Deploy

Import the repo in Vercel (framework preset: Next.js). No env vars required; optionally set `NEXT_PUBLIC_SITE_URL` to the production domain (used for sitemap/canonical URLs).

## Layout

- `content/pages.json` – 109 pages/posts extracted from the old site (`scripts/extract-pages.mjs`)
- `data/products/` – 4,827 products: `index.json` (listing/search), `items/<id>.json` (detail), `categories.slim.json` (`scripts/build-products.mjs`)
- `public/wp-content/uploads/` – images referenced by the pages (`scripts/copy-assets.mjs`)
- `site/` – raw static mirror of the original site (reference only, not used at runtime)

Product images are still loaded from cmcpharmacycabo.com. If that domain stops serving WordPress, download them first.
There is no cart/checkout: products are ordered via WhatsApp/phone.
