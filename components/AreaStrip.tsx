import { IconBuilding } from "@/components/Icons";
import { SITE } from "@/lib/site";

/**
 * Header for the hotel delivery pages. Replaces the shared photo banner (the same photo was on 30 pages):
 * each page now gets its own strip with the hotel name and a one-tap order button.
 */
export function AreaStrip({ name }: { name: string }) {
  const href = `${SITE.whatsapp}?text=${encodeURIComponent(`Hi! I need a pharmacy delivery to ${name} in Cabo.`)}`;
  return (
    <section className="bg-gradient-to-r from-brand-dark via-brand to-teal-500 text-white" aria-label={`Pharmacy delivery to ${name}`}>
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25"><IconBuilding className="h-5 w-5" /></span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-100">Pharmacy delivery to</p>
            <p className="font-semibold leading-tight">{name}</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs font-medium">
          {[`7 am – 11 pm · every day`, `Free from $${SITE.freeDeliveryFrom}`, "English & Spanish"].map((c) => (
            <li key={c} className="rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/25">{c}</li>
          ))}
        </ul>
        <a href={href} target="_blank" rel="noopener" className="btn !bg-[#25d366] !py-2.5 text-[#05301b] shadow-md shadow-black/20 hover:!bg-[#2ee170]">Order for {name}</a>
      </div>
    </section>
  );
}
