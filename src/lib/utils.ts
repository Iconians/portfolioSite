import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** User-friendly message for DB/connection errors (e.g. Neon on Vercel). */
export function dbErrorToUserMessage(error: unknown): string | null {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes("DATABASE_URL") || msg.includes("Can't reach database")) {
    return "Database is not configured. Add DATABASE_URL in Vercel → Project → Settings → Environment Variables, then redeploy.";
  }
  if (
    (msg.includes("connect") || msg.includes("ECONNREFUSED") || msg.includes("timeout") || msg.includes("too many connections")) &&
    typeof process !== "undefined" &&
    process.env?.DATABASE_URL?.includes("neon")
  ) {
    return "Database connection failed. On Vercel, use Neon's Pooled connection string (Neon dashboard → Connection details → Pooled), not the Direct connection.";
  }
  return null;
}
