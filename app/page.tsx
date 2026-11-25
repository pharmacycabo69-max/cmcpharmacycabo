import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ConciergeArt, DeliveryArt, DoctorArt, IvArt, LabCardArt, LipsArt } from "@/components/Illustrations";
import { IconBox, IconClock, IconDrip, IconGlobe, IconShield, IconStar } from "@/components/Icons";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import { PostCover } from "@/components/PostCover";
import { photo } from "@/components/PageBanner";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { deliveryAreas, hotelName, posts } from "@/lib/content";
import { IV_DRIPS } from "@/lib/ivtherapy";
import { LOCATIONS } from "@/lib/locations";
import { products } from "@/lib/products";
import { JsonLd, faqSchema, pharmacySchema, websiteSchema } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";
import { DOCTOR, MEDICAL_PRICES } from "@/lib/team";

export const metadata: Metadata = {
  title: { absolute: "Cabo San Lucas Pharmacy: Hotel Delivery | CMC Pharmacy Cabo" },
  description:
    "Pharmacy delivery to every hotel in Cabo San Lucas & San José del Cabo, 7 am–11 pm. English-speaking doctors, IV therapy, lab tests. Free delivery from $59.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cabo San Lucas Pharmacy: Hotel Delivery | CMC Pharmacy Cabo",
    description: "Pharmacy delivery to every hotel in Los Cabos, English-speaking doctors, IV therapy and lab tests.",
    url: "/",
  },
};

type Service = { art: ReactNode; t: string; d: string; tag: string; href: string };
const SERVICES: Service[] = [
  { art: <DeliveryArt />, t: "Pharmacy delivery to your hotel", d: `Prescriptions, OTC medicine and travel essentials, every day ${SITE.deliveryHours.label.replace(", every day", "")}.`, tag: `Free from $${SITE.freeDeliveryFrom}`, href: "/24-7-pharmacy-delivery-cabo-san-lucas" },
  { art: <DoctorArt />, t: "English-speaking doctors", d: "Video consultation or a visit at our clinic in Centro, by appointment.", tag: `From $${MEDICAL_PRICES.video}`, href: "/doctor-consultation" },
  { art: <ConciergeArt />, t: "Doctor at your hotel or villa", d: "A doctor comes to you in Cabo San Lucas, San José del Cabo and the Corridor.", tag: `$${MEDICAL_PRICES.hotel} house call`, href: "/hotel-doctor-cabo" },
  { art: <IvArt />, t: "IV therapy", d: "IV therapy at your hotel or villa after a medical assessment.", tag: "From $159", href: "/iv-therapy" },
  { art: <LabCardArt />, t: "Lab tests, X-ray & ultrasound", d: "Blood work, urine and stool tests, X-rays and ultrasound coordinated by our medical team.", tag: "Quote on request", href: "/lab-tests-imaging" },
  { art: <LipsArt />, t: "Aesthetic medicine", d: "Lip fillers, wrinkle-relaxing injections, skin brightening and facial rejuvenation.", tag: "From $170", href: "/aesthetic-medicine" },
];

const STEPS = [
  { t: "Contact us", d: "WhatsApp, call or browse the shop. Our bilingual team answers in English and Spanish." },
  { t: "We confirm", d: "We check your prescription needs and confirm the product, total price and delivery time before we go." },
  { t: "Delivered to you", d: `Discreet delivery to your hotel, villa or home, ${SITE.deliveryHours.label}.` },
];

