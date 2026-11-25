import { SITE } from "@/lib/site";
import { MEDICAL_PRICES } from "@/lib/team";

/**
 * Service inventory (V4 §7.1). Only "available" services are shown on the site, in search and in menus.
 * The others stay here, off public routes, until the owner confirms them (see docs/PENDING_APPROVALS.md).
 * "own" = provided by the network; "coordinated" = arranged with an external provider.
 */
export type ServiceStatus = "draft" | "pending_verification" | "confirmed" | "available" | "temporarily_unavailable" | "discontinued";
export type Service = {
  id: string; name: string; short: string; href: string; price: string; status: ServiceStatus;
  delivery: "own" | "coordinated"; group: "pharmacy" | "doctor" | "iv" | "tests" | "aesthetic" | "concierge"; keywords: string;
};

export const SERVICES: Service[] = [
  { id: "pharmacy-delivery", name: "Pharmacy delivery to your hotel", short: `Prescription and OTC medicine to your room, ${SITE.deliveryHours.label}.`, href: "/24-7-pharmacy-delivery-cabo-san-lucas", price: `Free from $${SITE.freeDeliveryFrom}`, status: "available", delivery: "own", group: "pharmacy", keywords: "pharmacy delivery medicine medication hotel villa farmacia domicilio" },
  { id: "prescriptions", name: "Prescriptions in Mexico", short: "What needs a prescription and how to get one from our doctors.", href: "/prescription-requirements", price: "Guide", status: "available", delivery: "own", group: "pharmacy", keywords: "prescription rx antibiotic receta refill" },
  { id: "video-consult", name: "Video consultation", short: "An English-speaking doctor by video, from your room.", href: "/doctor-consultation", price: `$${MEDICAL_PRICES.video}`, status: "available", delivery: "own", group: "doctor", keywords: "doctor video telemedicine online consultation medico" },
  { id: "clinic-visit", name: "Clinic visit", short: "See a doctor at our clinic in Centro, by appointment.", href: "/doctor-consultation", price: `$${MEDICAL_PRICES.clinic}`, status: "available", delivery: "own", group: "doctor", keywords: "doctor clinic walk-in consulta clinica" },
  { id: "hotel-doctor", name: "Doctor at your hotel or villa", short: "A doctor comes to you in Cabo, San José and the Corridor.", href: "/hotel-doctor-cabo", price: `$${MEDICAL_PRICES.hotel}`, status: "available", delivery: "own", group: "doctor", keywords: "hotel doctor house call villa home visit medico a domicilio" },
  { id: "iv-therapy", name: "IV therapy", short: "IV therapy at your hotel or villa after a medical assessment.", href: "/iv-therapy", price: "From $159", status: "available", delivery: "own", group: "iv", keywords: "iv drip hydration hangover myers nad suero vitaminas" },
  { id: "lab-tests", name: "Lab tests", short: "Blood, urine and stool tests coordinated by our medical team.", href: "/lab-tests-imaging", price: "Quote", status: "available", delivery: "coordinated", group: "tests", keywords: "lab test blood work analisis laboratorio" },
  { id: "imaging", name: "X-ray & ultrasound", short: "Imaging studies coordinated with partner centers.", href: "/lab-tests-imaging", price: "Quote", status: "available", delivery: "coordinated", group: "tests", keywords: "x-ray xray ultrasound imaging rayos x ultrasonido radiologia" },
  { id: "aesthetics", name: "Aesthetic medicine", short: "Lip fillers, botulinum toxin, rejuvenation and skin brightening.", href: "/aesthetic-medicine", price: "From $170", status: "available", delivery: "own", group: "aesthetic", keywords: "botox lip filler aesthetic skin brightening rejuvenation estetica" },
  { id: "insurance", name: "International insurance", short: "US and Canadian policies, subject to verification.", href: "/international-insurance", price: "Verification", status: "available", delivery: "own", group: "concierge", keywords: "insurance travel insurance seguro poliza" },
  { id: "concierge", name: "For hotels & concierges", short: "One contact for your guests' pharmacy and medical needs.", href: "/for-concierges", price: "B2B", status: "available", delivery: "own", group: "concierge", keywords: "concierge hotel partner b2b villa yacht group" },
  // Not public until confirmed (V4 §7.1): listed here so the inventory is complete
  { id: "nursing", name: "Private nursing", short: "", href: "", price: "", status: "pending_verification", delivery: "own", group: "concierge", keywords: "" },
  { id: "travel-wellness-panel", name: "Travel Wellness Panel", short: "", href: "", price: "", status: "pending_verification", delivery: "coordinated", group: "tests", keywords: "" },
];

export const publicServices = () => SERVICES.filter((s) => s.status === "available");
export function searchServices(q: string) {
  const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  return publicServices().filter((s) => words.some((w) => `${s.name} ${s.keywords}`.toLowerCase().includes(w)));
}
