import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { posts } from "@/lib/content";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";

const REVIEWS = [
  { q: "They delivered my prescription to our hotel in Cabo within 45 minutes. English-speaking staff and the pharmacist even called to confirm dosage. Absolute lifesavers.", n: "Sarah M.", w: "Vermont, USA" },
  { q: "Best pharmacy experience in Cabo. Ordered at midnight and had my meds by 8 AM. The team is incredibly professional and speaks perfect English.", n: "John D.", w: "Toronto, Canada" },
  { q: "As a diabetic traveling from Canada, finding reliable insulin in Cabo was a worry. CMC Pharmacy made it seamless — even helped with COFEPRIS paperwork.", n: "Emma R.", w: "Vancouver, Canada" },
  { q: "Their video consultation with Dr. Rossy was a game-changer. Got my Rx same day, delivered to Pedregal. Wouldn't trust anywhere else in Cabo.", n: "Michael T.", w: "Chicago, USA" },
  { q: "Called them at 2am when my son had a fever. Delivered antibiotics + Tylenol within an hour to Palmilla. English speaking, professional.", n: "David K.", w: "Seattle, USA" },
  { q: "COFEPRIS certified, 5-star service, English fluent staff, 24/7 delivery to our resort in San Jose del Cabo. If you're traveling to Cabo, save their number NOW.", n: "Robert H.", w: "Denver, USA" },
];

const SERVICES = [
  { t: "24/7 Pharmacy Delivery", d: "Prescriptions, OTC and travel essentials delivered to your hotel, resort or villa — typically within the hour.", href: "/24-7-pharmacy-delivery-cabo-san-lucas" },
  { t: "English-Speaking Doctors", d: "Video consultations and hotel visits with bilingual physicians, available now.", href: "/doctor-consultation" },
  { t: "IV Therapy", d: "Medical-grade hydration, recovery and immunity drips administered where you stay.", href: "/iv-therapy" },
  { t: "For Concierges", d: "End-to-end guest medical support for hotels, resorts and property managers.", href: "/for-concierges" },
];

const FAQ = [
  { q: "How fast is pharmacy delivery in Cabo?", a: "Most orders arrive within 60–90 minutes anywhere in Cabo San Lucas, San José del Cabo and the Corridor." },
  { q: "Do you deliver to hotels, resorts, and Airbnbs?", a: "Yes. We deliver discreetly and securely to hotels, resorts, villas and rentals across Los Cabos." },
  { q: "Is there a 24 hour pharmacy in Cabo San Lucas?", a: "Yes — CMC Pharmacy is available 24/7 by phone and WhatsApp, with a pharmacist always on call." },
  { q: "Can I order prescriptions from an English-speaking pharmacy?", a: "Absolutely. Our pharmacists and doctors are fully bilingual and can guide you through COFEPRIS requirements." },
  { q: "Do you provide urgent care?", a: "We connect you with English-speaking doctors by video or in-person visits at your hotel." },
];

export default function Home() {
  const featured = products.filter((p) => p.img).slice(0, 8);
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-surface to-bg">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
          <div className="mb-6 flex flex-wrap justify-center gap-2 text-xs">
            <span className="rounded-full border border-line bg-surface px-3 py-1">✓ LegitScript Certified</span>
            <span className="rounded-full border border-line bg-surface px-3 py-1">✓ COFEPRIS Licensed</span>
            <span className="rounded-full border border-line bg-surface px-3 py-1">★ Google 5.0 · 89 reviews</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">Cabo San Lucas’ <span className="text-mint">#1 Pharmacy</span> Delivery</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            24/7 delivery · English support · COFEPRIS certified. Trusted pharmacy &amp; English-speaking doctors in Cabo San Lucas &amp; San José del Cabo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={SITE.tel} className="btn btn-cta">Order now – 24/7 delivery</a>
            <Link href="/doctor-consultation" className="btn btn-ghost">Talk to a doctor</Link>
          </div>
          <p className="mt-4 text-sm text-muted">{SITE.phone} · Delivered to your hotel within the hour</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Everything your trip needs, delivered</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link key={s.t} href={s.href} className="rounded-2xl border border-line bg-surface p-6 transition hover:border-mint">
              <h3 className="font-semibold text-mint">{s.t}</h3>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">Who we are</p>
            <h2 className="mt-2 text-3xl font-bold">Trusted by 10,000+ travelers across Los Cabos</h2>
            <p className="mt-4 text-muted">Skip the pharmacy lines. CMC Pharmacy delivers COFEPRIS-certified medications, prescriptions and OTC essentials directly to your hotel, resort or villa. Bilingual pharmacists available 24/7.</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["24/7 delivery to hotels, resorts & villas", "English-speaking pharmacists on call", "COFEPRIS certified & LegitScript verified", "Prescription meds + OTC + travel essentials", "Free delivery on orders $99+"].map((t) => <li key={t}>✓ {t}</li>)}
            </ul>
            <Link href="/shop" className="btn btn-mint mt-6">Order now →</Link>
          </div>
          <Image src="/wp-content/uploads/2026/07/cabo-pharmacy-english-speaking-pharmacist-cmc.png" alt="English-speaking pharmacist at CMC Pharmacy Cabo" width={800} height={800} className="rounded-2xl" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Popular products</h2>
          <Link href="/shop" className="text-sm text-mint">View all →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold">What customers say</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.n} className="rounded-2xl border border-line bg-bg p-6">
                <p className="text-mint">★★★★★</p>
                <blockquote className="mt-3 text-sm text-muted">“{r.q}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">{r.n} <span className="font-normal text-muted">· {r.w}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-xl border border-line bg-surface p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center"><Link href="/faq" className="text-mint">More answers →</Link></p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="text-3xl font-bold">From the blog</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {posts().slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/${p.slug}`} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-mint">
              <h3 className="font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{p.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
