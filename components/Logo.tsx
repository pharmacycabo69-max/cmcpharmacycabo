export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0f766e" />
      <path fill="#fff" d="M26 12h12a2 2 0 0 1 2 2v10h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H40v10a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V40H14a2 2 0 0 1-2-2V26a2 2 0 0 1 2-2h10V14a2 2 0 0 1 2-2Z" />
      <circle cx="32" cy="32" r="5" fill="#0f766e" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-none">
        <span className="block text-[1.05rem] font-bold tracking-tight text-slate-900">CMC Pharmacy</span>
        <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-brand">Cabo · 24/7</span>
      </span>
    </span>
  );
}
