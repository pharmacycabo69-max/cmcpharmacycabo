/**
 * Original brand illustrations (SVG, no third-party assets). Decorative: aria-hidden; pages carry the text.
 * Palette: brand teal (#0f766e / #14b8a6 / #ccfbf1), rose for aesthetics, slate for imaging panels.
 */
type P = { className?: string };

/* ---------- Aesthetic medicine ---------- */

export function AestheticHero({ className = "w-full" }: P) {
  return (
    <svg viewBox="0 0 480 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ah-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff1f2" /><stop offset="1" stopColor="#ccfbf1" /></linearGradient>
        <linearGradient id="ah-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fde2d4" /><stop offset="1" stopColor="#f6c9b4" /></linearGradient>
        <radialGradient id="ah-glow" cx="0.5" cy="0.45" r="0.5"><stop offset="0" stopColor="#ffffff" stopOpacity="0.9" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="480" height="400" rx="36" fill="url(#ah-bg)" />
      <circle cx="250" cy="190" r="150" fill="url(#ah-glow)" />
      <circle cx="250" cy="190" r="128" fill="none" stroke="#14b8a6" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 10" />
      {/* face profile */}
      <path d="M210 92c46-18 104 4 116 58 6 26 2 44 10 60 6 12 20 18 14 30-5 9-18 8-20 16-2 7 6 13 2 21-4 8-16 6-18 14-3 13 4 30-8 40-14 12-52 8-74 4l-6 34h-82l10-70c-30-22-46-60-40-104 6-48 44-84 96-102Z" fill="url(#ah-skin)" />
      <path d="M318 214c6 2 12 1 18-2" stroke="#c2410c" strokeOpacity="0.35" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* lips */}
      <path d="M318 262c8-5 18-5 26 0-7 4-18 5-26 0Z" fill="#f43f5e" />
      <path d="M319 263c8 6 17 7 25 0" stroke="#be123c" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* eye & brow */}
      <path d="M292 168c8-6 18-6 26 0" stroke="#7c2d12" strokeOpacity="0.55" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M298 182c6 4 14 4 20 0" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* hair */}
      <path d="M200 96c40-30 108-26 132 16-30-8-62-6-86 8-22 12-34 36-34 66-24-20-34-62-12-90Z" fill="#1e293b" />
      {/* sparkles */}
      {[[110, 90, 1], [392, 120, 0.8], [400, 300, 1.1], [96, 300, 0.7], [360, 60, 0.6]].map(([x, y, s], i) => (
        <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0-16 4-4 16 0 4 4 0 16-4 4-16 0-4-4Z" fill={i % 2 ? "#14b8a6" : "#fb7185"} />
      ))}
      {/* glow dots on cheek */}
      <circle cx="292" cy="228" r="16" fill="#fda4af" fillOpacity="0.35" />
    </svg>
  );
}

export function LipsArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#fff1f2" />
      <path d="M52 74c22-26 44-30 68-14 24-16 46-12 68 14-22 30-46 42-68 42s-46-12-68-42Z" fill="#fb7185" />
      <path d="M52 74c22-26 44-30 68-14 24-16 46-12 68 14-24-6-46-4-68 6-22-10-44-12-68-6Z" fill="#f43f5e" />
      <path d="M52 74c26 6 46 8 68 8s42-2 68-8" stroke="#9f1239" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="104" cy="92" rx="16" ry="5" fill="#fff" fillOpacity="0.45" />
      <path d="M196 34 200 44 210 48 200 52 196 62 192 52 182 48 192 44Z" fill="#14b8a6" />
    </svg>
  );
}

export function SyringeArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#f0fdfa" />
      <g transform="rotate(-24 120 70)">
        <rect x="56" y="58" width="104" height="26" rx="6" fill="#fff" stroke="#0f766e" strokeWidth="3" />
        <rect x="60" y="62" width="62" height="18" rx="3" fill="#5eead4" fillOpacity="0.7" />
        {[76, 92, 108, 124, 140].map((x) => <line key={x} x1={x} y1="58" x2={x} y2="66" stroke="#0f766e" strokeWidth="2" />)}
        <rect x="160" y="64" width="10" height="14" rx="2" fill="#0f766e" />
        <line x1="170" y1="71" x2="206" y2="71" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="30" y="66" width="26" height="10" rx="2" fill="#0f766e" />
        <rect x="22" y="52" width="10" height="38" rx="3" fill="#0f766e" />
      </g>
      <circle cx="200" cy="32" r="6" fill="#5eead4" />
      <circle cx="214" cy="48" r="3.5" fill="#5eead4" />
    </svg>
  );
}

