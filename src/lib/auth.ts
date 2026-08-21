import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/lib/auth/config";
import { validateAuthEnvironment } from "@/lib/auth/env";
import { isAdminRole } from "@/lib/auth/roles";

validateAuthEnvironment();

async function getDb() {
  const { db } = await import("@/lib/db/client");
  return db;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const db = await getDb();
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !isAdminRole(user.role)) {
          return null;
        }

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
});
