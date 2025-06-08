import type { NextAuthConfig } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";
import type { Session as NextAuthSession } from "next-auth";
import type { User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "./services/auth";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectToDatabase } from "./mongodb";
import { User } from "./models/user";

interface User extends NextAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface CustomJWT extends NextAuthJWT {
  id: string;
  role: string;
  accessToken: string;
}

interface CustomSession extends NextAuthSession {
  user: {
    id: string;
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  expires: string;
}

export const authOptions: NextAuthConfig = {
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

          if (!response?.token || !response?.user) {
            throw new Error("Invalid credentials");
          }

          return {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            token: response.token,
          } as User;
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
        const customUser = user as User;
        token.id = customUser.id;
        token.role = customUser.role;
        token.accessToken = customUser.token;
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      const customToken = token as CustomJWT;
      const customSession = session as unknown as CustomSession;

      customSession.user = {
        id: customToken.id,
        _id: customToken.id,
        name: customToken.name as string,
        email: customToken.email as string,
        role: customToken.role,
      };
      customSession.token = customToken.accessToken;
      customSession.expires = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      return customSession;
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

export type Session = Awaited<ReturnType<typeof auth>>;
export type User = NonNullable<Session>["user"];
