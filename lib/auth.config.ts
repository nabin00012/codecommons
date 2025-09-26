import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongodb";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

export type UserRole = "student" | "teacher" | "admin";

const isProd = process.env.NODE_ENV === "production";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    department: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: UserRole;
      department: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    department: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            if (!isProd) console.log("Missing credentials");
            return null;
          }

          const { db } = await connectToDatabase();
          if (!isProd) console.log("Connected to database for auth");

          const user = await db
            .collection("users")
            .findOne({ email: credentials.email });
          if (!isProd) console.log("User found:", user ? "yes" : "no");

          if (!user || !user.password) {
            if (!isProd)
              console.log("No user found with email:", credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password.toString(),
            user.password.toString()
          );
          if (!isProd) console.log("Password valid:", isValid);

          if (!isValid) {
            if (!isProd)
              console.log("Invalid password for user:", credentials.email);
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            department: user.department || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role as UserRole;
        session.user.department = token.department;
      }
      return session;
    },
  },
};
