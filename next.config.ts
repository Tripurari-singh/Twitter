import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // standalone = Next.js bundles everything needed to run
  // without node_modules (much smaller Docker image)

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
};

export default nextConfig;
