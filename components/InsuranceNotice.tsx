import { IconShield } from "@/components/Icons";
import { INSURANCE } from "@/lib/site";

/**
 * International insurance notice (master data §2.1). Context block only: it never promises coverage,
 * never asks for documents here, and the CTA opens a generic WhatsApp message for a human to follow up.
 */
export function InsuranceNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside aria-labelledby="ins-title" className={`rounded-2xl border border-line bg-white ${compact ? "p-5" : "p-6 md:p-8"}`}>
      <div className="flex items-start gap-4">
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand sm:flex"><IconShield className="h-5 w-5" /></span>
        <div>
          <h2 id="ins-title" className={`${compact ? "text-base" : "text-lg md:text-xl"} font-semibold leading-snug`}>{INSURANCE.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{INSURANCE.body}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Coverage, authorization, deductibles and payment method are confirmed case by case. Mexican national insurance is not accepted. In an emergency, call 911.
          </p>
          <a href={INSURANCE.href} target="_blank" rel="noopener" className="btn btn-outline mt-4 !py-2">{INSURANCE.cta}</a>
        </div>
      </div>
    </aside>
  );
}
