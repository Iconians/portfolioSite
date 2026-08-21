import { getAuthSecret } from "@/lib/auth/env";

import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config shared by middleware (JWT decode only) and auth.ts.
 * Do not import Node-only modules (bcrypt, Prisma, etc.) here.
 */
export const authConfig = {
  secret: getAuthSecret(),
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
