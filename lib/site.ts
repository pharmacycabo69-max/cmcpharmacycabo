/**
 * Public business data. Source of truth: docs/BUSINESS_MASTER_DATA.json (Prompt Maestro V3.1, 24 Nov 2026).
 * Only owner-confirmed facts belong here; anything pending lives in docs/PENDING_BUSINESS_DATA.md.
 */
export const SITE = {
  name: "CMC Pharmacy Cabo",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cmcpharmacycabo.com").replace(/\/$/, ""),
  /** Phone line kept as before (alternative number per master data). */
  phone: "+52 624 267 3177",
  tel: "tel:+526242673177",
  /** Main WhatsApp, the only number connected to the bot (master data §2). */
  whatsapp: "https://wa.me/5216242261023",
  whatsappDisplay: "+52 624 226 1023",
  email: "support@cmcpharmacy.com",
  street: "Francisco I. Madero S/N, between Vicente Guerrero and Miguel Hidalgo, Centro",
  locality: "Cabo San Lucas",
  region: "Baja California Sur",
  postalCode: "23450",
  country: "MX",
  logo: "/apple-icon",
  /** Delivery hours confirmed by the owner. Do not advertise 24/7 or immediate availability. */
  deliveryHours: { opens: "07:00", closes: "23:00", label: "7:00 am – 11:00 pm, every day" },
  /** Free delivery threshold in USD (owner, 24 Nov 2026). Smaller orders: fee confirmed with the total. */
  freeDeliveryFrom: 59,
  tagline: "Pharmacy Delivery & English-Speaking Doctors in Los Cabos",
  description:
    "Pharmacy delivery in Cabo San Lucas & San José del Cabo, every day 7 am–11 pm. English-speaking pharmacists, prescription and OTC medicine to your hotel or villa, and doctor visits.",
  /** Google rating is not verified for this brand; keep null until the owner confirms the profile and figures. */
  rating: null as null | { value: number; count: number },
  /** CMC is the delivery & concierge service of RMC Pharmacy, which runs the stores in /locations. */
  parent: "RMC Pharmacy",
};

/** International insurance policy (master data §2.1). Copy approved by the owner; never promise coverage. */
export const INSURANCE = {
  title: "International Health & Travel Insurance Accepted — Subject to Verification",
  body: "We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation. Contact our team to verify your eligibility and payment arrangements before receiving medical services.",
  cta: "Verify My Insurance",
  /** Generic first message: no symptoms, policy numbers or documents in the URL. */
  href: `https://wa.me/5216242261023?text=${encodeURIComponent("Hi! I'd like to verify my international insurance before a medical service.")}`,
};

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/price-list", label: "Prices" },
  { href: "/locations", label: "Locations" },
  { href: "/delivery-areas", label: "Delivery areas" },
  { href: "/doctor-consultation", label: "Doctors" },
  { href: "/iv-therapy", label: "IV therapy" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export const abs = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;
