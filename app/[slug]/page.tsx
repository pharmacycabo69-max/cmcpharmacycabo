import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageBanner, photo } from "@/components/PageBanner";
import { InsuranceNotice } from "@/components/InsuranceNotice";
import { Prose } from "@/components/Prose";
import { allPages, deliveryAreas, getPage, related } from "@/lib/content";
import { JsonLd, articleSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => allPages().map((p) => ({ slug: p.slug }));

const isArea = (slug: string) => deliveryAreas().some((p) => p.slug === slug);
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};
  const title = brandless(page.seoTitle) || page.title;
  const description = clip(DESCRIPTIONS[page.slug] ?? page.description) || undefined;
  return {
    // Long titles skip the "| CMC Pharmacy Cabo" suffix so they are not cut off in results
    title: title.length > 45 ? { absolute: title } : title,
    description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title, description, url: `/${page.slug}`,
      type: page.type === "post" ? "article" : "website",
      publishedTime: page.type === "post" ? page.date ?? undefined : undefined,
      images: [page.image ?? (isArea(page.slug) ? photo("bay").src : "/opengraph-image")],
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
  return (
    <>
    {isArea(slug) && <PageBanner />}
    <article className="mx-auto max-w-3xl px-4 py-10">
      {isPost && <JsonLd data={articleSchema({ title: page.title, description: page.description, path: `/${slug}`, date: page.date, image: page.image })} />}
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{page.title}</h1>
      {isPost && page.date && (
        <p className="mt-3 text-sm text-slate-500"><time dateTime={page.date}>{new Date(page.date).toLocaleDateString("en-US", { dateStyle: "long" })}</time> · {SITE.name}</p>
      )}
      <div className="mt-8"><Prose html={page.html} /></div>

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
              <li key={p.slug}><Link href={`/${p.slug}`} className="block h-full rounded-xl border border-slate-200 p-4 text-sm font-medium transition hover:border-brand hover:text-brand">{p.title}</Link></li>
            ))}
          </ul>
        </section>
      )}
    </article>
    </>
  );
}
