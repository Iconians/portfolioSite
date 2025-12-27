import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email?: string | null;
    role?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
  }
}
