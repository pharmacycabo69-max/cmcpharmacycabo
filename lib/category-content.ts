import data from "@/content/category-content.json";
import { getPage } from "@/lib/content";

export type CategoryContent = {
  title: string;
  h1: string;
  description: string;
  intro: string[];
  faq: { q: string; a: string }[];
  related: string[];
};

const all = data as Record<string, CategoryContent>;

/** Editorial intro + FAQ for the categories tourists search for most (content/category-content.json). */
export const categoryContent = (slug: string) => all[slug];

/** Blog guides linked from a category, skipping any that no longer exist. */
export const relatedGuides = (c: CategoryContent) =>
  c.related.map((slug) => getPage(slug)).filter((p): p is NonNullable<typeof p> => !!p).map((p) => ({ href: `/${p.slug}`, title: p.title }));
