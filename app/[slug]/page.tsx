import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AreaStrip } from "@/components/AreaStrip";
import { PostCover } from "@/components/PostCover";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import { Prose } from "@/components/Prose";
import { allPages, deliveryAreas, getPage, hotelName, related } from "@/lib/content";
import { JsonLd, articleSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => allPages().map((p) => ({ slug: p.slug }));

const isArea = (slug: string) => deliveryAreas().some((p) => p.slug === slug);
/** Article topic → product category it links to (internal linking + a path from reading to buying). */
const SHOP_LINKS: [RegExp, string, string][] = [
  [/sunscreen|sunburn|sun-|beach|medano/i, "sun-care", "Sunscreen & sun care"],
  [/stomach|diarrhea|digest/i, "digestive-gi-care", "Stomach & digestive care"],
  [/hangover|hydrat|electrolyte/i, "hydration-electrolytes", "Hydration & electrolytes"],
  [/allerg|antihist|pollen/i, "allergy-otc", "Allergy medicine"],
  [/insect|bug|bite|mosquito|repellent/i, "insect-repellents", "Insect repellents"],
  [/pain|headache|migraine/i, "pain-fever-relief", "Pain & fever relief"],
  [/first-aid|emergency|wound|kit/i, "wound-care-first-aid", "First aid supplies"],
  [/cold|flu/i, "cold-flu", "Cold & flu medicine"],
];
/** Pages that carry the international insurance notice (master data §2.1: home, medical services, FAQ, contact). */
const INSURANCE_PAGES = new Set(["doctor-consultation", "contact-us", "faq", "about-us-pharmacy-delivery", "for-concierges"]);
/**
 * Imported SEO titles sometimes repeat the brand ("X | CMC Pharmacy Cabo - CMC Pharmacy CaboCMC Pharmacy Cabo — X"):
 * keep only what comes before the first brand mention. The layout template appends the brand once.
 */
const brandless = (t: string) => (t.split(/\s*CMC Pharmacy Cabo\s*/i)[0] ?? "").replace(/[\s|\-–—:]+$/, "").trim();

/** Clip to ~155 chars on a word boundary so Google shows the whole snippet. */
const clip = (s: string, max = 155) => (s.length <= max ? s : `${s.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,;:.–—-]+$/, "")}…`);

/** Pages that shared one generic imported description get their own. */
const DESCRIPTIONS: Record<string, string> = {
  "about-us-pharmacy-delivery": "Meet CMC Pharmacy Cabo: the delivery and concierge service of RMC Pharmacy, with an English-speaking team and doctor visits by appointment, delivering to hotels and villas across Los Cabos.",
  "contact-us": "Contact CMC Pharmacy Cabo by WhatsApp, phone or email. Bilingual team, delivery to your hotel or villa in Los Cabos every day 7 am–11 pm.",
  "doctor-consultation": "See a licensed English-speaking doctor in Cabo by video or at your hotel. Get a valid Mexican prescription and have your medication delivered to your hotel.",
  faq: "Answers about ordering medicine in Cabo: prescriptions, delivery times and areas, payment, prices in USD and what tourists can legally buy in Mexico.",
  "for-concierges": "Hotel and villa concierges: one WhatsApp for pharmacy delivery, doctor visits and IV therapy for your guests anywhere in Los Cabos.",
  "prescription-requirements": "Which medicines need a prescription in Mexico, how to get one from our English-speaking doctors, and what to bring when you order in Cabo.",
  "privacy-policy": "How CMC Pharmacy Cabo collects, uses and protects your personal and health information when you order, consult a doctor or browse our website.",
  "returns-and-refunds": "CMC Pharmacy Cabo returns and refunds policy: which products can be returned, time limits, damaged or wrong deliveries and how refunds are issued.",
};

/** Search titles for pages whose imported title was longer than what Google shows (~60 characters). */
const TITLES: Record<string, string> = {
  "overnight-medication-delivery-cabo-san-lucas": "Late-Evening Medication Delivery in Cabo San Lucas",
  "vitamins-supplements-cabo-san-lucas-cmc-pharmacy": "Which Vitamins to Buy in Cabo San Lucas",
  "about-us-pharmacy-delivery": "About CMC Pharmacy Cabo: Delivery & Concierge Service",
  "allergy-medicine-cabo-san-lucas-delivered-hotel": "Allergy Medicine in Cabo: Options Delivered to Your Hotel",
  "best-pharmacy-in-san-jose-del-cabo-trusted-by-locals-and-tourists-alike": "Pharmacy in San José del Cabo: Guide for Visitors",
  "best-sunscreen-to-buy-in-cabo-san-lucas-reef-safe-options-at-cmc-pharmacy": "Reef-Safe Sunscreen to Buy in Cabo San Lucas",
  "cabo-san-lucas-pharmacy-open-late-cmc-pharmacy-extended-hours-for-tourists": "Late Pharmacy Delivery in Cabo San Lucas, Until 11 pm",
  "childrens-pharmacy-cabo-san-lucas-pediatric-medications": "Children's Medicine in Cabo San Lucas, Delivered",
  "english-speaking-pharmacy-in-cabo-san-lucas-why-tourists-choose-cmc-pharmacy": "English-Speaking Pharmacy in Cabo San Lucas",
  "first-aid-kit-delivery-san-jose-del-cabo-2": "First Aid Kit Delivery in San José del Cabo",
  "first-aid-supplies-cabo-san-lucas-pharmacy": "First Aid Supplies in Cabo San Lucas: What to Get",
  "how-to-buy-prescription-medication-cabo-san-lucas-tourist-guide": "Buying Prescription Medicine in Cabo: Tourist Guide",
  "insect-repellent-bug-bite-relief-cabo-san-lucas-pharmacy": "Insect Repellent & Bug Bite Relief in Cabo San Lucas",
  "motion-sickness-cabo-san-lucas-patches-meds-pharmacy": "Motion Sickness in Cabo: Patches and Medicine",
  "pain-relief-cabo-san-lucas-otc-options-pharmacy": "Pain Relief in Cabo San Lucas: OTC Options",
  "pharmacy-delivery-pueblo-bonito-sunset-beach-pedregal": "Pharmacy Delivery to Pueblo Bonito Sunset Beach",
  "pharmacy-near-bahia-hotel-cabo-san-lucas-marina-delivery": "Pharmacy Delivery to Bahia Hotel, Cabo Marina",
  "pharmacy-near-barcelo-gran-faro-los-cabos-hotel-delivery": "Pharmacy Delivery to Barceló Gran Faro Los Cabos",
  "pharmacy-near-cabo-azul-resort-fast-delivery-san-jose-del-cabo": "Pharmacy Delivery to Cabo Azul Resort",
  "pharmacy-near-chileno-bay-resort-auberge-collection-cabo": "Pharmacy Delivery to Chileno Bay Resort",
  "pharmacy-near-dreams-los-cabos-resort-fast-delivery": "Pharmacy Delivery to Dreams Los Cabos Resort",
  "pharmacy-near-hacienda-del-mar-los-cabos-cabo-del-sol": "Pharmacy Delivery to Hacienda del Mar Los Cabos",
  "pharmacy-near-hotel-tesoro-los-cabos-marina-delivery": "Pharmacy Delivery to Hotel Tesoro Los Cabos",
  "pharmacy-near-las-ventanas-al-paraiso-premium-pharmacy-service": "Pharmacy Delivery to Las Ventanas al Paraíso",
  "pharmacy-near-montage-los-cabos-resort-luxury-delivery-santa-maria-bay": "Pharmacy Delivery to Montage Los Cabos",
  "pharmacy-near-sandos-finisterra-los-cabos-fast-delivery": "Pharmacy Delivery to Sandos Finisterra Los Cabos",
  "pharmacy-near-secrets-puerto-los-cabos-fast-delivery-adults-only": "Pharmacy Delivery to Secrets Puerto Los Cabos",
  "pharmacy-near-the-cape-hotel-cabo-san-lucas-delivery": "Pharmacy Delivery to The Cape Hotel, Cabo San Lucas",
  "plan-b-cabo-san-lucas-emergency-contraception": "Plan B in Cabo: Where to Get Emergency Contraception",
  "skin-care-products-cabo-san-lucas-pharmacy": "Skin Care Products in Cabo San Lucas: What to Buy",
  "stomach-medicine-cabo-san-lucas-travelers-diarrhea": "Stomach Medicine in Cabo: Traveler's Diarrhea",
  "sunburn-relief-in-cabo-san-lucas-what-to-buy-at-a-pharmacy-after-a-day-at-medano-beach": "Sunburn Relief in Cabo: What to Buy at a Pharmacy",
  "sunburn-treatment-cabo-san-lucas-pharmacy-products": "Sunburn Treatment in Cabo: Pharmacy Products",
  "travelers-diarrhea-in-cabo-best-pharmacy-treatment-from-cmc-pharmacy": "Traveler's Diarrhea in Cabo: Pharmacy Treatment",
  "where-to-buy-ozempic-in-cabo-san-lucas-cmc-pharmacy-has-you-covered": "Ozempic in Cabo San Lucas: Prescription Guide",
  "convenient-otc-medication-delivery-near-you": "OTC Medication Delivery in Los Cabos",
  "easy-prescription-refills-near-you": "Prescription Refills in Los Cabos",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};
  const title = TITLES[page.slug] ?? (brandless(page.seoTitle) || page.title);
  const description = clip(DESCRIPTIONS[page.slug] ?? page.description) || undefined;
  return {
    // "| CMC Pharmacy Cabo" is appended only when the result still fits in 60 characters
    title: title.length > 40 ? { absolute: title } : title,
    description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title, description, url: `/${page.slug}`,
      type: page.type === "post" ? "article" : "website",
      publishedTime: page.type === "post" ? page.date ?? undefined : undefined,
      images: [page.image ?? "/opengraph-image"],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();
  const isPost = page.type === "post";
  const more = related(slug);
  const crumbs = isPost ? [{ name: "Blog", href: "/blog" }, { name: page.title, href: `/${slug}` }] : [{ name: page.title, href: `/${slug}` }];
  const minutes = Math.max(1, Math.round(page.html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 220));
  const shop = isPost ? SHOP_LINKS.find(([re]) => re.test(slug)) : undefined;
  return (
    <>
    {isArea(slug) && <AreaStrip name={hotelName(page.title)} />}
    {isPost && (
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <div className="aspect-[21/9] overflow-hidden rounded-3xl bg-slate-100">
          {page.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.image} alt="" width={1200} height={514} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
          ) : (
            <PostCover slug={slug} className="h-full w-full" />
          )}
        </div>
      </div>
    )}
    <article className={`mx-auto max-w-3xl px-4 ${isPost ? "pb-10 pt-6" : "py-10"}`}>
      {isPost && <JsonLd data={articleSchema({ title: page.title, description: page.description, path: `/${slug}`, date: page.date, image: page.image })} />}
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{page.title}</h1>
      {isPost && page.date && (
        <p className="mt-3 text-sm text-slate-500"><time dateTime={page.date}>{new Date(page.date).toLocaleDateString("en-US", { dateStyle: "long" })}</time> · {minutes} min read · {SITE.name}</p>
      )}
      <div className="mt-8"><Prose html={page.html} /></div>

      {shop && (
        <Link href={`/product-category/${shop[1]}`} className="group mt-10 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md">
          <span><span className="block text-xs font-bold uppercase tracking-[0.16em] text-brand">Shop</span><span className="mt-1 block font-semibold">{shop[2]} delivered to your hotel</span><span className="mt-0.5 block text-sm text-slate-600">See products and prices in USD.</span></span>
          <span aria-hidden className="text-xl text-brand transition group-hover:translate-x-1">→</span>
        </Link>
      )}

      {isArea(slug) && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="every-hotel">
          <h2 id="every-hotel" className="text-lg font-semibold">We deliver to every hotel in Los Cabos</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Wherever you are staying — any hotel, resort, villa, vacation rental or home in Cabo San Lucas, San José del Cabo or the Tourist Corridor — we bring your medicine every day from 7 am to 11 pm. Delivery is free on orders of ${SITE.freeDeliveryFrom} or more.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={`${SITE.whatsapp}?text=${encodeURIComponent("Hi! I need a pharmacy delivery to my hotel in Cabo.")}`} target="_blank" rel="noopener" className="btn btn-primary">Order on WhatsApp</a>
            <Link href="/delivery-areas" className="btn btn-outline">All delivery areas</Link>
          </div>
          {/* Master data §13/§14: hotel names must not suggest an affiliation */}
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            {SITE.name} is an independent pharmacy delivery service; hotel names are used only to describe where we deliver, and we are not affiliated with these properties. Some hotels only accept deliveries at the front desk or concierge — we coordinate it with you.
          </p>
        </section>
      )}

      {INSURANCE_PAGES.has(slug) && <div className="mt-12"><InsuranceNotice compact /></div>}

      <aside className="mt-14 rounded-2xl bg-brand-soft p-6 text-center">
        <p className="text-lg font-semibold">Need something from the pharmacy?</p>
        <p className="mt-1 text-sm text-slate-600">Delivery to hotels, resorts and villas across Los Cabos, 7 am – 11 pm daily.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href={SITE.tel} className="btn btn-primary">Call {SITE.phone}</a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener" className="btn btn-outline">WhatsApp us</a>
        </div>
      </aside>

      {more.length > 0 && (
        <section className="mt-14" aria-labelledby="more">
          <h2 id="more" className="text-xl font-semibold">{isPost ? "Keep reading" : "Related pages"}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="group block h-full overflow-hidden rounded-xl border border-slate-200 text-sm font-medium transition hover:border-brand hover:text-brand">
                  {isPost && <div className="aspect-[16/7] overflow-hidden"><PostCover slug={p.slug} className="h-full w-full transition duration-500 group-hover:scale-105" /></div>}
                  <span className="block p-4">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
    </>
  );
}
