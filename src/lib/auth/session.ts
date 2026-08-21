import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/lib/auth/errors";
import { isAdminRole } from "@/lib/auth/roles";

export interface AdminUser {
  id: string;
  email?: string | null;
  role: "admin";
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuthUser() {
  const user = await getSessionUser();

  if (!user?.id) {
    throw new AuthenticationError();
  }

  return user;
}

export async function requireAdminUser(): Promise<AdminUser> {
  const user = await requireAuthUser();

  if (!isAdminRole(user.role)) {
    throw new AuthorizationError();
  }

  return {
    id: user.id,
    email: user.email,
    role: "admin",
  };
}

export async function requireAdminPage(): Promise<AdminUser> {
  try {
    return await requireAdminUser();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect("/login");
    }

    if (error instanceof AuthorizationError) {
      redirect("/login?error=AccessDenied");
    }

    throw error;
  }
}
