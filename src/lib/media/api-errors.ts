import { NextResponse } from "next/server";

const CLIENT_ERROR_PATTERNS = [
  "Invalid file type",
  "File too large",
  "File is empty",
  "Filename is required",
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
  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof Error && isClientError(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : fallbackMessage },
    { status: 500 }
  );
}
