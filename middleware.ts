import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware that checks for auth session cookie
// Actual auth validation happens in page/route handlers (Node.js runtime)
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // For admin routes, check if auth session cookie exists
  // If not, redirect to login (actual validation happens in page handler)
  if (pathname.startsWith("/admin")) {
    const authToken =
      req.cookies.get("authjs.session-token") ||
      req.cookies.get("__Secure-authjs.session-token");

    if (!authToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
