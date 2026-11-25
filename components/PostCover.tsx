import type { ReactNode } from "react";
import { IconBuilding, IconDoctor, IconDrip, IconPill, IconStar } from "@/components/Icons";

type Theme = { re: RegExp; bg: string; fg: string; icon: (p: { className?: string }) => ReactNode };

/** Branded cover for articles without a photo: color and icon follow the topic found in the slug. */
const THEMES: Theme[] = [
  { re: /sun|burn|skin|beach|medano|sunscreen/i, bg: "from-amber-100 to-orange-200", fg: "text-amber-700", icon: IconStar },
  { re: /stomach|diarrhea|digest|hangover|hydrat|motion/i, bg: "from-emerald-100 to-teal-200", fg: "text-emerald-700", icon: IconDrip },
  { re: /allerg|antihist|pollen|insect|bug|bite/i, bg: "from-violet-100 to-fuchsia-200", fg: "text-violet-700", icon: IconPill },
  { re: /pain|headache|first-aid|emergency|doctor/i, bg: "from-rose-100 to-red-200", fg: "text-rose-700", icon: IconDoctor },
  { re: /antibiotic|prescription|refill|ozempic|medication|otc|vitamin/i, bg: "from-sky-100 to-blue-200", fg: "text-sky-700", icon: IconPill },
  { re: /hotel|resort|near|delivery|tourist|travel|pharmacy/i, bg: "from-teal-100 to-cyan-200", fg: "text-teal-700", icon: IconBuilding },
];

export function PostCover({ slug, className = "h-full w-full" }: { slug: string; className?: string }) {
  const t = THEMES.find((x) => x.re.test(slug)) ?? THEMES[THEMES.length - 1];
  const Icon = t.icon;
  return (
    <div aria-hidden className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${t.bg} ${className}`}>
      <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40" />
      <span className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/30" />
      <span className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm ${t.fg}`}><Icon className="h-8 w-8" /></span>
    </div>
  );
}
