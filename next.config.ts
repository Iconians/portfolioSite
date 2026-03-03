import type { NextConfig } from "next";
import path from "path";

const projectRoot = __dirname;

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    config.resolve.alias["@"] = path.resolve(projectRoot, "src");
    // Ensure tailwindcss and PostCSS deps resolve from project root (avoids wrong context when path has spaces)
    config.resolve.modules = [path.join(projectRoot, "node_modules"), "node_modules"];

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
  // Pin Turbopack root to this project (avoids wrong root when parent/home has a lockfile)
  turbopack: { root: projectRoot },
};

export default nextConfig;
