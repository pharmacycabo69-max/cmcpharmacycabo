import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageBanner, photo } from "@/components/PageBanner";
import { Prose } from "@/components/Prose";
import { allPages, deliveryAreas, getPage, related } from "@/lib/content";
import { JsonLd, articleSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => allPages().map((p) => ({ slug: p.slug }));

const isArea = (slug: string) => deliveryAreas().some((p) => p.slug === slug);
const brandless = (t: string) => t.replace(/\s*[|\-–—]\s*CMC Pharmacy Cabo\s*$/i, "").trim();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};
  const title = brandless(page.seoTitle) || page.title;
  return {
    title,
    description: page.description || undefined,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title, description: page.description || undefined, url: `/${page.slug}`,
      type: page.type === "post" ? "article" : "website",
      publishedTime: page.type === "post" ? page.date ?? undefined : undefined,
      images: page.image ? [page.image] : isArea(page.slug) ? [photo("bay").src] : undefined,
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

      <aside className="mt-14 rounded-2xl bg-brand-soft p-6 text-center">
        <p className="text-lg font-semibold">Need a pharmacist right now?</p>
        <p className="mt-1 text-sm text-slate-600">24/7 delivery to hotels, resorts and villas across Los Cabos.</p>
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
