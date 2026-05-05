"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log so it appears in Vercel Function Logs / server logs
    console.error("[App Error]", error.message, error.digest ?? "", error.stack);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground text-center max-w-md">
        An error occurred while loading this page. You can try again or go back
        home.
      </p>
      {isDev && (
        <pre className="text-left text-sm bg-muted p-4 rounded-md overflow-auto max-w-2xl">
          {error.message}
          {error.digest && `\nDigest: ${error.digest}`}
        </pre>
      )}
      {error.digest && !isDev && (
        <p className="text-sm text-muted-foreground">
          Error ID: {error.digest} — check your deployment logs for details.
        </p>
      )}
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
