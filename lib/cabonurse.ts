// CaboNurse services. PLACEHOLDER PRICES — edit before going live.
export type NurseService = { id: string; name: string; description: string; priceUsd: number; duration: string };

export const NURSE_SERVICES: NurseService[] = [
  { id: "visit", name: "Nurse home visit", description: "Vitals check, assessment and basic care at your hotel or villa.", priceUsd: 90, duration: "45 min" },
  { id: "injection", name: "Injection administration", description: "Intramuscular or subcutaneous injection with your prescribed medication.", priceUsd: 70, duration: "30 min" },
  { id: "wound", name: "Wound care & dressing", description: "Cleaning, dressing and follow-up advice for minor wounds or burns.", priceUsd: 110, duration: "45 min" },
  { id: "iv", name: "IV hydration with nurse", description: "Rehydration drip administered by a licensed nurse.", priceUsd: 160, duration: "60 min" },
];

export const getNurseService = (id: string) => NURSE_SERVICES.find((s) => s.id === id);
