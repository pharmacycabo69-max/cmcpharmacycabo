import type { Metadata } from "next";
import { EsServicePage } from "@/components/EsServicePage";
import catalog from "@/content/lab-imaging.json";

export const metadata: Metadata = {
  title: { absolute: "Laboratorio clínico en Cabo San Lucas: análisis y estudios" },
  description: "Análisis de sangre, orina y heces en Los Cabos, coordinados por nuestros médicos con laboratorios aliados. Cotización antes de cualquier cobro; rayos X en su propia página.",
  alternates: { canonical: "/es/laboratorio", languages: { en: "/lab-tests-imaging", es: "/es/laboratorio" } },
  openGraph: { url: "/es/laboratorio", locale: "es_MX" },
};

const count = catalog.lab.reduce((n, a) => n + a.tests.length, 0);

export default function Laboratorio() {
  return (
    <EsServicePage
      hero={{
        crumbs: [{ name: "Laboratorio e imagen", href: "/es/laboratorio" }],
        eyebrow: "Diagnóstico · Laboratorios y centros de imagen aliados",
        title: "Laboratorio clínico en Cabo San Lucas",
        lead: "Análisis de sangre, orina y heces y perfiles hormonales, coordinados por nuestro equipo médico con laboratorios aliados. Validamos los estudios y te enviamos una cotización antes de cobrar.",
        actions: [{ href: "/book?service=lab", label: "Cotizar laboratorio", primary: true }, { href: "/es/rayos-x", label: "¿Necesitas rayos X?" }],
        points: [`${count} estudios de laboratorio`, "Laboratorios aliados", "Cotización primero"],
        boardTitle: "Cómo se cotiza",
        board: [
          { label: "Análisis de laboratorio", note: "Con laboratorios aliados", price: "Cotización", href: "/book?service=lab" },
          { label: "Rayos X", note: "Servicio aparte con un centro de imagen aliado", price: "Cotización", href: "/es/rayos-x" },
          { label: "¿No sabes qué estudio?", note: "Videoconsulta primero", price: "$59", href: "/book?service=video" },
        ],
      }}
      includes={[
        { t: "Coordinación médica", d: "Nuestros médicos revisan qué estudio necesitas y con qué proveedor hacerlo." },
        { t: "Cotización por escrito", d: "Precio, lugar y tiempo de resultados confirmados antes de cualquier cobro." },
        { t: "Atención bilingüe", d: "Te acompañamos en español o inglés durante todo el proceso." },
      ]}
      steps={["Envía la orden médica o dinos qué necesitas.", "Validamos el estudio con el proveedor.", "Recibes la cotización y la apruebas.", "Agendamos y te enviamos las indicaciones."]}
      faq={[
        { q: "¿Necesito orden médica?", a: "Para algunos estudios sí. Si no la tienes, uno de nuestros médicos puede valorarte por video ($59 USD)." },
        { q: "¿Quién realiza los estudios?", a: "Laboratorios y centros de imagen aliados en Cabo San Lucas; nuestro equipo los coordina." },
        { q: "¿Cuándo pago?", a: "Solo después de aprobar la cotización. No se cobra nada al solicitarla." },
      ]}
      english={{ href: "/lab-tests-imaging", label: "Read in English →" }}
    />
  );
}
