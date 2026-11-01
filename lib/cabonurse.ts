// CaboNurse (IV therapy, nurse comes to you). Prices match cabonurse.com. This file is the single source
// of truth: the booking wizard displays it and /api/cabonurse/checkout re-reads it server-side.
export type NurseService = { id: string; name: string; description: string; priceUsd: number; duration: string };

export const NURSE_SERVICES: NurseService[] = [
  { id: "hydration", name: "Hydration", description: "Fluids and electrolytes to rehydrate after sun, travel or a long night.", priceUsd: 129, duration: "45–60 min" },
  { id: "hydration-vitamins", name: "Hydration + Vitamins", description: "Hydration drip with a vitamin and mineral boost.", priceUsd: 149, duration: "45–60 min" },
  { id: "recovery", name: "Recovery", description: "Hydration with anti-nausea and pain-relief support to bounce back fast.", priceUsd: 159, duration: "45–60 min" },
  { id: "immunity", name: "Immunity", description: "High-dose vitamin C and zinc to support your defenses while traveling.", priceUsd: 159, duration: "45–60 min" },
  { id: "athletic-recovery", name: "Athletic recovery", description: "Rehydration and amino acids after sport, golf or fishing days.", priceUsd: 179, duration: "45–60 min" },
];

export const getNurseService = (id: string) => NURSE_SERVICES.find((s) => s.id === id);

export const NURSE = {
  whatsapp: "5216242261023", // CaboNurse team number
  phoneDisplay: "+52 (624) 226 1023",
  timezone: "America/Mazatlan", // Cabo time
  hours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], // first-visit start hours (9 AM – 9 PM)
  maxDays: 90,
  depositRate: 0.5,
};
