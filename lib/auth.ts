import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Create NextAuth helpers and route handlers (NextAuth v5 style)
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const { GET, POST } = handlers;

export type { UserRole } from "./auth.config";
