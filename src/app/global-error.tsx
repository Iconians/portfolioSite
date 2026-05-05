"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error.message, error.digest ?? "", error.stack);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#0a0a0a", color: "#fafafa" }}>
        <div style={{ maxWidth: "42rem", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Application error</h1>
          <p style={{ color: "#a1a1a1" }}>
            A server-side exception occurred. You can try again or go back home.
          </p>
          {isDev && (
            <pre style={{ textAlign: "left", fontSize: "0.875rem", background: "#262626", padding: "1rem", borderRadius: "0.5rem", overflow: "auto", maxWidth: "100%" }}>
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          )}
          {error.digest && !isDev && (
            <p style={{ fontSize: "0.875rem", color: "#737373" }}>
              Error ID: {error.digest} — check your deployment logs (Vercel → Project → Logs) for this ID.
            </p>
          )}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={reset}
              style={{ padding: "0.5rem 1rem", background: "#fafafa", color: "#0a0a0a", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontWeight: 500 }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{ padding: "0.5rem 1rem", background: "transparent", color: "#fafafa", border: "1px solid #525252", borderRadius: "0.375rem", textDecoration: "none", fontWeight: 500 }}
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
