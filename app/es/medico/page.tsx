import type { Metadata } from "next";
import { EsServicePage } from "@/components/EsServicePage";
import { DOCTOR, MEDICAL_PRICES } from "@/lib/team";

export const metadata: Metadata = {
  title: { absolute: "Médico a domicilio en Los Cabos: video $59, hotel $189" },
  description: "Médico bilingüe en Cabo San Lucas: videoconsulta $59, consulta en clínica $99 y médico a domicilio u hotel $189 USD con impuestos. Pagas al confirmar la cita.",
  alternates: { canonical: "/es/medico", languages: { en: "/doctor-consultation", es: "/es/medico" } },
  openGraph: { url: "/es/medico", locale: "es_MX" },
};

export default function Medico() {
  return (
    <EsServicePage
      hero={{
        crumbs: [{ name: "Médico", href: "/es/medico" }],
        eyebrow: "Médicos bilingües · Los Cabos",
        title: "Médico a domicilio, en clínica o por video en Los Cabos",
        lead: "Consulta médica general en tu hotel, villa o casa, en nuestra clínica del Centro o por videollamada. Reservas en línea y pagas solo cuando confirmamos el horario.",
        actions: [{ href: "/book?service=home-doctor", label: `Médico a domicilio · $${MEDICAL_PRICES.hotel}`, primary: true }, { href: "/book?service=video", label: `Videoconsulta · $${MEDICAL_PRICES.video}` }],
        points: ["Cédula profesional " + DOCTOR.license, "Español e inglés", "Receta cuando corresponde"],
        photo: { src: DOCTOR.photo, alt: `${DOCTOR.name}, médico de ${DOCTOR.clinic}`, caption: `${DOCTOR.name} · ${DOCTOR.clinic}` },
      }}
      includes={[
        { t: `Videoconsulta · $${MEDICAL_PRICES.video} USD`, d: "Desde tu habitación, con orientación médica, receta cuando corresponde y canalización si hace falta." },
        { t: `Consulta en clínica · $${MEDICAL_PRICES.clinic} USD`, d: "En Cabo Walk-In Clinic, Centro de Cabo San Lucas, todos los días de 9:00 a 17:00; fuera de ese horario, con cita y según disponibilidad." },
        { t: `Médico a domicilio u hotel · $${MEDICAL_PRICES.hotel} USD`, d: "El médico va a tu hotel, villa o casa en Cabo San Lucas, San José del Cabo y el Corredor." },
      ]}
      steps={["Elige la consulta y tu horario preferido.", "Recibes una referencia y la envías por WhatsApp.", "Confirmamos disponibilidad y te enviamos el enlace de pago.", "El médico te atiende a la hora confirmada."]}
      faq={[
        { q: "¿El precio incluye impuestos?", a: "Sí. Los precios están en dólares estadounidenses con impuestos incluidos." },
        { q: "¿Cuándo pago?", a: "Después de que nuestro equipo confirma tu horario por WhatsApp. Al reservar no se cobra nada." },
        { q: "¿Aceptan seguros internacionales?", a: "Aceptamos seguros de gastos médicos y de viaje de Estados Unidos y Canadá, sujetos a verificación de la póliza y confirmación de cobertura antes de la consulta." },
        { q: "¿Atienden urgencias?", a: "No somos un servicio de urgencias. En una emergencia llama al 911 o acude al hospital más cercano." },
      ]}
      english={{ href: "/doctor-consultation", label: "Read in English →" }}
    />
  );
}
