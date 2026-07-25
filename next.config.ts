import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tylerlirette/pagebuilder"],
  // Kit ships TypeScript source; consumer builds should not block on kit-local typing.
  typescript: {
    ignoreBuildErrors: true,
  },
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
