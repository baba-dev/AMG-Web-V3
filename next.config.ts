import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages serves the statically generated files from /out.
  output: "export",
  // The default Next.js image optimization server is unavailable on static hosting.
  images: {
    unoptimized: true,
  },
  // Cache Components / Partial Prefetching require server capabilities and
  // are not suitable for this fully static deployment.
  cacheComponents: false,
  partialPrefetching: false,
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
