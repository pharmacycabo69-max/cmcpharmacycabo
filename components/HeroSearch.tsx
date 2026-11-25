import { IconSearch } from "@/components/Icons";
import { publicServices } from "@/lib/services";

/** Common traveler searches, offered as suggestions while typing (native datalist: no JavaScript needed). */
const SUGGESTIONS = ["Sunscreen", "Electrolytes", "Ibuprofen", "Paracetamol", "Loperamide", "Allergy", "Motion sickness", "Insect repellent", "Aloe vera", "Antacid", "Band-aids", "Thermometer"];
const AREAS = ["Cabo San Lucas", "Tourist Corridor", "San José del Cabo"];

/** Combined product + service search with an optional delivery area (V4 §5.1). Results are not indexed. */
export function HeroSearch({ lang = "en" }: { lang?: "en" | "es" }) {
  const es = lang === "es";
  return (
    <form action="/search" role="search" className="mt-7 rounded-2xl bg-white p-2 shadow-lg shadow-navy/10 ring-1 ring-line">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="hero-q" className="sr-only">{es ? "Busca un medicamento, producto o servicio" : "Search a medicine, product or service"}</label>
        <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
          <IconSearch className="h-5 w-5 shrink-0 text-navy/40" />
          <input id="hero-q" name="q" list="hero-suggestions" required autoComplete="off"
            placeholder={es ? "Medicamento, producto o servicio" : "Medicine, product or service"}
            className="h-12 w-full bg-transparent text-base text-navy outline-none placeholder:text-navy/40" />
          <datalist id="hero-suggestions">
            {[...SUGGESTIONS, ...publicServices().map((s) => s.name)].map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>
        <label htmlFor="hero-area" className="sr-only">{es ? "Zona de entrega" : "Delivery area"}</label>
        <select id="hero-area" name="area" defaultValue="" className="h-12 rounded-xl border-0 bg-surface px-3 text-sm text-navy sm:w-48">
          <option value="">{es ? "Zona (opcional)" : "Area (optional)"}</option>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <button className="btn btn-primary h-12 sm:px-6">{es ? "Buscar" : "Search"}</button>
      </div>
    </form>
  );
}
