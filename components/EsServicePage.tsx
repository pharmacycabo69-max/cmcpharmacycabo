import Link from "next/link";
import type { ComponentProps } from "react";
import { ServiceHero } from "@/components/ServiceHero";
import { JsonLd, faqSchema } from "@/lib/seo";

/**
 * Spanish service page: shared hero + what's included + how it works + FAQ (with schema) + link to the
 * English page. Booking and payment pages stay in English for now; the team answers in Spanish on WhatsApp.
 */
export function EsServicePage({ hero, includes, steps, faq, english }: {
  hero: Omit<ComponentProps<typeof ServiceHero>, "lang">;
  includes: { t: string; d: string }[];
  steps: string[];
  faq: { q: string; a: string }[];
  english: { href: string; label: string };
}) {
  return (
    <div lang="es">
      <JsonLd data={faqSchema(faq)} />
      <ServiceHero {...hero} lang="es" />
      <section className="section" aria-labelledby="es-inc">
        <h2 id="es-inc" className="h2">Qué incluye</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {includes.map((i) => (
            <li key={i.t} className="card p-6"><h3 className="font-semibold text-navy">{i.t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{i.d}</p></li>
          ))}
        </ul>
      </section>
      <section className="bg-surface" aria-labelledby="es-steps">
        <div className="section">
          <h2 id="es-steps" className="h2">Cómo funciona</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="card p-5"><span className="font-display text-sm font-bold text-brand">0{i + 1}</span><p className="mt-2 text-sm text-navy">{s}</p></li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14" aria-labelledby="es-faq">
        <h2 id="es-faq" className="h2">Preguntas frecuentes</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-navy">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500">La reserva en línea y el pago están en inglés por ahora; te atendemos en español por WhatsApp. <Link href={english.href} hrefLang="en" className="font-semibold text-brand">{english.label}</Link></p>
      </section>
    </div>
  );
}
