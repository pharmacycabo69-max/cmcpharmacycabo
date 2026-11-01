export const SITE = {
  name: "CMC Pharmacy Cabo",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cmcpharmacycabo.com").replace(/\/$/, ""),
  phone: "+52 624 267 3177",
  tel: "tel:+526242673177",
  whatsapp: "https://wa.me/5216242673177",
  email: "support@cmcpharmacy.com",
  street: "Francisco I Madero, Centro",
  locality: "Cabo San Lucas",
  region: "Baja California Sur",
  postalCode: "23450",
  country: "MX",
  logo: "/apple-icon",
  tagline: "24/7 Pharmacy Delivery & English-Speaking Doctors in Los Cabos",
  description:
    "24/7 pharmacy in Cabo San Lucas & San José del Cabo. English-speaking pharmacists, prescription and OTC delivery to your hotel or villa, and doctors on call.",
  rating: { value: 5.0, count: 89 },
};

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/delivery-areas", label: "Delivery areas" },
  { href: "/doctor-consultation", label: "Doctors" },
  { href: "/cabonurse", label: "CaboNurse" },
  { href: "/iv-therapy", label: "IV therapy" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export const abs = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;
