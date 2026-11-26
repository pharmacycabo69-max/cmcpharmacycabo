import { IV_DRIPS } from "@/lib/ivtherapy";
import { MEDICAL_PRICES } from "@/lib/team";

/**
 * Bookable services: one registry for the booking flow (/book), the payment page (/pay/[id]) and the checkout API.
 * To add a service (e.g. a confirmed lab package), add an entry here; nothing else needs to change.
 *
 * Payment policy (owner + V4 §8): nothing is charged when the request is sent. The team confirms availability on
 * WhatsApp and then sends the /pay link. Services provided by external partners (lab, imaging) are quoted and
 * validated first; they have no online price here, so they can never be charged by the checkout.
 * Prices in USD, taxes included.
 */
export type Mode = "video" | "clinic" | "hotel";
export type PayPolicy = "online_after_confirmation" | "quote";
export type BookOption = { id: string; name: string; price: number; note?: string };
export type Bookable = {
  id: string;
  name: string;
  group: "Doctor" | "IV therapy" | "Tests" | "Aesthetics";
  summary: string;
  duration: string;
  modes: Mode[];
  /** Price for the base service; options (e.g. IV drips) can override it. null = quote. */
  price: number | null;
  options?: BookOption[];
  pay: PayPolicy;
  /** Share paid online once availability is confirmed (1 = full price). */
  payNow: number;
  provider: "own" | "partner";
  page: string;
};

const ivOptions = IV_DRIPS.filter((d) => d.id !== "nad-performance").map((d) => ({ id: d.id, name: d.name, price: d.priceUsd, note: d.tagline }));
const nad = IV_DRIPS.find((d) => d.id === "nad-performance");

export const BOOKABLE: Bookable[] = [
  { id: "video", name: "Video consultation", group: "Doctor", summary: "An English-speaking doctor by video, wherever you are staying.", duration: "About 25 min", modes: ["video"], price: MEDICAL_PRICES.video, pay: "online_after_confirmation", payNow: 1, provider: "own", page: "/doctor-consultation" },
  { id: "walk-in", name: "Walk-in consultation", group: "Doctor", summary: "See a doctor at our clinic in Centro, Cabo San Lucas.", duration: "About 30 min", modes: ["clinic"], price: MEDICAL_PRICES.clinic, pay: "online_after_confirmation", payNow: 1, provider: "own", page: "/doctor-consultation" },
  { id: "home-doctor", name: "Home doctor", group: "Doctor", summary: "A doctor visits your hotel, villa or home.", duration: "About 45 min", modes: ["hotel"], price: MEDICAL_PRICES.hotel, pay: "online_after_confirmation", payNow: 1, provider: "own", page: "/hotel-doctor-cabo" },
  { id: "iv-therapy", name: "IV therapy", group: "IV therapy", summary: "IV therapy at your hotel or villa after a medical assessment.", duration: "45–60 min", modes: ["hotel", "clinic"], price: 159, options: ivOptions, pay: "online_after_confirmation", payNow: 1, provider: "own", page: "/iv-therapy" },
  ...(nad ? [{ id: "nad", name: "NAD+ therapy", group: "IV therapy" as const, summary: "NAD+ infusion with hydration, after a medical assessment.", duration: nad.duration, modes: ["hotel", "clinic"] as Mode[], price: nad.priceUsd, pay: "online_after_confirmation" as const, payNow: 1, provider: "own" as const, page: "/iv-therapy" }] : []),
  { id: "lab", name: "Laboratory tests", group: "Tests", summary: "Blood, urine and stool tests coordinated by our doctors with a partner laboratory.", duration: "Quote first", modes: ["clinic", "hotel"], price: null, pay: "quote", payNow: 0, provider: "partner", page: "/lab-tests-imaging" },
  { id: "imaging", name: "X-ray", group: "Tests", summary: "X-ray studies with a partner imaging center; mobile X-ray only when confirmed for your case.", duration: "Quote first", modes: ["clinic", "hotel"], price: null, pay: "quote", payNow: 0, provider: "partner", page: "/x-ray-cabo" },
  { id: "nursing", name: "Nursing care", group: "Tests", summary: "Nursing care at your hotel, villa or home, quoted after we review what you need.", duration: "Quote first", modes: ["hotel"], price: null, pay: "quote", payNow: 0, provider: "own", page: "/nursing-cabo" },
  { id: "aesthetics", name: "Aesthetic medicine assessment", group: "Aesthetics", summary: "Lip fillers, botulinum toxin, rejuvenation and skin brightening, after an assessment.", duration: "Assessment first", modes: ["clinic"], price: null, pay: "quote", payNow: 0, provider: "own", page: "/aesthetic-medicine" },
];

export const getBookable = (id: string) => BOOKABLE.find((b) => b.id === id);
export const priceOf = (b: Bookable, optionId?: string) => (optionId && b.options?.find((o) => o.id === optionId)?.price) || b.price;
export const MODE_LABEL: Record<Mode, string> = { video: "Video call", clinic: "At the clinic", hotel: "At your hotel or villa" };
/** Payment links are valid for booking references created by the booking flow. */
export const REF_RE = /^CMC-(B-)?\d{6}-[A-Z2-9]{4}$/;
