import type { NextConfig } from "next";
import merged from "./content/merged-pages.json";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [60, 75] },
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
      { source: "/cabonurse", destination: "/iv-therapy", permanent: true },
      { source: "/cabonurse/success", destination: "/iv-therapy/success", permanent: true },
      { source: "/ivtherapy", destination: "/iv-therapy", permanent: true },
      // Old WooCommerce/WordPress URLs that still get visits or backlinks
      { source: "/cart", destination: "/shop", permanent: true },
      { source: "/checkout", destination: "/shop", permanent: true },
      { source: "/my-account", destination: "/shop", permanent: true },
      { source: "/shop/page/:n(\\d+)", destination: "/shop?page=:n", permanent: true },
      { source: "/category/:path*", destination: "/blog", permanent: true },
      // Duplicate hotel posts merged into their landing page (content/merged-pages.json)
      ...Object.entries(merged)
        .filter(([from]) => !from.startsWith("_"))
        .map(([from, to]) => ({ source: `/${from}`, destination: `/${to}`, permanent: true })),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
