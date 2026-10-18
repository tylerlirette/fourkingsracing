import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tylerlirette/pagebuilder"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