export function GlowArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <defs><radialGradient id="ga-g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fef3c7" /><stop offset="1" stopColor="#fef3c7" stopOpacity="0" /></radialGradient></defs>
      <rect x="-200" width="640" height="140" fill="#fffbeb" />
      <circle cx="120" cy="70" r="62" fill="url(#ga-g)" />
      <circle cx="120" cy="70" r="34" fill="#fde2d4" />
      <circle cx="108" cy="64" r="3.5" fill="#334155" />
      <circle cx="132" cy="64" r="3.5" fill="#334155" />
      <path d="M108 82c8 6 16 6 24 0" stroke="#e11d48" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="120" y1="22" x2="120" y2="12" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" transform={`rotate(${a} 120 70)`} />
      ))}
      <path d="M190 30 194 40 204 44 194 48 190 58 186 48 176 44 186 40Z" fill="#14b8a6" />
    </svg>
  );
}

export function RejuvenationArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#ecfeff" />
      <ellipse cx="120" cy="72" rx="40" ry="50" fill="#fde2d4" />
      <path d="M86 52c10-26 58-26 68 0-14-10-54-10-68 0Z" fill="#1e293b" />
      <circle cx="106" cy="70" r="3.5" fill="#334155" />
      <circle cx="134" cy="70" r="3.5" fill="#334155" />
      <path d="M110 96c6 4 14 4 20 0" stroke="#e11d48" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M78 86c-10-10-12-26-6-40M162 86c10-10 12-26 6-40" stroke="#14b8a6" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 7" />
      <path d="M60 40l6-6M60 40l-6-6M60 40v10" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 40l6-6M180 40l-6-6M180 40v10" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Lab & imaging ---------- */

export function LabHero({ className = "w-full" }: P) {
  return (
    <svg viewBox="0 0 480 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lh-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0fdfa" /><stop offset="1" stopColor="#e0f2fe" /></linearGradient>
      </defs>
      <rect width="480" height="400" rx="36" fill="url(#lh-bg)" />
      {/* x-ray panel */}
      <rect x="250" y="56" width="180" height="210" rx="18" fill="#0f172a" />
      <rect x="262" y="68" width="156" height="186" rx="10" fill="#1e293b" />
      <path d="M340 92v140" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} stroke="#cbd5e1" strokeOpacity="0.85" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d={`M334 ${110 + i * 20}c-22-4-42 2-54 ${14 + i * 2}`} />
          <path d={`M346 ${110 + i * 20}c22-4 42 2 54 ${14 + i * 2}`} />
        </g>
      ))}
      <ellipse cx="318" cy="188" rx="20" ry="34" fill="#e2e8f0" fillOpacity="0.12" />
      {/* tube rack */}
      <rect x="54" y="246" width="200" height="22" rx="6" fill="#0f766e" />
      <rect x="64" y="268" width="12" height="40" rx="3" fill="#0f766e" />
      <rect x="232" y="268" width="12" height="40" rx="3" fill="#0f766e" />
      {[["#ef4444", 150], ["#f59e0b", 120], ["#a855f7", 160], ["#14b8a6", 135], ["#3b82f6", 145]].map(([c, h], i) => (
        <g key={i}>
          <rect x={74 + i * 36} y={258 - (h as number)} width="22" height={h as number} rx="11" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
          <rect x={77 + i * 36} y={258 - (h as number) * 0.55} width="16" height={(h as number) * 0.55 - 4} rx="8" fill={c as string} fillOpacity="0.85" />
          <rect x={72 + i * 36} y={252 - (h as number)} width="26" height="12" rx="4" fill={c as string} />
        </g>
      ))}
      {/* blood drop */}
      <path d="M400 300c0 22-14 36-30 36s-30-14-30-36c0-18 18-38 30-54 12 16 30 36 30 54Z" fill="#ef4444" />
      <path d="M356 304c2 10 8 16 16 18" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M90 70 94 80 104 84 94 88 90 98 86 88 76 84 86 80Z" fill="#14b8a6" />
    </svg>
  );
}

