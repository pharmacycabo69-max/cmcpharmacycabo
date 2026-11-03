import data from "@/content/locations.json";
import type { Hours } from "@/lib/hours";

export type Photo = { src: string; width: number; height: number; alt: string };
export type Location = {
  slug: string;
  /** Exact Google Business Profile name. Used verbatim in the H1, title and schema. */
  gbpName: string;
  brand: string;
  neighborhood: string;
  placeLabel: string;
  addressLine: string;
  postalCode: string;
  city: string;
  region: string;
  phone: string;
  hours: Hours;
  geo: { lat: number; lng: number };
  mapsUrl: string;
  reviewUrl: string | null;
  delivers: boolean;
  /** Data the owner still has to confirm (see README). */
  needsReview: boolean;
  photos: Photo[];
  intro: string; // paragraphs separated by a blank line
  faq: { q: string; a: string }[];
};

export const LOCATIONS = data as Location[];
export const getLocation = (slug: string) => LOCATIONS.find((l) => l.slug === slug);
export const fullAddress = (l: Location) => `${l.addressLine}, ${l.neighborhood}, ${l.postalCode} ${l.city}, ${l.region}`;
export const telHref = (l: Location) => `tel:${l.phone.replace(/[^\d+]/g, "")}`;
export const waHref = (l: Location) =>
  `https://wa.me/${l.phone.replace(/\D/g, "").replace(/^52(?!1)/, "521")}?text=${encodeURIComponent(`Hi! I'm near ${l.gbpName} (${l.neighborhood}).`)}`;
export const locationTitle = (l: Location) => `${l.gbpName} – ${l.placeLabel}, Cabo San Lucas | Pharmacy${l.delivers ? " & Delivery" : ""}`;
