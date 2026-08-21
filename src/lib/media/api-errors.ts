import { NextResponse } from "next/server";
import { authApiErrorResponse } from "@/lib/auth/api-response";

const CLIENT_ERROR_PATTERNS = [
  "Invalid file type",
  "File too large",
  "File is empty",
  "Filename is required",
  "Filename extension does not match",
  "Invalid storage key",
  "Unsupported media object type",
  "Presigned uploads require",
  "Media asset already registered",
  "Storage provider does not support",
  "Invalid request",
] as const;

function isClientError(message: string): boolean {
  return CLIENT_ERROR_PATTERNS.some(
    (pattern) => message.startsWith(pattern) || message.includes(pattern)
  );
}

export function mediaApiError(error: unknown, fallbackMessage: string) {
  const authResponse = authApiErrorResponse(error);
  if (authResponse) {
    return authResponse;
  }

  if (error instanceof Error && isClientError(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : fallbackMessage },
    { status: 500 }
  );
}
