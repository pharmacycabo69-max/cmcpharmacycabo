import { IconChat, IconPhone } from "@/components/Icons";
import { SITE } from "@/lib/site";

/** Floating contact buttons, visible on every page. Pure HTML/CSS: no client JavaScript. */
export function WhatsAppFab() {
  const href = `${SITE.whatsapp}?text=${encodeURIComponent("Hi! I need help from the pharmacy in Cabo.")}`;
  return (
    <>
      <a href={SITE.tel} aria-label={`Call ${SITE.phone}`}
        className="fixed bottom-5 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-lg ring-1 ring-slate-200 transition hover:scale-105 lg:hidden">
        <IconPhone className="h-5 w-5" />
      </a>
      <a href={href} target="_blank" rel="noopener" aria-label="Chat with a pharmacist on WhatsApp"
        className="group fixed bottom-5 right-4 z-50 flex items-center gap-3 rounded-full bg-[#25d366] p-3.5 text-[#05301b] shadow-xl shadow-emerald-900/25 ring-4 ring-white/70 transition hover:scale-105 hover:bg-[#2ee170] sm:right-6 sm:pl-4 sm:pr-5">
        <span className="relative flex h-7 w-7 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-70 motion-safe:animate-ping" aria-hidden="true" />
          <IconChat className="relative h-7 w-7" />
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-sm font-bold">Chat with a pharmacist</span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#05301b]/80"><span className="h-1.5 w-1.5 rounded-full bg-[#0b7a3e]" />Online 24/7 · English</span>
        </span>
      </a>
    </>
  );
}
