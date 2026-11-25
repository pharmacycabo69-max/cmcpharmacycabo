import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { ConciergeConsole } from "@/components/ConciergeConsole";
import { IconArrow, IconBuilding, IconCard, IconDrip, IconFlask, IconPill, IconShield, IconSparkle, IconStethoscope } from "@/components/Icons";
import { PostCover } from "@/components/PostCover";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { categoryContent } from "@/lib/category-content";
import { deliveryAreas, hotelName, posts } from "@/lib/content";
import { LOCATIONS } from "@/lib/locations";
import { categoryBySlug, products } from "@/lib/products";
import { JsonLd, faqSchema, pharmacySchema, websiteSchema } from "@/lib/seo";
import { publicServices } from "@/lib/services";
import { SITE, abs } from "@/lib/site";
import { DOCTOR, MEDICAL_PRICES } from "@/lib/team";

export const metadata: Metadata = {
  title: { absolute: "Cabo San Lucas Pharmacy: Hotel Delivery | CMC Pharmacy Cabo" },
  description:
    "Pharmacy delivery to every hotel in Cabo San Lucas & San José del Cabo, 7 am–11 pm. English-speaking doctors, IV therapy, lab tests. Free delivery from $59.",
  alternates: { canonical: "/", languages: { en: "/", es: "/es", "x-default": "/" } },
  openGraph: {
    title: "Cabo San Lucas Pharmacy: Hotel Delivery | CMC Pharmacy Cabo",
    description: "Pharmacy delivery to every hotel in Los Cabos, English-speaking doctors, IV therapy and lab tests.",
    url: "/",
  },
};

type Icon = ComponentType<{ className?: string }>;
/** "I need…" entry points (V4 §5.1 item 3): each opens the matching flow. */
const INTENTS: { icon: Icon; t: string; d: string; href: string; cta: string }[] = [
  { icon: IconPill, t: "I need medication", d: "Build a request; a pharmacist confirms availability and total.", href: "/shop", cta: "Order medicine" },
  { icon: IconStethoscope, t: "I need a doctor", d: `Video $${MEDICAL_PRICES.video}, clinic $${MEDICAL_PRICES.clinic}, at your hotel $${MEDICAL_PRICES.hotel}.`, href: "/book", cta: "Book medical care" },
  { icon: IconDrip, t: "I need IV therapy", d: "At your hotel or villa after a medical assessment.", href: "/iv-therapy", cta: "See IV menu" },
  { icon: IconFlask, t: "I need a medical test", d: "Lab tests, X-ray and ultrasound, coordinated by our doctors.", href: "/lab-tests-imaging", cta: "Request a quote" },
  { icon: IconCard, t: "I have travel insurance", d: "US & Canadian policies, verified before your visit.", href: "/international-insurance", cta: "Verify my insurance" },
  { icon: IconSparkle, t: "Aesthetic medicine", d: "Lip fillers, botulinum toxin, rejuvenation, brightening.", href: "/aesthetic-medicine", cta: "See treatments" },
];

const STEPS = [
  { t: "Tell us what you need", d: "Add products to your request, or send a list or a photo of the box on WhatsApp, in English or Spanish." },
  { t: "A pharmacist confirms", d: "Availability, prescription requirements, total price and delivery time — before anything is charged." },
  { t: "We deliver to you", d: `To your hotel, villa or home, ${SITE.deliveryHours.label}. Free on orders of $${SITE.freeDeliveryFrom}+.` },
];

const FAQ = [
  { q: "Is there a pharmacy near me in Cabo San Lucas?", a: `Yes. The ${SITE.parent} network has ${LOCATIONS.length} pharmacies in Cabo San Lucas open every day from 8 am to 6 pm, and ${SITE.name}, its delivery service, brings medicine to your hotel, villa or home from 7 am to 11 pm.` },
  { q: "Do you deliver to my hotel?", a: "We deliver to hotels, resorts, villas and vacation rentals in Cabo San Lucas, San José del Cabo and the Corridor. Some hotels only accept deliveries at the front desk or the entrance; we coordinate the hand-over with you." },
  { q: "Do I pay online?", a: "Not for pharmacy orders. You send a request, a pharmacist confirms availability and the total, and you pay through the channel we agree on. Medical services are booked first and paid online only after our team confirms your time." },
  { q: "Can I get prescription medication?", a: "Prescription-only medicines are dispensed only with a valid prescription. If you don't have one, our English-speaking doctors can see you by video, at the clinic or at your hotel." },
  { q: "Do you accept travel insurance?", a: "We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation. Contact our team to verify your eligibility and payment arrangements before receiving medical services." },
  { q: "Is this an emergency service?", a: "No. In an emergency, call 911 or go to the nearest hospital." },
];

