"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** EN/ES switch. Only the home page has a Spanish version so far; other pages link to it. */
export function LangToggle({ className = "", long = false }: { className?: string; long?: boolean }) {
  const es = usePathname()?.startsWith("/es") ?? false;
  const href = es ? "/" : "/es";
  if (long) return <Link href={href} hrefLang={es ? "en" : "es"} className={className}>{es ? "English" : "Español"}</Link>;
  return (
    <Link href={href} hrefLang={es ? "en" : "es"} aria-label={es ? "English version" : "Versión en español"}
      className={`h-10 items-center rounded-xl px-2.5 text-sm font-semibold text-navy/50 hover:text-navy ${className}`}>
      <span className={es ? "" : "text-navy"}>EN</span><span className="mx-1 text-navy/25">/</span><span className={es ? "text-navy" : ""}>ES</span>
    </Link>
  );
}
