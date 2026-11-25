import type { ReactNode } from "react";

/**
 * Branded cover for articles without a photo. The topic (color, glyph and label) comes from the slug, and the
 * gradient angle and background pattern come from a hash of the slug, so two articles on the same topic still
 * look different. Decorative: aria-hidden (the card carries the title).
 */
type Topic = { re: RegExp; label: string; from: string; to: string; ink: string; glyph: ReactNode };

const S = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TOPICS: Topic[] = [
  { re: /sunscreen|sunburn|sun-|beach|medano/i, label: "Sun care", from: "#fef3c7", to: "#fdba74", ink: "#b45309",
    glyph: <g {...S}><circle cx="24" cy="24" r="8" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1="24" y1="8" x2="24" y2="12" transform={`rotate(${a} 24 24)`} />)}</g> },
  { re: /stomach|diarrhea|digest|travelers-d/i, label: "Stomach & digestion", from: "#d1fae5", to: "#6ee7b7", ink: "#047857",
    glyph: <g {...S}><path d="M18 8c0 6 10 4 14 10s0 16-10 18-14-6-12-14c1-5 8-6 8-14Z" /></g> },
  { re: /hangover|hydrat|electrolyte/i, label: "Hydration", from: "#cffafe", to: "#67e8f9", ink: "#0e7490",
    glyph: <g {...S}><path d="M24 6s12 12 12 22a12 12 0 0 1-24 0C12 18 24 6 24 6Z" /><path d="M18 30a6 6 0 0 0 5 5" /></g> },
  { re: /allerg|antihist|pollen|hay-fever/i, label: "Allergies", from: "#ede9fe", to: "#c4b5fd", ink: "#6d28d9",
    glyph: <g {...S}><circle cx="24" cy="24" r="4" />{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx="24" cy="12" r="5" transform={`rotate(${a} 24 24)`} />)}</g> },
  { re: /insect|bug|bite|mosquito|repellent/i, label: "Bites & repellent", from: "#ecfccb", to: "#bef264", ink: "#4d7c0f",
    glyph: <g {...S}><ellipse cx="24" cy="26" rx="8" ry="11" /><path d="M24 15v22M16 22l-7-4M32 22l7-4M16 30l-7 4M32 30l7 4M20 15l-3-6M28 15l3-6" /></g> },
  { re: /pain|headache|migraine|muscle/i, label: "Pain relief", from: "#ffe4e6", to: "#fda4af", ink: "#be123c",
    glyph: <g {...S}><path d="M27 6 14 26h9l-3 16 14-22h-9Z" /></g> },
  { re: /first-aid|emergency|wound|kit/i, label: "First aid", from: "#fee2e2", to: "#fca5a5", ink: "#b91c1c",
    glyph: <g {...S}><rect x="8" y="14" width="32" height="24" rx="5" /><path d="M18 14v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3M24 21v10M19 26h10" /></g> },
  { re: /ozempic|weight|semaglut/i, label: "Weight-loss medicines", from: "#fae8ff", to: "#f0abfc", ink: "#a21caf",
    glyph: <g {...S}><path d="M10 38 30 18M26 14l8 8M32 8l8 8M8 40l4-1-3-3Z" /></g> },
  { re: /antibiotic|prescription|refill|rx/i, label: "Prescriptions", from: "#e0f2fe", to: "#7dd3fc", ink: "#0369a1",
    glyph: <g {...S}><rect x="6" y="18" width="36" height="14" rx="7" transform="rotate(-35 24 25)" /><path d="m17 17 14 14" /></g> },
  { re: /vitamin|supplement|wellness|natural|remed/i, label: "Vitamins & wellness", from: "#dcfce7", to: "#86efac", ink: "#15803d",
    glyph: <g {...S}><path d="M10 38C10 20 22 10 40 10c0 18-10 30-28 30" /><path d="M10 38 26 22" /></g> },
  { re: /skin|care-products|cosmetic/i, label: "Skin care", from: "#fce7f3", to: "#f9a8d4", ink: "#be185d",
    glyph: <g {...S}><circle cx="24" cy="24" r="14" /><path d="M18 22h0M30 22h0M18 30c4 4 8 4 12 0" /></g> },
  { re: /motion|sea|boat/i, label: "Motion sickness", from: "#dbeafe", to: "#93c5fd", ink: "#1d4ed8",
    glyph: <g {...S}><path d="M6 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0M24 8v14M24 8l10 10H24" /></g> },
  { re: /child|kid|pediatric|baby/i, label: "Kids' health", from: "#fef9c3", to: "#fde047", ink: "#a16207",
    glyph: <g {...S}><circle cx="24" cy="24" r="14" /><path d="M18 21h0M30 21h0M18 29c3 3 9 3 12 0" /></g> },
  { re: /san-jose|jose-del-cabo/i, label: "San José del Cabo", from: "#ccfbf1", to: "#5eead4", ink: "#0f766e",
    glyph: <g {...S}><path d="M24 40S10 28 10 19a14 14 0 0 1 28 0c0 9-14 21-14 21Z" /><circle cx="24" cy="19" r="5" /></g> },
  { re: /hotel|resort|concierge|villa/i, label: "Hotel delivery", from: "#e0e7ff", to: "#a5b4fc", ink: "#4338ca",
    glyph: <g {...S}><rect x="10" y="8" width="28" height="32" rx="3" /><path d="M16 16h4M28 16h4M16 24h4M28 24h4M21 40v-8h6v8" /></g> },
  { re: /travel|tourist|pack|tips|health/i, label: "Travel health", from: "#ccfbf1", to: "#5eead4", ink: "#0f766e",
    glyph: <g {...S}><rect x="9" y="15" width="30" height="23" rx="4" /><path d="M18 15v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M9 25h30" /></g> },
  { re: /deliver|pharmacy|otc|medic/i, label: "Pharmacy delivery", from: "#d1fae5", to: "#34d399", ink: "#047857",
    glyph: <g {...S}><path d="M8 14 24 7l16 7v18l-16 9-16-9Z" /><path d="m8 14 16 8 16-8M24 22v19" /></g> },
];
const FALLBACK: Topic = TOPICS[TOPICS.length - 1];

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export function PostCover({ slug, className = "h-full w-full" }: { slug: string; className?: string }) {
  const t = TOPICS.find((x) => x.re.test(slug)) ?? FALLBACK;
  const h = hash(slug);
  const angle = (h % 24) * 15;
  const spot = `${20 + (h % 61)}% ${10 + ((h >> 5) % 71)}%`;
  const pattern = (h >> 3) % 4; // 0 dots, 1 diagonal lines, 2 rings, 3 grid
  const bg =
    pattern === 0 ? "radial-gradient(rgba(255,255,255,.55) 1.6px, transparent 1.7px) 0 0/18px 18px"
    : pattern === 1 ? "repeating-linear-gradient(45deg, rgba(255,255,255,.28) 0 2px, transparent 2px 14px)"
    : pattern === 2 ? `radial-gradient(circle at ${spot}, rgba(255,255,255,.55) 0 44px, transparent 45px), radial-gradient(circle at 10% 95%, rgba(255,255,255,.35) 0 54px, transparent 55px)`
    : "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px) 0 0/22px 22px, linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px) 0 0/22px 22px";
  return (
    <div aria-hidden className={`relative overflow-hidden ${className}`} style={{ backgroundImage: `${bg}, linear-gradient(${angle}deg, ${t.from}, ${t.to})`, color: t.ink }}>
      <svg viewBox="0 0 48 48" className="absolute -bottom-6 -right-6 h-44 w-44 opacity-[0.12]">{t.glyph}</svg>
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/85 shadow-sm"><svg viewBox="0 0 48 48" className="h-7 w-7">{t.glyph}</svg></span>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">{t.label}</span>
      </div>
    </div>
  );
}
