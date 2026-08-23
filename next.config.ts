import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The BYOK and merge-check pages were folded into the product catalog. */
  async redirects() {
    return [
      { source: "/products/agents", destination: "/products/runtime", permanent: true },
      { source: "/products/checks", destination: "/products/review", permanent: true },
    ];
  },
};

export default nextConfig;
