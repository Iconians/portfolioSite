"use client";

// Client-side auth utilities
export async function signInClient(email: string, password: string) {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data.error || "Sign in failed" };
  }

  return { success: true };
}
