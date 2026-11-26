@AGENTS.md

# CMC Pharmacy Cabo — rules for agents

This repository is **public**. Never commit secrets, team records, license numbers of individuals (except the
physician profile the owner published), internal costs/margins, patient or insurance data, competitor research or
business strategy. Those live outside the repo.

## Business facts (owner V5, 26 Nov 2026 — supersedes earlier values)
- Brand: CMC Pharmacy Cabo is the digital pharmacy, medical and concierge platform of the **RMC Pharmacy** company.
  The 5 stores in `content/locations.json` are RMC Pharmacy stores (label them as such, not as CMC branches).
- **Delivery 8:00 am – 11:30 pm every day; digital requests received 24/7.** Stores 8:00–18:00. Never advertise
  24/7 delivery, "any hour", overnight or immediate availability. Single source: `SITE.deliveryHours`.
- **Free delivery from $99** (`SITE.freeDeliveryFrom`); below that the fee is confirmed before payment, never invented.
- **Medical prices (USD, taxes included, `lib/team.ts` + `lib/booking.ts`):** video $59, walk-in (Cabo Walk-In Clinic,
  9:00–17:00 daily; otherwise by appointment) $99, home doctor $189, IV $159, Total Wellness IV $189, NAD+ $279.
  Lab, X-ray and nursing: quote and confirmation first. Aesthetics: authorized prices or quote.
- **Payment:** 100 % online only after availability is confirmed, via signed links from the concierge. No deposits.
  Pharmacy products are never charged automatically or online. Telemedicine stays blocked for Stripe until written
  approval (`STRIPE_APPROVED_RESTRICTED`). `PAYMENTS_ENABLED=true` only after the cancellation policy is approved.
- No ultrasound (not confirmed). IV ingredient lists hidden until verified (`INGREDIENTS_VERIFIED`). Group IV
  discounts unpublished. High-dose vitamin C, iron and custom drips not sold.
- **Main WhatsApp (bot): +52 624 226 1023** → `SITE.whatsapp`. Call line kept: +52 624 267 3177.
- International insurance (US & Canada) **subject to verification** (`INSURANCE` in `lib/site.ts`). Never promise
  coverage or direct billing; never collect policy documents through the website. Emergencies → **911**.

## Platform architecture (V5)
- `lib/server/store.ts` (Redis REST: KV_REST_API_URL/TOKEN), `records.ts` (folios CMC-P-/CMC-B-, event log),
  `notify.ts` (CRM webhook + email + internal WhatsApp, dedupe, outbox, retries), `auth.ts` (concierge roles),
  `paylink.ts` (HMAC links with expiry). Public APIs save **before** confirming; if storage fails they return 503.
- Payments: `/api/pay/checkout` (amount from the record, idempotency per link, no duplicate charges) and
  `/api/stripe-webhook` (the only place that marks paid/failed/expired/refunded). Metadata: folio only.
- Notifications to email/WhatsApp carry folio, type, status, amount and a link; full data only in CRM/concierge.

## Do not publish without owner approval
- Production deploys, price changes, new IV formulas, payment/checkout changes, cancellation policy.
- COFEPRIS/LegitScript seals, ratings (`SITE.rating` stays `null`), testimonials, delivery times.
- Clinical content without a named reviewing physician.

## Medical team visibility
The aesthetic-medicine lead may only be named inside the aesthetics section (name only). Do not publish any other
professional's license, university, photo, biography or sanitary role unless the owner authorizes it for this brand.

## Privacy
No health data, searches, products or personal data to GA4/Ads/Meta or payment metadata (`components/Analytics.tsx`
sends clean paths only). robots/noindex are not security: private routes require session, signature or key.

## Prescription medicines
`isRx()` / `isControlled()` in `lib/products.ts`: Rx items require a prescription answer; controlled medicines are
never requested online. Do not add restricted-medicine keywords to ads.

## Workflow
- Work on a branch, push it, let Vercel build the preview; merge to `main` only with the owner's explicit OK.
- The local index cannot hold some WordPress mirror paths with `?` (Windows): commit with plumbing
  (hash-object/mktree/commit-tree) touching only the intended files; never `git add -A`/`commit -a`.
- Imported page copy is rewritten at load time in `lib/content.ts` (`deClaim`) — edit rules there, not the JSON.
