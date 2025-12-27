import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireAdmin(): Promise<{
  id: string;
  email?: string | null;
  role?: string | null;
}> {
  const user = await requireAuth();
  // For now, all authenticated users are admins
  // Future: check user.role === 'admin'

  // Type assertion: session.user.id should always be present after callbacks
  if (!user.id) {
    throw new Error("Unauthorized: User ID is missing");
  }

  return { id: user.id, email: user.email, role: user.role };
}

export function canEditArticle(
  user: { id: string; role?: string },
  article: { createdBy: string }
) {
  // Explicit permission logic
  return article.createdBy === user.id || user.role === "admin";
}
