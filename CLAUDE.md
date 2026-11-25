@AGENTS.md

# CMC Pharmacy Cabo — rules for agents

This repository is **public**. Never commit team records, license numbers of individuals, internal costs/margins,
patient or insurance data, competitor research or business strategy. Those live outside the repo.

## Business facts (owner-confirmed, Prompt Maestro V3.1, 24 Nov 2026)
- Brand: CMC Pharmacy Cabo is the delivery & concierge service of **RMC Pharmacy** (5 stores, `content/locations.json`).
- **Delivery hours: 7:00 am – 11:00 pm every day** (owner, 24 Nov 2026). Stores: 8:00–18:00 every day.
  Never advertise 24/7, "any hour", overnight or immediate availability.
- **Free delivery on orders of $59+** (`SITE.freeDeliveryFrom`); smaller orders: fee confirmed with the total.
- **IV therapy (USD, taxes included):** at hotel/villa $159, Multivitamin $189, NAD+ $279; in clinic $129 /
  Multivitamin $154 / NAD+ $279; groups of 3+ $139 per person. **50% deposit** via Stripe. High-dose vitamin C,
  iron and custom drips are not sold until medically validated (`lib/ivtherapy.ts`).
- Clinic visits by appointment (clinic 9:00–17:00). Not an emergency service: always point emergencies to **911**.
- **Main WhatsApp (bot): +52 624 226 1023** → `SITE.whatsapp`. Call line kept: +52 624 267 3177.
- International insurance (US & Canada) accepted **subject to verification**: use `INSURANCE` in `lib/site.ts` /
  `components/InsuranceNotice.tsx`. Never promise coverage, direct billing or reimbursement; never accept Mexican
  national insurance; never collect policy documents through the website.

## Do not publish without owner approval
- Any price change, new IV formula or checkout change (`lib/ivtherapy.ts`, Stripe).
- COFEPRIS/LegitScript seals, Google ratings (`SITE.rating` stays `null`), testimonials, delivery times.
- Clinical content without a named reviewing physician.

## Medical team visibility (master data §3.1)
The aesthetic-medicine lead may only be named (name only) inside an aesthetics section on this brand. Never publish
any professional's license number, university, detailed title, photo, biography or sanitary role on this site
(HTML, JSON-LD, metadata, feeds, bot texts) unless the owner's private MEDICAL_TEAM file allows it for this brand.
Team records live outside this public repository; do not copy them here.

## Prescription medicines
`isRx()` / `isControlled()` in `lib/products.ts` gate ordering: Rx products ask for a prescription on WhatsApp and
link to `/doctor-consultation`. Do not add restricted-medicine keywords to ads.

## Workflow
- Work on a branch, push it, let Vercel build the preview; merge to `main` only with the owner's explicit OK.
- The local index cannot hold some WordPress mirror paths with `?` (Windows): commit with plumbing
  (hash-object/mktree/commit-tree) touching only the intended files; never `git add -A`/`commit -a`.
- Imported page copy is rewritten at load time in `lib/content.ts` (`deClaim`) — edit rules there, not the JSON.