export function XrayArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="160" fill="#0f172a" />
      <rect x="62" y="16" width="116" height="128" rx="10" fill="#1e293b" />
      <path d="M120 30v100" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} stroke="#cbd5e1" strokeOpacity="0.9" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d={`M115 ${42 + i * 18}c-16-3-30 2-38 ${10 + i * 2}`} />
          <path d={`M125 ${42 + i * 18}c16-3 30 2 38 ${10 + i * 2}`} />
        </g>
      ))}
      <path d="M86 26c10-6 24-8 34-4M154 26c-10-6-24-8-34-4" stroke="#e2e8f0" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function UltrasoundArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="160" fill="#0f172a" />
      <path d="M120 22 196 130H44Z" fill="#1e293b" />
      <path d="M120 22 196 130H44Z" fill="none" stroke="#334155" strokeWidth="2" />
      {[40, 64, 88].map((r) => <path key={r} d={`M${120 - r * 0.7} ${22 + r} Q120 ${22 + r * 1.25} ${120 + r * 0.7} ${22 + r}`} stroke="#5eead4" strokeOpacity="0.35" strokeWidth="2" fill="none" />)}
      <ellipse cx="116" cy="92" rx="26" ry="16" fill="#94a3b8" fillOpacity="0.55" />
      <ellipse cx="112" cy="90" rx="10" ry="6" fill="#0f172a" fillOpacity="0.8" />
      <rect x="104" y="10" width="32" height="16" rx="5" fill="#14b8a6" />
    </svg>
  );
}

/** Small icon per lab area (keys = area names in content/lab-imaging.json). */
export function LabAreaIcon({ area, className = "h-10 w-10" }: { area: string; className?: string }) {
  const color = "#0f766e";
  const common = { className, viewBox: "0 0 48 48", "aria-hidden": true as const };
  switch (area) {
    case "Hematology":
    case "Coagulation":
      return <svg {...common}><rect width="48" height="48" rx="12" fill="#fef2f2" /><path d="M24 10c6 8 12 14 12 21a12 12 0 0 1-24 0c0-7 6-13 12-21Z" fill="#ef4444" /></svg>;
    case "Clinical chemistry":
    case "Electrolytes":
      return <svg {...common}><rect width="48" height="48" rx="12" fill="#f0fdfa" /><path d="M19 10h10M21 10v10l-8 14a4 4 0 0 0 3.5 6h15a4 4 0 0 0 3.5-6l-8-14V10" stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round" /><path d="M16 32h16l2 4H14Z" fill="#14b8a6" /></svg>;
    case "Hormones & thyroid":
      return <svg {...common}><rect width="48" height="48" rx="12" fill="#faf5ff" /><path d="M14 22c0-6 5-8 10-4 5-4 10-2 10 4 0 8-10 12-10 16 0-4-10-8-10-16Z" fill="#a855f7" /></svg>;
    case "Immunology & serology":
      return <svg {...common}><rect width="48" height="48" rx="12" fill="#eff6ff" /><path d="M24 14v20M24 24l-9-9M24 24l9-9" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" /><circle cx="15" cy="15" r="3" fill="#3b82f6" /><circle cx="33" cy="15" r="3" fill="#3b82f6" /></svg>;
    case "Urinalysis":
      return <svg {...common}><rect width="48" height="48" rx="12" fill="#fefce8" /><path d="M15 14h18l-2 22a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3Z" fill="#fff" stroke="#ca8a04" strokeWidth="2.5" /><path d="M17 26h14l-1 10H18Z" fill="#facc15" /></svg>;
    case "Stool tests":
    case "Cultures (bacteriology)":
      return <svg {...common}><rect width="48" height="48" rx="12" fill="#f0fdf4" /><ellipse cx="24" cy="28" rx="14" ry="8" fill="#fff" stroke="#16a34a" strokeWidth="2.5" /><circle cx="19" cy="27" r="2.5" fill="#16a34a" /><circle cx="27" cy="30" r="2" fill="#16a34a" /><circle cx="29" cy="25" r="1.5" fill="#16a34a" /></svg>;
    default:
      return <svg {...common}><rect width="48" height="48" rx="12" fill="#f1f5f9" /><path d="M20 12h8v8h8v8h-8v8h-8v-8h-8v-8h8Z" fill={color} /></svg>;
  }
}

/* ---------- Service cards (home) ---------- */

