import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageBanner } from "@/components/PageBanner";
import { PostCover } from "@/components/PostCover";
import { RelatedServices } from "@/components/RelatedServices";
import { posts } from "@/lib/content";
import { JsonLd } from "@/lib/seo";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Cabo Travel Health Guides: Pharmacy & Medicine Tips" },
  description:
    "Travel health guides for visitors to Cabo San Lucas: sunburn, traveler's diarrhea, allergies, prescriptions and how to get medicine at your hotel.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", images: ["/opengraph-image"] },
};

export default function Blog() {
  const all = posts();
  const [lead, ...rest] = all;
  const list = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cabo travel health guides",
    url: abs("/blog"),
    mainEntity: { "@type": "ItemList", itemListElement: all.slice(0, 30).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/${p.slug}`), name: p.title })) },
  };
  const Card = ({ p, big = false }: { p: (typeof all)[number]; big?: boolean }) => (
    <article className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-brand hover:shadow-lg ${big ? "md:col-span-2 md:flex-row" : ""}`}>
      <Link href={`/${p.slug}`} tabIndex={-1} aria-hidden className={`block overflow-hidden bg-slate-100 ${big ? "aspect-[16/9] md:aspect-auto md:w-1/2" : "aspect-[16/9]"}`}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt="" width={640} height={360} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <PostCover slug={p.slug} className="h-full w-full transition duration-500 group-hover:scale-105" />
        )}
      </Link>
      <div className={`flex flex-1 flex-col p-5 ${big ? "md:p-7" : ""}`}>
        {p.date && <time dateTime={p.date} className="text-xs text-slate-500">{new Date(p.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</time>}
        <h3 className={`mt-1 font-semibold leading-snug ${big ? "text-xl md:text-2xl" : ""}`}><Link href={`/${p.slug}`} className="hover:text-brand">{p.title}</Link></h3>
        <p className={`mt-2 text-sm leading-relaxed text-slate-600 ${big ? "line-clamp-4" : "line-clamp-3"}`}>{p.description}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-brand">Read the guide <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span></span>
      </div>
    </article>
  );
  return (
    <>
      <JsonLd data={list} />
      <PageBanner which="arco" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
        <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">Pharmacy &amp; travel health guides for Cabo</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">Practical answers for visitors: what to pack, what to do about sunburn or an upset stomach, how prescriptions work in Mexico and how to get medicine delivered to your hotel.</p>
        <p className="mt-2 max-w-2xl text-xs text-slate-500">General information, not medical advice. In an emergency, call 911.</p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">Latest guides</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lead && <Card p={lead} big />}
          {rest.map((p) => <Card key={p.slug} p={p} />)}
        </div>

        <RelatedServices />
      </div>
    </>
  );
}
