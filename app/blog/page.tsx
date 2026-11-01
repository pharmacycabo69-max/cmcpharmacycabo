import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog: Pharmacy & Travel Health Guides for Cabo",
  description: "Travel health tips, medication guides and pharmacy news for visitors and residents of Cabo San Lucas and San José del Cabo.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Pharmacy &amp; travel health guides for Cabo</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts().map((p) => (
          <article key={p.slug} className="rounded-xl border border-slate-200 p-5 transition hover:border-brand">
            {p.date && <time dateTime={p.date} className="text-xs text-slate-500">{new Date(p.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</time>}
            <h2 className="mt-1 font-semibold leading-snug"><Link href={`/${p.slug}`} className="hover:text-brand">{p.title}</Link></h2>
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