export function DeliveryArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#f0fdfa" />
      <path d="M20 118h200" stroke="#99f6e4" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" />
      <g stroke="#5eead4" strokeWidth="4" strokeLinecap="round"><path d="M26 58h34M14 74h30M30 90h28" /></g>
      <rect x="76" y="40" width="92" height="72" rx="10" fill="#fff" stroke="#0f766e" strokeWidth="3" />
      <path d="M76 62h92" stroke="#0f766e" strokeWidth="3" />
      <path d="M118 40v22h8V40" fill="#14b8a6" />
      <path d="M118 84h8v-8h8v-8h-8v-8h-8v8h-8v8h8Z" fill="#0f766e" transform="translate(-4 14)" />
      <circle cx="196" cy="44" r="22" fill="#fff" stroke="#0f766e" strokeWidth="3" />
      <path d="M196 32v13l9 6" stroke="#0f766e" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function DoctorArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#eff6ff" />
      <circle cx="120" cy="46" r="22" fill="#fde2d4" />
      <path d="M98 42c4-16 40-16 44 0-10-6-34-6-44 0Z" fill="#1e293b" />
      <path d="M72 140c0-34 20-58 48-58s48 24 48 58Z" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M104 84l16 26 16-26" fill="#0f766e" />
      <path d="M96 92c-14 6-16 26-6 34M144 92c14 6 16 26 6 34" stroke="#334155" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="88" cy="128" r="6" fill="#14b8a6" stroke="#334155" strokeWidth="2.5" />
      <path d="M176 28h22M187 17v22" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
      <path d="M46 36 50 46 60 50 50 54 46 64 42 54 32 50 42 46Z" fill="#14b8a6" />
    </svg>
  );
}

export function IvArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#ecfeff" />
      <path d="M92 10h56" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
      <path d="M120 10v8" stroke="#475569" strokeWidth="4" />
      <path d="M98 22h44a8 8 0 0 1 8 8v46a30 30 0 0 1-30 30h-0a30 30 0 0 1-30-30V30a8 8 0 0 1 8-8Z" fill="#fff" stroke="#0f766e" strokeWidth="3" />
      <path d="M92 60h56v16a28 28 0 0 1-56 0Z" fill="#5eead4" fillOpacity="0.75" />
      {[44, 52].map((y) => <line key={y} x1="92" y1={y} x2="100" y2={y} stroke="#0f766e" strokeWidth="2" />)}
      <rect x="114" y="104" width="12" height="16" rx="3" fill="#0f766e" />
      <circle cx="120" cy="112" r="2.5" fill="#5eead4" />
      <path d="M120 120v10c0 8 20 8 28 4s14-12 16-20" stroke="#0f766e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M190 40 194 50 204 54 194 58 190 68 186 58 176 54 186 50Z" fill="#14b8a6" />
    </svg>
  );
}

export function ConciergeArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#fffbeb" />
      <rect x="28" y="44" width="70" height="76" rx="6" fill="#fff" stroke="#d97706" strokeWidth="3" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={38 + c * 20} y={54 + r * 22} width="10" height="12" rx="2" fill="#fde68a" />))}
      <rect x="110" y="104" width="108" height="16" rx="5" fill="#d97706" />
      <path d="M142 104c0-20 8-30 22-30s22 10 22 30Z" fill="#fff" stroke="#0f766e" strokeWidth="3" />
      <circle cx="164" cy="70" r="5" fill="#0f766e" />
      <path d="M164 58v7" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
      <path d="M124 104h80" stroke="#92400e" strokeWidth="3" />
      <path d="M200 40 204 50 214 54 204 58 200 68 196 58 186 54 196 50Z" fill="#14b8a6" />
    </svg>
  );
}

export function LabCardArt({ className = "h-36 w-full" }: P) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true">
      <rect x="-200" width="640" height="140" fill="#faf5ff" />
      <rect x="56" y="98" width="128" height="14" rx="5" fill="#7e22ce" />
      {[["#ef4444", 62], ["#f59e0b", 50], ["#a855f7", 66], ["#14b8a6", 56], ["#3b82f6", 60]].map(([c, h], i) => (
        <g key={i}>
          <rect x={64 + i * 24} y={98 - (h as number)} width="16" height={h as number} rx="8" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
          <rect x={67 + i * 24} y={98 - (h as number) * 0.6} width="10" height={(h as number) * 0.6 - 3} rx="5" fill={c as string} />
          <rect x={62 + i * 24} y={94 - (h as number)} width="20" height="8" rx="3" fill={c as string} />
        </g>
      ))}
      <path d="M200 22c0 12-8 20-16 20s-16-8-16-20c0-10 10-20 16-30 6 10 16 20 16 30Z" fill="#ef4444" transform="translate(0 14) scale(.9)" />
    </svg>
  );
}
