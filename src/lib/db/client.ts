import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy initialization - only create pool and adapter when actually needed
// This prevents validation errors during build time and handles missing/invalid URLs gracefully
function getDatabaseAdapter() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Return a mock adapter that will fail gracefully on first query
    // This allows the build to complete but will error at runtime if DATABASE_URL is missing
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Don't validate format strictly - let the Pool constructor handle it
  // This allows various connection string formats (Neon, Supabase, etc.)
  // The actual connection attempt will fail if the format is truly invalid

  // Create a connection pool for PostgreSQL
  // For Neon, use pooled connection string for serverless environments
  const pool = new Pool({
    connectionString,
    // Increase connection timeout for Neon (compute activation can take a few seconds)
    // Neon cold starts can take longer, so we use a more generous timeout
    connectionTimeoutMillis: 30000, // 30 seconds for cold starts
    // Set max connections for serverless (lower than default)
    max: 10,
    // Idle timeout - how long a connection can sit idle before being closed
    idleTimeoutMillis: 30000,
    // Keep connections alive to avoid cold starts
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });

  return new PrismaPg(pool);
}

// Lazy initialization of Prisma client
function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const adapter = getDatabaseAdapter();

  const client = new PrismaClient({
    adapter,
    // Only log errors and warnings (not queries) to avoid exposing sensitive data in browser console
    log: ["error", "warn"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Export a getter that initializes on first access
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
