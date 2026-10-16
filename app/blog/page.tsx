import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/content";

export const metadata: Metadata = { title: "Articles & News", description: "Travel health tips, pharmacy guides and news from CMC Pharmacy Cabo." };

export default function Blog() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold md:text-4xl">Articles &amp; News</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts().map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-mint">
            {p.date && <p className="text-xs text-muted">{new Date(p.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>}
            <h2 className="mt-1 font-semibold leading-snug">{p.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
