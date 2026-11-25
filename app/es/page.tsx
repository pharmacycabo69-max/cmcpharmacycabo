import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "@/components/HeroSearch";
import { IconArrow, IconCard, IconDrip, IconFlask, IconPill, IconSparkle, IconStethoscope } from "@/components/Icons";
import { LOCATIONS } from "@/lib/locations";
import { JsonLd, faqSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { DOCTOR, MEDICAL_PRICES } from "@/lib/team";

export const metadata: Metadata = {
  title: { absolute: "Farmacia a domicilio en Cabo San Lucas | CMC Pharmacy Cabo" },
  description: "Farmacia a domicilio en Cabo San Lucas y San José del Cabo, de 7 am a 11 pm. Médico a domicilio, videoconsulta, sueroterapia y estudios. Envío gratis desde $59 USD.",
  alternates: { canonical: "/es", languages: { en: "/", es: "/es", "x-default": "/" } },
  openGraph: { url: "/es", locale: "es_MX", title: "Farmacia a domicilio en Cabo San Lucas | CMC Pharmacy Cabo" },
};

const INTENTS = [
  { icon: IconPill, t: "Necesito medicamentos", d: "Arma tu solicitud; un farmacéutico confirma disponibilidad y total.", href: "/shop" },
  { icon: IconStethoscope, t: "Necesito un médico", d: `Video $${MEDICAL_PRICES.video}, clínica $${MEDICAL_PRICES.clinic}, en tu hotel $${MEDICAL_PRICES.hotel} USD.`, href: "/es/medico" },
  { icon: IconDrip, t: "Necesito sueroterapia", d: "En tu hotel o villa, después de una valoración médica.", href: "/es/sueroterapia" },
  { icon: IconFlask, t: "Necesito un estudio", d: "Laboratorio, rayos X y ultrasonido, coordinados por nuestros médicos.", href: "/es/laboratorio" },
  { icon: IconCard, t: "Tengo seguro de viaje", d: "Pólizas de EE. UU. y Canadá, verificadas antes de la consulta.", href: "/international-insurance" },
  { icon: IconSparkle, t: "Medicina estética", d: "Labios, toxina botulínica, rejuvenecimiento y luminosidad facial.", href: "/aesthetic-medicine" },
];

const FAQ = [
  { q: "¿Hay una farmacia cerca de mí en Cabo San Lucas?", a: `Sí. La red ${SITE.parent} tiene ${LOCATIONS.length} farmacias en Cabo San Lucas abiertas todos los días de 8 am a 6 pm, y ${SITE.name}, su servicio a domicilio, entrega en hoteles, villas y casas de 7 am a 11 pm.` },
  { q: "¿Cuánto cuesta el envío?", a: `Es gratis en pedidos desde $${SITE.freeDeliveryFrom} USD. En pedidos menores confirmamos el costo de envío junto con el total antes de salir.` },
  { q: "¿Pago en línea?", a: "No en pedidos de farmacia: envías tu solicitud, un farmacéutico confirma disponibilidad y total, y pagas por el medio que acordemos. Algunos servicios médicos, como la sueroterapia, piden un anticipo al reservar." },
  { q: "¿Venden medicamentos con receta?", a: "Solo con receta médica válida, como exige la ley mexicana. Si no tienes una, nuestros médicos te atienden por video, en la clínica o en tu hotel." },
  { q: "¿Aceptan seguros internacionales?", a: "Aceptamos seguros internacionales de gastos médicos y de viaje de Estados Unidos y Canadá, sujetos a verificación de la póliza y confirmación de cobertura, antes de recibir servicios médicos." },
  { q: "¿Es un servicio de urgencias?", a: "No. En una emergencia llama al 911 o acude al hospital más cercano." },
];

export default function Inicio() {
  return (
    <div lang="es">
      <JsonLd data={faqSchema(FAQ)} />
      <section className="bg-surface">
        <div className="mx-auto grid max-w-[76rem] items-center gap-10 px-4 pb-14 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy ring-1 ring-line"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />Farmacéuticos por WhatsApp de 7 am a 11 pm</p>
            <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-navy sm:text-6xl">¿Cómo podemos ayudarte hoy?</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">Atención médica y farmacia a domicilio en Los Cabos. Farmacéuticos y médicos bilingües, en tu hotel, villa o casa.</p>
            <HeroSearch lang="es" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/request" className="btn btn-primary !py-3.5">Solicitar disponibilidad de medicamentos</Link>
              <Link href="/book" className="btn btn-navy !py-3.5">Reservar atención médica</Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">Catálogo, reservas y fichas de producto en inglés por ahora; te atendemos en español por WhatsApp ({SITE.whatsappDisplay}) o teléfono ({SITE.phone}).</p>
          </div>
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] shadow-2xl shadow-navy/20">
            <Image src="/locations/plaza-gali/05-counter-team.jpg" alt="Farmacéutica en el mostrador de nuestra farmacia Plaza Gali en Cabo San Lucas" fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="section !pt-14" aria-labelledby="es-int">
        <h2 id="es-int" className="sr-only">¿Qué necesitas?</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTENTS.map(({ icon: I, t, d, href }) => (
            <li key={t}><Link href={href} className="card card-hover group flex h-full gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><I className="h-6 w-6" /></span>
              <span><span className="block font-display text-lg font-bold text-navy">{t}</span><span className="mt-1 block text-sm text-slate-600">{d}</span></span>
            </Link></li>
          ))}
        </ul>
      </section>

      <section className="bg-sand" aria-labelledby="es-como">
        <div className="section">
          <p className="eyebrow">Cómo funciona</p>
          <h2 id="es-como" className="h2 mt-2">De tu solicitud a tu puerta</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {[["Dinos qué necesitas", "Agrega productos a tu solicitud o envíanos una lista o foto de la caja por WhatsApp."], ["Un farmacéutico confirma", "Disponibilidad, requisitos de receta, precio total y hora de entrega, antes de cobrar."], ["Te lo entregamos", "En tu hotel, villa o casa, todos los días de 7 am a 11 pm. Algunos hoteles solo reciben en recepción: coordinamos la entrega contigo."]].map(([t, d], i) => (
              <li key={t} className="card p-6"><span className="font-display text-sm font-bold text-brand">0{i + 1}</span><h3 className="mt-2 font-semibold text-navy">{t}</h3><p className="mt-2 text-sm text-slate-600">{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section grid items-center gap-10 md:grid-cols-[280px_1fr]" aria-labelledby="es-med">
        <Image src={DOCTOR.photo} alt={`${DOCTOR.name}, médico de ${DOCTOR.clinic}`} width={720} height={900} sizes="280px" className="w-full max-w-[280px] rounded-2xl object-cover" />
        <div>
          <p className="eyebrow">Tu médico en Los Cabos</p>
          <h2 id="es-med" className="h2 mt-2">Médico a domicilio, en clínica o por video</h2>
          <p className="mt-3 text-slate-600">Consulta con {DOCTOR.name}, médico cirujano y partero ({DOCTOR.school}), cédula profesional {DOCTOR.license}, de {DOCTOR.clinic}. Precios en USD con impuestos incluidos.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {[["Videoconsulta", MEDICAL_PRICES.video], ["Consulta en clínica", MEDICAL_PRICES.clinic], ["Médico en tu hotel", MEDICAL_PRICES.hotel]].map(([k, v]) => (
              <li key={String(k)} className="card p-4 text-center"><p className="font-display text-2xl font-extrabold text-brand">${v}</p><p className="text-sm text-slate-600">{k}</p></li>
            ))}
          </ul>
          <Link href="/es/medico" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand">Ver opciones y reservar<IconArrow /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-6" aria-labelledby="es-faq">
        <h2 id="es-faq" className="h2 text-center">Preguntas frecuentes</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-navy">{f.q}<span aria-hidden className="text-xl text-brand transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
