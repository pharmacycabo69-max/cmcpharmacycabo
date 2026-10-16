import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/Prose";
import { allPages, getPage } from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => allPages().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};
  return {
    title: page.seoTitle.replace(/\s*[-–—]\s*CMC Pharmacy Cabo\s*$/i, "") || page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description: page.description, images: page.image ? [page.image] : undefined, type: page.type === "post" ? "article" : "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPage((await params).slug);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {page.type === "post" && <Link href="/blog" className="text-sm text-mint">← All articles</Link>}
      <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{page.title}</h1>
      {page.date && <p className="mt-2 text-sm text-muted">{new Date(page.date).toLocaleDateString("en-US", { dateStyle: "long" })}</p>}
      <div className="mt-8"><Prose html={page.html} /></div>
      <aside className="mt-12 rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="text-lg font-semibold">Need a pharmacist right now?</p>
        <p className="mt-1 text-sm text-muted">24/7 delivery to hotels, resorts &amp; villas across Los Cabos.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href={SITE.tel} className="btn btn-cta">Call {SITE.phone}</a>
          <a href={SITE.whatsapp} className="btn btn-mint">WhatsApp</a>
        </div>
      </aside>
    </article>
  );
}
