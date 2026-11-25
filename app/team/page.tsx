import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LOCATIONS } from "@/lib/locations";
import { JsonLd, orgId } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";
import { DOCTOR, MEDICAL_PRICES } from "@/lib/team";

export const metadata: Metadata = {
  title: { absolute: "Our Doctor & Pharmacy Team in Cabo San Lucas | CMC Pharmacy" },
  description: `Meet ${DOCTOR.name}, physician at ${DOCTOR.clinic}, and the pharmacy teams of our ${LOCATIONS.length} pharmacies in Cabo San Lucas. English and Spanish.`,
  alternates: { canonical: "/team" },
};

/** Team page. Only owner-approved profiles are published (master data §3.1): no other names, licenses or photos. */
const TEAM_PHOTOS = [
  { src: "/locations/mercado-marina/03-team.jpg", w: 1600, h: 1069, alt: "Pharmacy team at our Mercado Marina pharmacy", place: "Mercado Marina", slug: "mercado-marina" },
  { src: "/locations/plaza-gali/05-counter-team.jpg", w: 1600, h: 1069, alt: "Pharmacist at the counter of our Plaza Gali pharmacy", place: "Plaza Gali", slug: "plaza-gali" },
  { src: "/locations/ocean/03-team-service.jpg", w: 1600, h: 1069, alt: "Pharmacy team serving a customer at our Ocean pharmacy", place: "Ocean, Marina", slug: "ocean" },
];

export default function TeamPage() {
  const person = {
    "@context": "https://schema.org", "@type": "Physician", name: DOCTOR.name, image: abs(DOCTOR.photo),
    knowsLanguage: DOCTOR.languages, medicalSpecialty: "PrimaryCare", worksFor: { "@id": orgId },
    hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "Cédula profesional", identifier: DOCTOR.license, recognizedBy: { "@type": "Organization", name: "Secretaría de Educación Pública" } },
    alumniOf: { "@type": "CollegeOrUniversity", name: DOCTOR.school },
  };
  return (
    <>
      <JsonLd data={person} />
      <section className="bg-navy-deep text-white">
        <div className="mx-auto grid max-w-[76rem] items-center gap-10 px-4 py-14 md:grid-cols-[1fr_340px]">
          <div>
            <div className="[&_a]:text-white/70 [&_li]:text-white/70"><Breadcrumbs items={[{ name: "Our team", href: "/team" }]} /></div>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">The people who take care of you in Cabo</h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">A licensed physician for consultations and the pharmacy teams of the {SITE.parent} network, in English and Spanish.</p>
          </div>
          <Image src={DOCTOR.photo} alt={`${DOCTOR.name}, physician at ${DOCTOR.clinic}`} width={720} height={900} priority sizes="340px" className="aspect-[4/5] w-full rounded-3xl object-cover ring-1 ring-white/15" />
        </div>
      </section>

      <section className="section grid gap-10 md:grid-cols-[1.2fr_1fr]" aria-labelledby="dr">
        <div>
          <p className="eyebrow">Physician</p>
          <h2 id="dr" className="h2 mt-2">{DOCTOR.name}</h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {[["Degree", DOCTOR.degree], ["University", DOCTOR.school], ["Professional license (cédula)", DOCTOR.license], ["Clinic", DOCTOR.clinic], ["Languages", DOCTOR.languages.join(" & ")], ["Sees patients", "By video, at the clinic and at your hotel or villa"]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-surface p-4"><dt className="text-xs font-semibold uppercase tracking-wider text-brand">{k}</dt><dd className="mt-1 text-sm font-medium text-navy">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="card h-fit p-6">
          <h3 className="font-display text-xl font-bold text-navy">Book a consultation</h3>
          <ul className="mt-4 divide-y divide-line">
            {[["Video consultation", MEDICAL_PRICES.video, "video"], ["Walk-in consultation", MEDICAL_PRICES.clinic, "walk-in"], ["Home doctor", MEDICAL_PRICES.hotel, "home-doctor"]].map(([t, p, id]) => (
              <li key={String(id)}><Link href={`/book?service=${id}`} className="flex items-center justify-between py-3 text-sm font-semibold text-navy hover:text-brand">{t}<span className="text-brand">${p} →</span></Link></li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">USD, taxes included. Paid online after we confirm your time.</p>
        </div>
      </section>

      <section className="bg-surface" aria-labelledby="pharm">
        <div className="section">
          <p className="eyebrow">Pharmacy teams</p>
          <h2 id="pharm" className="h2 mt-2">Behind every delivery: real pharmacies in Cabo San Lucas</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {TEAM_PHOTOS.map((p) => (
              <figure key={p.src} className="card overflow-hidden">
                <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="flex items-center justify-between p-4 text-sm"><span className="font-semibold text-navy">{p.place}</span><Link href={`/locations/${p.slug}`} className="font-semibold text-brand hover:underline">Visit →</Link></figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-600">Aesthetic medicine is provided by its own division; see <Link href="/aesthetic-medicine" className="font-semibold text-brand">aesthetic medicine</Link>.</p>
        </div>
      </section>
    </>
  );
}