const FAQ = [
  { q: "Is there a pharmacy near me in Cabo San Lucas?", a: `Yes. The ${SITE.parent} network has ${LOCATIONS.length} pharmacies in Cabo San Lucas open every day from 8 am to 6 pm, and ${SITE.name}, its delivery service, brings medicine to your hotel, villa or home from 7 am to 11 pm.` },
  { q: "What are your delivery hours?", a: "We deliver every day from 7:00 am to 11:00 pm to hotels, resorts, villas and homes in Cabo San Lucas, San José del Cabo and the Corridor. Delivery is free on orders of $59 or more, and we confirm the estimated delivery time when you order." },
  { q: "Do you deliver to hotels, resorts and Airbnbs?", a: "Yes — we deliver to every hotel, all-inclusive resort, villa and vacation rental in Cabo San Lucas, San José del Cabo and the Tourist Corridor. Some hotels only allow delivery to the front desk; we coordinate it with you." },
  { q: "Can I get prescription medication from an English-speaking pharmacy?", a: "Yes. Our team is bilingual and can guide you through Mexican prescription requirements. Prescription-only medicines are dispensed only with a valid prescription." },
  { q: "Do you offer doctor visits?", a: "Yes: video consultations, visits at our clinic and doctor visits at your hotel or villa, by appointment. We are not an emergency service: in an emergency, call 911." },
  { q: "Do you accept travel insurance?", a: "We accept international health and travel insurance from the United States and Canada, subject to policy verification and coverage confirmation. Contact our team to verify your eligibility and payment arrangements before receiving medical services." },
];

/** Travelers' essentials shown on the home page (all have photo and price). */
const FEATURED_IDS = [5032, 5114, 3220, 2324, 2968, 4324, 3180, 2678];

