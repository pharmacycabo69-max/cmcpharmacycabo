import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
      { source: "/cabonurse", destination: "/iv-therapy", permanent: true },
      { source: "/cabonurse/success", destination: "/iv-therapy/success", permanent: true },
      { source: "/ivtherapy", destination: "/iv-therapy", permanent: true },
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
