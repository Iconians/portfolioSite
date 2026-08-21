import { type NextRequest, NextResponse } from "next/server";
import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function getClientIdentifier(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(`auth:signin:${clientId}`, 5, 60_000);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = SignInSchema.parse(await req.json());

    await signIn("credentials", {
      email: body.email,
      password: body.password,
      redirect: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }
}
