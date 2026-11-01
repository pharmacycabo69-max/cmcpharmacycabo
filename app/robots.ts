import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const count = 2 + Math.ceil(products.length / 1000);
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/*?q=", "/*?sort="] },
    sitemap: Array.from({ length: count }, (_, i) => `${SITE.url}/sitemap/${i}.xml`),
    host: SITE.url,
  };
}
