import type { NextAuthConfig } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";
import type { Session as NextAuthSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "./services/auth";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectToDatabase } from "./mongodb";
import clientPromiseDefault from "./mongodb";

// Use NextAuth's built-in types since they're already extended in auth.config.ts

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromiseDefault as any),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await authService.login(
            credentials.email,
            credentials.password
          );

          if (!response?._id) {
            throw new Error("Invalid credentials");
          }

          return {
            id: response._id,
            name: response.name,
            email: response.email,
            role: response.role,
            department: response.department || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Invalid credentials");
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
        token.section = user.section;
        token.year = user.year;
        token.specialization = user.specialization;
        token.onboardingCompleted = user.onboardingCompleted;
      } else if (token.email) {
        try {
          const { db } = await connectToDatabase();
          const dbUser = await db
            .collection("users")
            .findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role || token.role;
            token.department = dbUser.department || "";
            token.section = dbUser.section || "";
            token.year = dbUser.year ? String(dbUser.year) : "";
            token.specialization = dbUser.specialization || "";
            token.onboardingCompleted = dbUser.onboardingCompleted ?? false;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.department = token.department;
        session.user.section = token.section;
        session.user.year = token.year;
        session.user.specialization = token.specialization;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(connectToDatabase()),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.department = user.department;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
  },
});

const authHandler = NextAuth(authOptions);

export default authHandler;
export const auth = authHandler;

export type Session = Awaited<ReturnType<typeof authHandler>>;
export type User = NonNullable<Session>["user"];
