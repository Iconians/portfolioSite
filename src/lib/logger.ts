import { createLogger, format, transports } from "winston";

import type { Prisma } from "@prisma/client";
import type winston from "winston";

async function getDb() {
  const { db } = await import("@/lib/db/client");
  return db;
}

function buildTransports(): winston.transport[] {
  const consoleTransport = new transports.Console({
    format:
      process.env.NODE_ENV === "development"
        ? format.combine(format.colorize(), format.simple())
        : undefined,
  });

  // File transports only in local dev. Vercel/serverless filesystems are read-only
  // and winston creates the logs/ directory at module load (ENOENT in production).
  if (process.env.NODE_ENV === "development") {
    return [
      consoleTransport,
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/combined.log" }),
    ];
  }

  return [consoleTransport];
}

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: buildTransports(),
});

export async function logAdminAction(
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  metadata?: Record<string, unknown>
) {
  const logData = {
    userId,
    action,
    resource,
    resourceId,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  logger.info("Admin action", logData);

  // Also log to database audit table (lazy-load db so logger can be imported without DATABASE_URL)
  try {
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId,
        action,
        resourceType: resource,
        resourceId,
        metadata: (metadata || {}) as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    // Don't fail if audit log fails, but log it
    logger.error("Failed to write audit log", { error, logData });
  }
}
