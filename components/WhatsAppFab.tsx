"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChat } from "@/components/Icons";
import { SITE } from "@/lib/site";

/**
 * Contact shortcuts. Mobile: a slim action bar (Order, Book, WhatsApp) that sits below the content
 * (the footer reserves room for it), so it never covers text or navigation. Desktop: one WhatsApp pill.
 */
export function WhatsAppFab() {
  const es = usePathname()?.startsWith("/es") ?? false;
  const href = `${SITE.whatsapp}?text=${encodeURIComponent(es ? "¡Hola! Necesito ayuda de CMC Pharmacy Cabo." : "Hi! I need help from CMC Pharmacy Cabo.")}`;
  return (
    <>
      <nav aria-label={es ? "Acciones rápidas" : "Quick actions"} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2 px-3 py-2">
          <Link href="/shop" className="flex h-12 flex-col items-center justify-center rounded-xl text-[11px] font-semibold text-navy hover:bg-surface">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10.5 20.5a4.95 4.95 0 0 1-7-7l10-10a4.95 4.95 0 0 1 7 7l-10 10zM8.5 8.5l7 7" /></svg>
            {es ? "Medicamentos" : "Order medicine"}
          </Link>
          <Link href="/doctor-consultation" className="flex h-12 flex-col items-center justify-center rounded-xl text-[11px] font-semibold text-navy hover:bg-surface">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M12 13v4M10 15h4" /></svg>
            {es ? "Reservar médico" : "Book a doctor"}
          </Link>
          <a href={href} target="_blank" rel="noopener" className="flex h-12 flex-col items-center justify-center rounded-xl bg-[#25d366] text-[11px] font-bold text-[#05301b]">
            <IconChat className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </nav>
      <a href={href} target="_blank" rel="noopener" aria-label="Message us on WhatsApp"
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-[#25d366] py-3 pl-4 pr-5 text-[#05301b] shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-[#2ee170] lg:flex">
        <IconChat className="h-6 w-6" />
        <span className="leading-tight">
          <span className="block text-sm font-bold">{es ? "Escríbenos" : "WhatsApp us"}</span>
          <span className="block text-[11px] font-medium opacity-80">{es ? "Español e inglés" : "English & Spanish"} · {SITE.whatsappDisplay}</span>
        </span>
      </a>
    </>
  );
}
