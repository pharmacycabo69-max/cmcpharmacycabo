import type { Metadata } from "next";
import { EsServicePage } from "@/components/EsServicePage";

export const metadata: Metadata = {
  title: { absolute: "Sueroterapia a domicilio en Cabo San Lucas desde $159" },
  description: "Sueroterapia (IV) en tu hotel o villa en Los Cabos: IV $159, multivitamínico $189 y NAD+ $279 USD con impuestos, previa valoración médica. Anticipo al confirmar.",
  alternates: { canonical: "/es/sueroterapia", languages: { en: "/iv-therapy", es: "/es/sueroterapia" } },
  openGraph: { url: "/es/sueroterapia", locale: "es_MX" },
};

export default function Sueroterapia() {
  return (
    <EsServicePage
      hero={{
        crumbs: [{ name: "Sueroterapia", href: "/es/sueroterapia" }],
        eyebrow: "Sueroterapia · Hotel, villa o clínica",
        title: "Sueroterapia a domicilio en Cabo San Lucas",
        lead: "Sueros administrados por personal de salud autorizado, después de una valoración médica, en tu hotel, villa o en nuestra farmacia. El anticipo se paga solo cuando confirmamos tu horario.",
        actions: [{ href: "/book?service=iv-therapy", label: "Reservar sueroterapia", primary: true }, { href: "/book?service=nad", label: "NAD+ · $279" }],
        points: ["Valoración médica previa", "Personal de enfermería", "Anticipo del 50% al confirmar"],
        boardTitle: "Precios en hotel o villa",
        board: [
          { label: "Sueroterapia (IV)", note: "Hidratación, recuperación, jet lag y más", price: "$159", href: "/book?service=iv-therapy" },
          { label: "Multivitamínico (Myers)", note: "Mezcla clásica de vitaminas y minerales", price: "$189", href: "/book?service=iv-therapy&option=myers-cocktail-classic" },
          { label: "NAD+", note: "NAD+ con hidratación", price: "$279", href: "/book?service=nad" },
          { label: "Grupos de 3 o más", note: "Villas, bodas y eventos", price: "Cotización" },
        ],
      }}
      includes={[
        { t: "Valoración médica", d: "Revisamos tu historial y descartamos contraindicaciones antes de cualquier suero." },
        { t: "Aplicación supervisada", d: "Personal de enfermería aplica y vigila el suero durante toda la sesión, de 45 a 60 minutos." },
        { t: "Precios claros", d: "Precios en dólares con impuestos incluidos; el saldo se paga después del servicio." },
      ]}
      steps={["Elige el suero y tu horario preferido.", "Envía la referencia por WhatsApp.", "Valoración y confirmación del horario; pagas el anticipo.", "Te atendemos en tu hotel, villa o en la farmacia."]}
      faq={[
        { q: "¿Necesito valoración médica?", a: "Sí. Antes de cualquier suero hacemos una valoración breve para confirmar que es adecuado para ti." },
        { q: "¿Cuándo pago?", a: "Al reservar no se cobra nada. Cuando confirmamos tu horario pagas un anticipo del 50% en línea y el resto después del servicio." },
        { q: "¿Prometen resultados?", a: "No. La sueroterapia no sustituye la atención médica y no garantizamos resultados." },
        { q: "¿Hacen sueros para grupos?", a: "Sí, para grupos de 3 o más personas te enviamos una cotización." },
      ]}
      english={{ href: "/iv-therapy", label: "Read in English →" }}
    />
  );
}
