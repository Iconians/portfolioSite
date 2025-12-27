import { createLogger, format, transports } from "winston";
import { db } from "@/lib/db/client";
import type { Prisma } from "@prisma/client";

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    ...(process.env.NODE_ENV === "development"
      ? [new transports.Console({ format: format.simple() })]
      : []),
  ],
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

  // Also log to database audit table
  try {
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
