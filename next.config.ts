import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");

    // Fix Prisma client bundling issues
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("@prisma/client");
      // Prevent framer-motion from being bundled for SSR
      config.externals.push("framer-motion");
    }

    // Optimize Webpack for better performance in development
    if (dev && !isServer) {
      // Reduce optimization overhead in development
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
      // Faster rebuilds
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: false,
      };
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.shields.io",
      },
    ],
  },
  // Ensure Prisma client is not bundled (server-side only)
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  // Explicitly configure Turbopack (empty config to silence warning when using webpack)
  turbopack: {},
};

export default nextConfig;
