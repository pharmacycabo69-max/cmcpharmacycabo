import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OpenStatus } from "@/components/OpenStatus";
import { DAYS, DAY_LABEL, formatRange, hoursSummary } from "@/lib/hours";
import { LOCATIONS, fullAddress, getLocation, locationTitle, telHref, waHref } from "@/lib/locations";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => LOCATIONS.map((l) => ({ slug: l.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = getLocation((await params).slug);
  if (!l) return {};
  const description = `${l.gbpName}, ${l.addressLine}. ${hoursSummary(l.hours)}. Call ${l.phone}.${l.delivers ? " Delivery to hotels and villas, estimated up to 70 minutes." : ""}`;
  return {
    title: { absolute: locationTitle(l) },
    description,
    alternates: { canonical: `/locations/${l.slug}` },
    openGraph: { title: locationTitle(l), description, url: `/locations/${l.slug}`, images: [l.photos[0].src] },
  };
}

const mapSrc = (l: NonNullable<ReturnType<typeof getLocation>>) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${l.gbpName}, ${l.addressLine}, Cabo San Lucas`)}&ll=${l.geo.lat},${l.geo.lng}&z=17&hl=en&output=embed`;

export default async function LocationPage({ params }: Props) {
  const l = getLocation((await params).slug);
  if (!l) notFound();
  const others = LOCATIONS.filter((o) => o.slug !== l.slug);
  const url = abs(`/locations/${l.slug}`);
  const schema = {
    "@context": "https://schema.org", "@type": "Pharmacy", "@id": `${url}#pharmacy`, name: l.gbpName, url,
    image: l.photos.map((p) => abs(p.src)), telephone: l.phone, priceRange: "$$",
    address: { "@type": "PostalAddress", streetAddress: l.addressLine, addressLocality: l.city, addressRegion: l.region, postalCode: l.postalCode, addressCountry: "MX" },
    geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng },
    openingHoursSpecification: DAYS.filter((d) => l.hours[d]).map((d) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAY_LABEL[d], opens: l.hours[d]!.opens, closes: l.hours[d]!.closes })),
    hasMap: l.mapsUrl, areaServed: ["Cabo San Lucas", "San José del Cabo"],
  };
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={schema} />
      <JsonLd data={faqSchema(l.faq)} />
      <Breadcrumbs items={[{ name: "Locations", href: "/locations" }, { name: `${l.gbpName} · ${l.placeLabel}`, href: `/locations/${l.slug}` }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{l.gbpName}</h1>
      <p className="mt-1 text-slate-600">{l.neighborhood}, Cabo San Lucas</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <address className="not-italic leading-relaxed text-slate-700">{fullAddress(l)}<br /><a href={telHref(l)} className="font-semibold text-brand">{l.phone}</a></address>
          <p className="mt-3"><OpenStatus hours={l.hours} /></p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={telHref(l)} className="btn btn-primary">Call</a>
            <a href={waHref(l)} target="_blank" rel="noopener" className="btn btn-outline">WhatsApp</a>
            <a href={l.mapsUrl} target="_blank" rel="noopener" className="btn btn-outline">Directions</a>
          </div>
        </div>
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 text-sm" aria-label="Opening hours">
          {DAYS.map((d) => <li key={d} className="flex justify-between px-4 py-2"><span className="text-slate-600">{DAY_LABEL[d]}</span><span className="font-medium">{formatRange(l.hours[d])}</span></li>)}
        </ul>
      </div>

      <iframe src={mapSrc(l)} title={`Map: ${l.gbpName}, ${l.placeLabel}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="mt-8 h-72 w-full rounded-xl border border-slate-200" />

      <section className="mt-10" aria-label="Photos">
        <div className="grid gap-3 sm:grid-cols-3">
          {l.photos.map((p, i) => (
            <Image key={p.src} src={p.src} alt={p.alt} width={p.width} height={p.height} priority={i === 0} sizes="(min-width: 640px) 33vw, 100vw"
              className={`w-full rounded-xl object-cover ${i === 0 ? "aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full" : "aspect-[4/3]"}`} />
          ))}
        </div>
      </section>

      <section className="prose-cmc mt-10">{l.intro.split("\n\n").map((para) => <p key={para}>{para}</p>)}</section>

      <section className="mt-12" aria-labelledby="svc">
        <h2 id="svc" className="h2">Services</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {[["/iv-therapy", "IV therapy at your hotel or villa"], ["/doctor-consultation", "Doctor consultation"], ["/delivery-areas", "Pharmacy delivery"]].map(([href, label]) => (
            <li key={href}><Link href={href} className="block h-full rounded-xl border border-slate-200 p-4 text-sm font-medium transition hover:border-brand hover:text-brand">{label}</Link></li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="faq">
        <h2 id="faq" className="h2">Frequently asked questions</h2>
        <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {l.faq.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {l.reviewUrl && <p className="mt-8 text-sm"><a href={l.reviewUrl} target="_blank" rel="noopener" className="font-medium text-brand">Leave a Google review for {l.gbpName} →</a></p>}

      <section className="mt-12" aria-labelledby="others">
        <h2 id="others" className="h2">Other stores</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {others.map((o) => <li key={o.slug}><Link href={`/locations/${o.slug}`} className="text-brand hover:underline">{o.gbpName} · {o.addressLine}</Link></li>)}
        </ul>
      </section>
    </div>
  );
}
