import { isAdminRole } from "@/lib/auth/roles";
import {
  requireAdminUser,
  requireAuthUser,
} from "@/lib/auth/session";


export {
  AuthenticationError,
  AuthorizationError,
  isAuthenticationError,
  isAuthorizationError,
  isAuthError,
} from "@/lib/auth/errors";
export {
  getSessionUser,
  requireAdminPage,
  requireAdminUser,
  requireAuthUser,
  type AdminUser,
} from "@/lib/auth/session";

/** @deprecated Prefer requireAuthUser — kept for existing imports */
export async function requireAuth() {
  return requireAuthUser();
}

/** Validates authenticated admin role for server actions, API routes, and data mutations. */
export async function requireAdmin() {
  return requireAdminUser();
}

export function canEditArticle(
  user: { id: string; role?: string | null },
  article: { createdBy: string }
) {
  return article.createdBy === user.id || isAdminRole(user.role);
}
