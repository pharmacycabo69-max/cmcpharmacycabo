/**
 * Publicly approved team data for this brand. Published on the owner's explicit instruction (24 Nov 2026),
 * data from the master document §3. Do not add other professionals or fields (license numbers, universities,
 * photos) without the owner's authorization for this brand (visibility rule §3.1).
 */
export const DOCTOR = {
  name: "Dr. Kevin González Adame",
  degree: "Médico Cirujano y Partero (Physician and Surgeon)",
  school: "Instituto Politécnico Nacional (IPN)",
  license: "14796516",
  languages: ["English", "Spanish"],
  clinic: "Cabo Walk-In Clinic",
  photo: "/team/dr-kevin-gonzalez-adame.jpg",
};

/** Confirmed service prices in USD, taxes included (master data §2, D12, D17). */
export const MEDICAL_PRICES = { video: 59, clinic: 99, hotel: 189 } as const;
