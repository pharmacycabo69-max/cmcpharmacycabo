import type { Metadata } from "next";
import { EsServicePage } from "@/components/EsServicePage";
import catalog from "@/content/lab-imaging.json";

export const metadata: Metadata = {
  title: { absolute: "Rayos X en Cabo San Lucas: cotización antes de pagar" },
  description: "Radiografías de tórax, extremidades y columna en Cabo San Lucas con un centro de imagen aliado, coordinadas por nuestros médicos. Cotización y disponibilidad antes de pagar.",
  alternates: { canonical: "/es/rayos-x", languages: { en: "/x-ray-cabo", es: "/es/rayos-x" } },
  openGraph: { url: "/es/rayos-x", locale: "es_MX" },
};

const ES: Record<string, string> = {
  "Chest X-ray": "Radiografía de tórax",
  "Extremity X-ray (hand, wrist, elbow, shoulder, knee, ankle, foot)": "Radiografía de extremidades (mano, muñeca, codo, hombro, rodilla, tobillo, pie)",
  "Spine X-ray (cervical, thoracic, lumbar)": "Radiografía de columna (cervical, torácica, lumbar)",
};

export default function RayosX() {
  return (
    <EsServicePage
      hero={{
        crumbs: [{ name: "Rayos X", href: "/es/rayos-x" }],
        eyebrow: "Imagen diagnóstica · Centro de imagen aliado",
        title: "Rayos X en Cabo San Lucas",
        lead: "Radiografías coordinadas por nuestro equipo médico con un centro de imagen aliado. Validamos el estudio, confirmamos disponibilidad y te enviamos la cotización antes de cobrar.",
        actions: [{ href: "/book?service=imaging", label: "Cotizar rayos X", primary: true }, { href: "/book?service=video", label: "Médico primero · $59" }],
        points: ["Cotización primero", "Español e inglés"],
        boardTitle: "Estudios disponibles",
        board: [...catalog.imaging.map((t) => ({ label: ES[t] ?? t, price: "Cotización", href: "/book?service=imaging" })), { label: "Ultrasonido", note: "No disponible por ahora", price: "—" }],
      }}
      includes={[
        { t: "Validación médica", d: "Revisamos el estudio que necesitas y la orden médica si la tienes." },
        { t: "Cotización por escrito", d: "Lugar, preparación, precio y entrega del reporte confirmados antes de cobrar." },
        { t: "Rayos X móvil", d: "Solo cuando el centro aliado confirma que es técnicamente viable para tu caso." },
      ]}
      steps={["Solicita la cotización del estudio.", "Validamos con el centro aliado y confirmamos disponibilidad.", "Aceptas la cotización y pagas con un enlace seguro.", "Estudio a la hora confirmada y entrega del reporte."]}
      faq={[
        { q: "¿Qué radiografías ofrecen?", a: "Tórax, extremidades y columna. Por ahora no ofrecemos ultrasonido." },
        { q: "¿Quién interpreta el estudio?", a: "El equipo de radiología del centro aliado; sus nombres y credenciales se confirman con la cotización." },
        { q: "¿Cuándo pago?", a: "Solo después de aceptar la cotización y confirmar la cita." },
      ]}
      english={{ href: "/x-ray-cabo", label: "Read in English →" }}
    />
  );
}