/** Travelers' essentials shown on the home page (all have photo and price). */
const FEATURED_IDS = [5032, 5114, 3220, 2324, 2968, 4324, 3180, 2678];
const TRAVEL_CATS = ["sun-care", "digestive-gi-care", "pain-fever-relief", "allergy-otc", "hydration-electrolytes", "insect-repellents", "wound-care-first-aid", "cold-flu"];

export default function Home() {
  const hotels = deliveryAreas();
  const featured = FEATURED_IDS.map((id) => products.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p && !!p.img);
  const cats = TRAVEL_CATS.map((s) => ({ c: categoryBySlug(s), h: categoryContent(s)?.h1 })).filter((x) => x.c && x.c.count > 0);
  const services = publicServices().filter((s) => ["video-consult", "clinic-visit", "hotel-doctor", "iv-therapy", "lab-tests", "aesthetics"].includes(s.id));
  const blog = posts().slice(0, 3);
  const serviceList = {
    "@context": "https://schema.org", "@type": "ItemList", name: `${SITE.name} services`,
    itemListElement: publicServices().map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: abs(s.href) })),
  };
  return (
    <>
      <JsonLd data={[pharmacySchema(), websiteSchema(), faqSchema(FAQ), serviceList]} />

      {/* 1. Hero: concierge console (search + every service) and two primary actions */}
      <section className="relative isolate overflow-hidden bg-navy-deep text-white">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_75%)]" />
        <div aria-hidden className="absolute -left-32 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-48 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-teal-400/10 blur-3xl" />
        <div className="mx-auto grid max-w-[76rem] items-center gap-12 px-4 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />Medical concierge &amp; pharmacy · Los Cabos
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl">How can we help you <span className="bg-gradient-to-r from-teal-300 to-cyan-200 bg-clip-text text-transparent">today?</span></h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">Medical care and pharmacy delivery in Los Cabos: medicine to your room, a doctor by video, at the clinic or at your hotel, IV therapy and tests, in English or Spanish.</p>
            <ConciergeConsole />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/request" className="btn btn-primary !py-3.5">Request medication availability</Link>
              <Link href="/book" className="btn !py-3.5 bg-white text-navy hover:bg-teal-50">Book medical care</Link>
            </div>
          </div>
          <div className="relative mx-auto mb-6 w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
              <Image src="/locations/ocean/06-counter-team.jpg" alt="Pharmacist at the counter of our Ocean pharmacy at the Cabo San Lucas marina" fill priority sizes="(min-width: 1024px) 460px, 90vw" className="object-cover object-[62%_50%]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep/90 to-transparent" aria-hidden />
              <p className="absolute bottom-16 left-5 right-5 text-sm text-white/85">Our pharmacy team at the Cabo San Lucas marina · {SITE.parent} network, {LOCATIONS.length} pharmacies</p>
            </div>
            <div className="absolute -left-4 top-8 hidden w-60 rounded-2xl bg-white p-4 text-navy shadow-2xl shadow-black/30 sm:block lg:-left-12">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand"><IconShield className="h-4 w-4" />Every order</p>
              <p className="mt-1 text-sm font-semibold">Reviewed by a pharmacist before we charge or deliver</p>
            </div>
            <div className="absolute -right-3 top-1/2 hidden w-56 rounded-2xl bg-white/95 p-4 text-navy shadow-2xl shadow-black/30 backdrop-blur sm:block lg:-right-8">
              <Image src={DOCTOR.photo} alt="" width={48} height={48} className="h-10 w-10 rounded-full object-cover" />
              <p className="mt-2 text-sm font-semibold">{DOCTOR.name}</p>
              <p className="text-xs text-slate-500">Physician · license {DOCTOR.license}</p>
            </div>
            <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-3 divide-x divide-line rounded-2xl bg-white text-center text-navy shadow-2xl shadow-black/30">
              {[[`$${MEDICAL_PRICES.video}`, "Video doctor"], ["7am–11pm", "Delivery, daily"], [`$${SITE.freeDeliveryFrom}+`, "Free delivery"]].map(([a, b]) => (
                <p key={b} className="px-2 py-3"><span className="block font-display text-lg font-extrabold">{a}</span><span className="text-[11px] text-slate-500">{b}</span></p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive entry points */}
      <section className="section !pt-14" aria-labelledby="intents">
        <h2 id="intents" className="sr-only">What do you need?</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTENTS.map(({ icon: I, t, d, href, cta }) => (
            <li key={t}>
              <Link href={href} className="card card-hover group flex h-full gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white"><I className="h-6 w-6" /></span>
                <span className="flex flex-1 flex-col">
                  <span className="font-display text-lg font-bold text-navy">{t}</span>
                  <span className="mt-1 text-sm leading-relaxed text-slate-600">{d}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">{cta}<IconArrow className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Services with approved prices */}
      <section className="bg-navy text-white" aria-labelledby="prices">
        <div className="section">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow !text-teal-300">Clear prices</p>
              <h2 id="prices" className="h2 mt-2 !text-white">Medical care with the price up front</h2>
            </div>
            <p className="max-w-md text-sm text-white/70">USD, taxes included. Tests and imaging are quoted after a medical review.</p>
          </div>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.id} className="bg-navy">
                <Link href={s.href} className="group flex h-full flex-col p-6 transition hover:bg-white/5">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-lg font-bold">{s.name}</span>
                    <span className="shrink-0 font-display text-2xl font-extrabold text-teal-300">{s.price}</span>
                  </span>
                  <span className="mt-2 text-sm text-white/70">{s.short}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">{s.price === "Quote" ? "Request a quote" : "Book"}<IconArrow className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-white/60">Not an emergency service: in an emergency, call 911.</p>
        </div>
      </section>

      {/* 4. Pharmacy: traveler categories + essentials */}
      <section className="section" aria-labelledby="pharmacy">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="eyebrow">Pharmacy</p><h2 id="pharmacy" className="h2 mt-2">What travelers usually need</h2></div>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">Browse the full catalog<IconArrow /></Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {cats.map(({ c, h }) => (
            <li key={c!.slug}><Link href={`/product-category/${c!.slug}`} className="card card-hover flex h-full items-center justify-between gap-2 px-4 py-3.5 text-sm font-semibold text-navy">{(h ?? c!.name).replace(/ in Cabo$/, "")}<IconArrow className="h-4 w-4 shrink-0 text-brand" /></Link></li>
          ))}
        </ul>
        <ul className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-4">
          {featured.map((p) => <li key={p.id} className="w-48 shrink-0 snap-start sm:w-56"><ProductCard p={p} /></li>)}
        </ul>
        <p className="mt-2 text-xs text-slate-500">Prices in USD. Availability is confirmed by a pharmacist when you send your request.</p>
      </section>

      {/* 5. How it works + hotel access */}
      <section className="bg-sand" aria-labelledby="how">
        <div className="section grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 id="how" className="h2 mt-2">From your request to your door</h2>
            <ol className="mt-8 space-y-6">
              {STEPS.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display font-bold text-white">{i + 1}</span>
                  <div><h3 className="font-semibold text-navy">{s.t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-700">{s.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-navy">Staying at a hotel or villa?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">We deliver across Cabo San Lucas, San José del Cabo and the Corridor. Some resorts only accept deliveries at the front desk or the entrance: we coordinate the hand-over with you. We are not affiliated with the hotels listed.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {hotels.slice(0, 12).map((p) => (
                <li key={p.slug}><Link href={`/${p.slug}`} className="inline-block rounded-full border border-line bg-white px-3 py-1.5 text-sm text-navy transition hover:border-brand hover:text-brand">{hotelName(p.title)}</Link></li>
              ))}
            </ul>
            <Link href="/delivery-areas" className="btn btn-outline mt-6">Find your hotel</Link>
          </div>
        </div>
      </section>

      {/* 6. Verified locations */}
      <section className="section" aria-labelledby="stores">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="eyebrow">Walk-in pharmacies</p><h2 id="stores" className="h2 mt-2">{LOCATIONS.length} pharmacies in Cabo San Lucas</h2><p className="mt-2 text-slate-600">Open every day, 8 am – 6 pm, in Centro and the Marina.</p></div>
          <Link href="/locations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">Addresses &amp; directions<IconArrow /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.slice(0, 3).map((l) => <StoreCard key={l.slug} l={l} />)}
        </div>
      </section>

      {/* 7. Team & trust */}
      <section className="bg-surface" aria-labelledby="team">
        <div className="section grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid grid-cols-2 gap-4">
            <Image src={DOCTOR.photo} alt={`${DOCTOR.name}, physician at ${DOCTOR.clinic}`} width={720} height={900} sizes="(min-width: 1024px) 260px, 45vw" className="aspect-[4/5] w-full rounded-2xl object-cover" />
            <Image src="/locations/mercado-marina/02-counter-service.jpg" alt="Pharmacist serving a customer at our Mercado Marina pharmacy" width={1600} height={1069} sizes="(min-width: 1024px) 260px, 45vw" className="mt-10 aspect-[4/5] w-full rounded-2xl object-cover" />
          </div>
          <div>
            <p className="eyebrow">Who takes care of you</p>
            <h2 id="team" className="h2 mt-2">Real pharmacies, a licensed doctor, one team</h2>
            <p className="mt-4 text-slate-600">{SITE.name} is the delivery and concierge service of {SITE.parent}. Your order is prepared by our pharmacy team, and medical consultations are with {DOCTOR.name} of {DOCTOR.clinic}.</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Physician", `${DOCTOR.name} · license ${DOCTOR.license} (${DOCTOR.school.replace(/ \(.*\)/, "")})`],
                ["Prescriptions", "Prescription-only medicines are dispensed only with a valid prescription"],
                ["Pharmacies", `${LOCATIONS.length} walk-in stores you can visit in Cabo San Lucas`],
                ["Languages", "English and Spanish, by WhatsApp, phone or in person"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white p-4 ring-1 ring-line"><dt className="text-xs font-semibold uppercase tracking-wider text-brand">{k}</dt><dd className="mt-1 text-sm text-navy">{v}</dd></div>
              ))}
            </dl>
            <Link href="/doctor-consultation" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">Meet the doctor<IconArrow /></Link>
          </div>
        </div>
      </section>

      {/* 8. Insurance + B2B */}
      <section className="section grid gap-5 md:grid-cols-2" aria-label="Insurance and partners">
        <div className="card flex flex-col p-7">
          <IconCard className="h-8 w-8 text-brand" />
          <h2 className="mt-4 font-display text-2xl font-bold text-navy">International insurance</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation, before you receive medical services.</p>
          <Link href="/international-insurance" className="btn btn-outline mt-5 self-start">How verification works</Link>
        </div>
        <div className="card flex flex-col bg-navy p-7 text-white">
          <IconBuilding className="h-8 w-8 text-teal-300" />
          <h2 className="mt-4 font-display text-2xl font-bold">For hotels, villas &amp; concierges</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/75">One contact for your guests&apos; pharmacy deliveries, doctor visits and IV therapy. We don&apos;t need any guest health details to set up the partnership.</p>
          <Link href="/for-concierges" className="btn mt-5 self-start bg-white text-navy hover:bg-teal-50">Partner with us</Link>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-6" aria-labelledby="faq">
        <h2 id="faq" className="h2 text-center">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-navy">{f.q}<span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-center text-sm"><Link href="/faq" className="font-semibold text-brand">More answers →</Link></p>
      </section>

      {/* 10. Guides */}
      {blog.length > 0 && (
        <section className="section !pb-4" aria-labelledby="blog">
          <div className="flex items-end justify-between gap-4">
            <h2 id="blog" className="h2">Travel health guides</h2>
            <Link href="/blog" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand">All guides<IconArrow /></Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {blog.map((p) => (
              <article key={p.slug} className="card card-hover group relative overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-surface">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" width={640} height={360} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    <PostCover slug={p.slug} className="h-full w-full" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold leading-snug text-navy"><Link href={`/${p.slug}`} className="after:absolute after:inset-0 group-hover:text-brand">{p.title}</Link></h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
