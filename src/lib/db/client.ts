import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

// Only validate during runtime, not during build
if (typeof window === "undefined" && process.env.NODE_ENV !== "test") {
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Validate connection string format
  if (
    !connectionString.startsWith("postgresql://") &&
    !connectionString.startsWith("postgres://")
  ) {
    throw new Error(
      "DATABASE_URL must start with 'postgresql://' or 'postgres://'. " +
        "For Neon, use the pooled connection string (with -pooler in the endpoint)."
    );
  }
}

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

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // Only log errors and warnings (not queries) to avoid exposing sensitive data in browser console
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
