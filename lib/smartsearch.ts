/**
 * Smart catalog search (V5 §4): bilingual synonyms (ES ↔ EN, brand ↔ active ingredient for common OTC items),
 * symptom words mapped to products with a lower weight, and typo tolerance (edit distance 1 for words of
 * 5–7 letters, 2 for longer words). Pure functions shared by the server search and the instant-search API.
 */
/** Same product, other words (weight 2). */
const SAME: string[][] = [
  ["sunscreen", "protector", "bloqueador", "solar", "sunblock", "spf", "fps"],
  ["electrolyte", "electrolytes", "electrolitos", "electrolito", "suero", "hydration", "hidratacion", "rehydration", "pedialyte"],
  ["paracetamol", "acetaminophen", "acetaminofen", "tylenol"],
  ["ibuprofen", "ibuprofeno", "advil", "motrin"],
  ["loperamide", "loperamida", "imodium"],
  ["loratadine", "loratadina", "claritin"],
  ["cetirizine", "cetirizina", "zyrtec"],
  ["dimenhydrinate", "dimenhidrinato", "dramamine", "mareol"],
  ["repellent", "repelente"],
  ["bandage", "bandages", "curitas", "curita", "bandaid", "venda", "vendas", "gasa", "gauze"],
  ["diaper", "diapers", "panal", "panales", "huggies"],
  ["vitamin", "vitamins", "vitamina", "vitaminas"],
  ["aloe", "sabila"],
  ["antacid", "antiacido", "tums", "omeprazole", "omeprazol"],
  ["thermometer", "termometro"],
  ["shampoo", "champu"],
  ["cream", "crema"],
  ["drops", "gotas"],
];
/** Symptom or need → products (weight 1). */
const NEED: [string[], string[]][] = [
  [["diarrea", "diarrhea", "stomach", "estomago"], ["loperamide", "loperamida", "electrolitos", "electrolytes", "probiotic", "probiotico"]],
  [["alergia", "allergy", "antialergico", "antihistamine"], ["loratadine", "loratadina", "cetirizine", "cetirizina", "allergy"]],
  [["mareo", "motion", "seasick"], ["dimenhydrinate", "dimenhidrinato", "meclizine", "mareol", "dramamine"]],
  [["mosquitos", "mosquito", "insectos", "bugs", "piquetes"], ["repellent", "repelente"]],
  [["sunburn", "quemadura"], ["aloe", "sabila", "after", "sun"]],
  [["agruras", "acidez", "heartburn"], ["antacid", "antiacido", "omeprazol", "omeprazole"]],
  [["dolor", "pain", "fiebre", "fever"], ["paracetamol", "ibuprofen", "ibuprofeno", "naproxen", "naproxeno", "analgesic", "analgesico"]],
  [["resaca", "hangover"], ["electrolitos", "electrolytes", "suero"]],
];

export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9+ ]/g, " ");
export const words = (s: string) => norm(s).split(/\s+/).filter((w) => w.length > 1);

const tokenHit = (tokens: string[], s: string) => tokens.some((t) => t === s || (s.length >= 5 && t.startsWith(s)));

function within(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return false;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]; prev[0] = i; let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp; rowMin = Math.min(rowMin, prev[j]);
    }
    if (rowMin > max) return false;
  }
  return prev[b.length] <= max;
}

/** Score of a product name for a query: 0 = no match. Exact (3) > same-product synonym (2) > need/typo (1). */
export function score(name: string, query: string): number {
  const qw = words(query);
  if (!qw.length) return 0;
  const tokens = words(name);
  const hay = tokens.join(" ");
  let total = 0;
  for (const w of qw) {
    let best = 0;
    if (w.length >= 3 ? hay.includes(w) : tokens.includes(w)) best = 3;
    // a synonym can't be another word of the same query ("protector solar" must not match any "protector")
    else if (SAME.some((g) => g.includes(w) && g.some((s) => s !== w && !qw.includes(s) && tokenHit(tokens, s)))) best = 2;
    else if (NEED.some(([need, prods]) => need.includes(w) && prods.some((s) => tokenHit(tokens, s)))) best = 1;
    else if (w.length >= 5 && tokens.some((t) => t.length >= 4 && within(w, t.slice(0, w.length + 1), w.length > 7 ? 2 : 1))) best = 1;
    if (!best) return 0; // every query word must match somehow
    total += best;
  }
  return total;
}
