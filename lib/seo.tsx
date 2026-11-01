import { SITE, abs } from "@/lib/site";

export type Crumb = { name: string; href: string };

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const orgId = `${SITE.url}/#pharmacy`;

export const pharmacySchema = () => ({
  "@context": "https://schema.org",
  "@type": ["Pharmacy", "LocalBusiness"],
  "@id": orgId,
  name: SITE.name,
  url: SITE.url,
  logo: abs(SITE.logo),
  image: abs(SITE.logo),
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.street,
    addressLocality: SITE.locality,
    addressRegion: SITE.region,
    postalCode: SITE.postalCode,
    addressCountry: SITE.country,
  },
  areaServed: [
    { "@type": "City", name: "Cabo San Lucas" },
    { "@type": "City", name: "San José del Cabo" },
    { "@type": "AdministrativeArea", name: "Los Cabos" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: SITE.rating.value, reviewCount: SITE.rating.count, bestRating: 5 },
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { "@id": orgId },
  inLanguage: "en-US",
  potentialAction: { "@type": "SearchAction", target: `${SITE.url}/shop?q={search_term_string}`, "query-input": "required name=search_term_string" },
});

export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.href) })),
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
});

export const articleSchema = (a: { title: string; description: string; path: string; date: string | null; image: string | null }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  mainEntityOfPage: abs(a.path),
  datePublished: a.date ?? undefined,
  dateModified: a.date ?? undefined,
  image: a.image ? abs(a.image) : abs(SITE.logo),
  author: { "@type": "Organization", name: SITE.name, url: SITE.url },
  publisher: { "@id": orgId },
});
