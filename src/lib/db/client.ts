import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy initialization - only create pool and adapter when actually needed
// This prevents validation errors during build time and handles missing/invalid URLs gracefully
function getDatabaseAdapter() {
  let connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Return a mock adapter that will fail gracefully on first query
    // This allows the build to complete but will error at runtime if DATABASE_URL is missing
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Strip quotes if Vercel or other platforms add them
  connectionString = connectionString.trim().replace(/^["']|["']$/g, "");

  // Validate that connection string is not empty after trimming
  if (!connectionString || connectionString.length === 0) {
    console.error("[DB] ERROR: DATABASE_URL is empty or whitespace only");
    throw new Error("DATABASE_URL environment variable is empty or invalid");
  }

  // Validate that it's not a localhost connection (which would indicate misconfiguration)
  if (
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1")
  ) {
    console.error(
      "[DB] ERROR: DATABASE_URL appears to point to localhost. This will not work in production."
    );
    console.error(
      "[DB] Connection string (masked):",
      connectionString.replace(/:[^:@]+@/, ":****@").substring(0, 100)
    );
    throw new Error(
      "DATABASE_URL points to localhost. Please configure a production database URL."
    );
  }

  // Log connection string info for debugging (without exposing sensitive data)
  // Always log in production to help diagnose connection issues
  const connectionInfo = connectionString
    .replace(/:[^:@]+@/, ":****@") // Mask password
    .substring(0, 150); // Show more of the connection string
  console.log(`[DB] Initializing database connection...`);
  console.log(`[DB] Connection string (masked): ${connectionInfo}...`);
  console.log(`[DB] Connection string length: ${connectionString.length}`);
  console.log(
    `[DB] Starts with postgresql://: ${connectionString.startsWith(
      "postgresql://"
    )}`
  );
  console.log(`[DB] Contains -pooler: ${connectionString.includes("-pooler")}`);
  console.log(`[DB] Contains sslmode: ${connectionString.includes("sslmode")}`);
  console.log(`[DB] Contains neon: ${connectionString.includes("neon")}`);

  // Extract hostname for debugging (masked)
  try {
    const url = new URL(connectionString);
    const hostname = url.hostname.replace(/[^.-]+\./g, "***.").substring(0, 50);
    console.log(`[DB] Hostname pattern: ${hostname}...`);
    console.log(`[DB] Has hostname: ${!!url.hostname}`);
    console.log(`[DB] Has pathname: ${!!url.pathname}`);
    console.log(
      `[DB] Full URL structure valid: ${
        !!url.hostname && url.pathname ? "yes" : "no"
      }`
    );

    // Critical check: ensure hostname is not localhost
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      console.error(
        `[DB] CRITICAL: Parsed hostname is ${url.hostname}. This indicates DATABASE_URL is misconfigured.`
      );
      throw new Error(
        `DATABASE_URL hostname is ${url.hostname}. Please configure a production database.`
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("hostname")) {
      throw e; // Re-throw our validation error
    }
    console.error(
      `[DB] Could not parse connection string as URL:`,
      e instanceof Error ? e.message : String(e)
    );
    // If URL parsing fails, the connection string is definitely malformed
    console.error(
      `[DB] Connection string format is invalid - cannot parse as URL`
    );
    throw new Error(
      `Invalid DATABASE_URL format: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
  }

  // Don't validate format strictly - let the Pool constructor handle it
  // This allows various connection string formats (Neon, Supabase, etc.)
  // The actual connection attempt will fail if the format is truly invalid

  // Create a connection pool for PostgreSQL
  // For Neon, use pooled connection string for serverless environments
  // Ensure SSL is required for Neon connections
  const poolConfig: ConstructorParameters<typeof Pool>[0] = {
    connectionString, // Use the cleaned connection string
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
    // Ensure SSL for Neon connections (if not already in connection string)
    ssl: connectionString.includes("neon")
      ? { rejectUnauthorized: false }
      : undefined,
  };

  console.log(`[DB] Creating PostgreSQL pool with connection string...`);
  const pool = new Pool(poolConfig);

  // Add error handler to catch connection issues early
  pool.on("error", (err) => {
    console.error("[DB] Pool error:", err.message);
    if (
      err.message.includes("localhost") ||
      err.message.includes("127.0.0.1")
    ) {
      console.error(
        "[DB] CRITICAL: Pool is trying to connect to localhost. DATABASE_URL is likely misconfigured."
      );
    }
  });

  console.log(`[DB] Pool created successfully`);

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
