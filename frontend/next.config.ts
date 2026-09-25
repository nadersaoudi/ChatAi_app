import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Trim barrel imports into per-module imports (smaller bundles).
    optimizePackageImports: [
      "react-icons",
      "react-syntax-highlighter",
      "@clerk/nextjs",
    ],
  },
};

export default nextConfig;
