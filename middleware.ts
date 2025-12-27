import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import type { NextRequest } from "next/server";

// Create the auth middleware
const authMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Rate limit admin routes
    const { success } = checkRateLimit(
      req.auth.user?.id || "anonymous",
      10,
      10000
    );
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
});

// Export wrapped middleware to handle initialization errors
export default async function middleware(
  req: NextRequest,
  event: { waitUntil: (promise: Promise<unknown>) => void }
) {
  try {
    return await authMiddleware(req, event);
  } catch (error) {
    console.error("[Middleware] Auth error:", error);
    // On error, redirect admin routes to login, otherwise continue
    if (req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
