import { NextResponse } from "next/server";

import {
  isAuthenticationError,
  isAuthorizationError,
} from "@/lib/auth/errors";

export function authApiErrorResponse(error: unknown): NextResponse | null {
  if (isAuthenticationError(error)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isAuthorizationError(error)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