export default function Home() {
  const hotels = deliveryAreas();
  const arco = photo("arco");
  const featured = FEATURED_IDS.map((id) => products.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p && !!p.img);
  const blog = posts().slice(0, 3);
  const eyebrow = "text-xs font-bold uppercase tracking-[0.16em] text-brand";
  const serviceList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} services`,
    itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.t, url: abs(s.href) })),
  };
  return (
    <>
      <JsonLd data={[pharmacySchema(), websiteSchema(), faqSchema(FAQ), serviceList]} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src={arco.src} alt={arco.alt} fill priority quality={60} sizes="100vw" className="-z-20 object-cover object-[62%_45%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-900/15" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-slate-950/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-16 md:pb-36 md:pt-24">
          <div className="max-w-2xl">
            {/* Trust chips: only verifiable facts (no seals or ratings until the owner confirms them) */}
            <div className="flex flex-wrap gap-2 text-xs font-medium text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/25 backdrop-blur"><IconShield className="h-4 w-4" />{SITE.parent} network · {LOCATIONS.length} stores in Cabo</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/25 backdrop-blur"><IconGlobe className="h-4 w-4" />English &amp; Spanish</span>
              {SITE.rating && <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/25 backdrop-blur"><IconStar className="h-3.5 w-3.5 text-amber-300" />{SITE.rating.value.toFixed(1)} · {SITE.rating.count} Google reviews</span>}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
              Pharmacy delivery in <span className="text-teal-300">Cabo San Lucas</span> &amp; San José del Cabo
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">English-speaking pharmacy team and doctor visits by appointment. Prescriptions, medicine and health essentials delivered to your hotel or villa, every day from 7 am to 11 pm.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi! I need a pharmacy delivery in Cabo.")}`} target="_blank" rel="noopener" className="btn !bg-[#25d366] !px-6 !py-3.5 text-[#05301b] shadow-lg shadow-black/20 hover:!bg-[#2ee170]">Order on WhatsApp</a>
              <a href={SITE.tel} className="btn !px-6 !py-3.5 text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/15">Call {SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-4">
        <ul className="grid grid-cols-2 divide-slate-100 rounded-2xl bg-white p-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100 md:grid-cols-4 md:divide-x">
          {[
            [IconClock, "7 am – 11 pm", "Delivery, every day"],
            [IconBox, `Free from $${SITE.freeDeliveryFrom}`, "Delivery on orders of $59+"],
            [IconGlobe, "English", "Pharmacists & doctors"],
            [IconDrip, `${products.length.toLocaleString("en-US")}+`, "Products in the shop"],
          ].map(([Icon, big, small]) => {
            const I = Icon as typeof IconClock;
            return (
              <li key={big as string} className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><I className="h-5 w-5" /></span>
                <p><span className="block text-lg font-bold leading-tight">{big as string}</span><span className="block text-xs text-slate-600">{small as string}</span></p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Services */}
      <section className="section" aria-labelledby="services">
        <p className={eyebrow}>What we do</p>
        <h2 id="services" className="h2 mt-2">Pharmacy, doctors and wellness, delivered to your hotel</h2>
        <p className="mt-3 max-w-2xl text-slate-600">One WhatsApp for your medicine, a doctor, IV therapy and lab tests while you are in Los Cabos.</p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.t}>
              <Link href={s.href} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-xl">
                <div className="overflow-hidden [&>svg]:h-28 sm:[&>svg]:h-36">{s.art}</div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="self-start rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">{s.tag}</span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{s.t}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.d}</p>
                  <span className="mt-4 text-sm font-semibold text-brand">Learn more <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Doctor spotlight */}
      <section className="bg-slate-50" aria-labelledby="doctor">
        <div className="section grid items-center gap-10 md:grid-cols-[320px_1fr]">
          <Image src={DOCTOR.photo} alt={`${DOCTOR.name}, physician at ${DOCTOR.clinic}`} width={720} height={900} sizes="(min-width: 768px) 320px, 90vw" className="mx-auto w-full max-w-[320px] rounded-3xl object-cover shadow-xl shadow-slate-900/15 ring-1 ring-slate-200" />
          <div>
            <p className={eyebrow}>Your doctor in Cabo</p>
            <h2 id="doctor" className="h2 mt-2">See an English-speaking doctor: video, clinic or at your hotel</h2>
            <p className="mt-3 max-w-xl text-slate-600">Meet {DOCTOR.name} ({DOCTOR.degree.split(" (")[0]}, {DOCTOR.languages.join(" & ")}) of {DOCTOR.clinic}. Our English-speaking doctors see you by video, at the clinic or at your hotel, by appointment. Prices in USD, taxes included.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {[["Video consultation", MEDICAL_PRICES.video], ["Clinic visit", MEDICAL_PRICES.clinic], ["Hotel or villa visit", MEDICAL_PRICES.hotel]].map(([k, v]) => (
                <li key={k as string} className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100">
                  <p className="text-3xl font-extrabold text-brand">${v as number}</p>
                  <p className="mt-1 text-sm text-slate-600">{k as string}</p>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/doctor-consultation" className="btn btn-primary">Book a doctor</Link>
              <Link href="/hotel-doctor-cabo" className="btn btn-outline">Doctor at your hotel</Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">Not an emergency service: in an emergency, call 911.</p>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section" aria-labelledby="essentials">
        <div className="flex items-end justify-between gap-4">
          <div><p className={eyebrow}>Travelers&apos; essentials</p><h2 id="essentials" className="h2 mt-2">What visitors order most</h2></div>
          <Link href="/price-list" className="shrink-0 text-sm font-semibold text-brand">Price list →</Link>
        </div>
        <ul className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-4">
          {featured.map((p) => <li key={p.id} className="w-44 shrink-0 snap-start sm:w-52"><ProductCard p={p} /></li>)}
          <li className="flex w-44 shrink-0 snap-start items-center sm:w-52">
            <Link href="/shop" className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand/40 p-6 text-center text-sm font-semibold text-brand transition hover:bg-brand-soft">
              <span className="text-3xl" aria-hidden>→</span>Shop all {products.length.toLocaleString("en-US")} products
            </Link>
          </li>
        </ul>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-b from-brand-soft to-white" aria-labelledby="how">
        <div className="section">
          <p className={eyebrow}>Simple &amp; fast</p>
          <h2 id="how" className="h2 mt-2">How pharmacy delivery works</h2>
          <ol className="relative mt-10 grid gap-6 md:grid-cols-3">
            <span aria-hidden className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent md:block" />
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-extrabold text-white shadow-lg shadow-teal-900/20 ring-8 ring-brand-soft">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* IV therapy band */}
      <section className="bg-gradient-to-br from-brand-dark via-brand to-teal-600 text-white" aria-labelledby="iv">
        <div className="section grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-200">IV therapy · by appointment</p>
            <h2 id="iv" className="h2 mt-2">IV therapy at your hotel or villa</h2>
            <p className="mt-3 max-w-lg text-teal-50">A licensed nurse comes to you after a short medical assessment. Prices in USD, taxes included; a 50% deposit secures your booking.</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {[["IV therapy", "$159"], ["Multivitamin", "$189"], ["NAD+", "$279"]].map(([k, v]) => (
                <li key={k} className="rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/25 backdrop-blur"><span className="block text-2xl font-extrabold">{v}</span><span className="text-xs text-teal-100">{k}</span></li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-teal-100">Groups of 3 or more: $139 per person · At the clinic from $129</p>
            <div className="mt-7"><Link href="/iv-therapy" className="btn bg-white text-brand hover:bg-teal-50">See IV menu &amp; book</Link></div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-black/20 ring-1 ring-white/20"><Image src={IV_DRIPS[0].image} alt="" fill sizes="(min-width: 768px) 384px, 90vw" className="object-cover" /></div>
        </div>
      </section>

      {/* Stores */}
      <section className="bg-slate-50" aria-labelledby="stores">
        <div className="section">
          <div className="flex items-end justify-between gap-4">
            <div><p className={eyebrow}>Walk-in pharmacies</p><h2 id="stores" className="h2 mt-2">Visit one of our pharmacies in Cabo San Lucas</h2></div>
            <Link href="/locations" className="shrink-0 text-sm font-semibold text-brand">All {LOCATIONS.length} stores →</Link>
          </div>
          <p className="mt-3 max-w-2xl text-slate-600">Open every day from 8 am to 6 pm in Centro and the Marina area, with English and Spanish service.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.slice(0, 3).map((l) => <StoreCard key={l.slug} l={l} />)}
          </div>
        </div>
      </section>

      {/* Delivery to every hotel */}
      <section className="section" aria-labelledby="areas">
        <div className="flex items-end justify-between gap-4">
          <div><p className={eyebrow}>We come to you</p><h2 id="areas" className="h2 mt-2">We deliver to every hotel in Los Cabos</h2></div>
          <Link href="/delivery-areas" className="shrink-0 text-sm font-semibold text-brand">Find your hotel →</Link>
        </div>
        <p className="mt-3 max-w-2xl text-slate-600">Any hotel, resort, villa or vacation rental in Cabo San Lucas, San José del Cabo and the Corridor. A few we deliver to every day:</p>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {hotels.slice(0, 16).map((p) => (
            <li key={p.slug}><Link href={`/${p.slug}`} className="inline-block rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand-soft hover:text-brand">{hotelName(p.title)}</Link></li>
          ))}
          <li><Link href="/delivery-areas" className="inline-block rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">+ Your hotel, too</Link></li>
        </ul>
      </section>

      {/* International insurance (master data §2.1) */}
      <section className="mx-auto max-w-4xl px-4 pb-4" aria-label="International insurance">
        <InsuranceNotice />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="faq">
        <h2 id="faq" className="h2 text-center">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-center text-sm"><Link href="/faq" className="font-semibold text-brand">More answers →</Link></p>
      </section>

      {/* Blog */}
      {blog.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-4" aria-labelledby="blog">
          <div className="flex items-end justify-between gap-4">
            <h2 id="blog" className="h2">Travel health guides for Cabo</h2>
            <Link href="/blog" className="shrink-0 text-sm font-semibold text-brand">All guides →</Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {blog.map((p) => (
              <article key={p.slug} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-brand hover:shadow-lg">
                <Link href={`/${p.slug}`} className="block aspect-[16/9] overflow-hidden bg-slate-100" aria-hidden tabIndex={-1}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" width={640} height={360} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <PostCover slug={p.slug} className="h-full w-full transition duration-500 group-hover:scale-105" />
                  )}
                </Link>
                <div className="p-5">
                  <h3 className="font-semibold leading-snug"><Link href={`/${p.slug}`} className="hover:text-brand">{p.title}</Link></h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Final call to action */}
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-teal-500 px-6 py-12 text-center text-white shadow-xl md:px-12">
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10" />
          <h2 className="relative text-3xl font-extrabold tracking-tight md:text-4xl">Need something from the pharmacy?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-teal-50">Message us in English or Spanish. We deliver to your hotel or villa every day, 7 am – 11 pm.</p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <a href={SITE.tel} className="btn !px-6 !py-3.5 bg-white text-brand hover:bg-teal-50">Call {SITE.phone}</a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener" className="btn !px-6 !py-3.5 !bg-[#25d366] text-[#05301b] hover:!bg-[#2ee170]">WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  );
}
