import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db/client";
import { compare } from "bcryptjs";

// Get AUTH_SECRET - validate at runtime
const authSecret = process.env.AUTH_SECRET;

// Validate AUTH_SECRET at runtime (not during build)
if (!authSecret && process.env.NODE_ENV === "production") {
  console.error("AUTH_SECRET is required in production");
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: authSecret || "fallback-secret-for-build-only", // Use fallback during build only
  trustHost: true, // Required for Vercel deployments
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
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
});
