import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jainuniversity.ac.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { db } = await connectToDatabase();
          let user = await db.collection("users").findOne({
            email: credentials.email,
          });

          // Auto-provision admin if missing or missing password
          if (credentials.email === ADMIN_EMAIL) {
            if (!user || !user.password) {
              const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
              const adminData = {
                email: ADMIN_EMAIL,
                password: hashedPassword,
                name: "Administrator",
                role: "admin",
                department: "administration",
                onboardingCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              if (!user) {
                const result = await db.collection("users").insertOne(adminData);
                user = { _id: result.insertedId, ...adminData };
              } else {
                await db.collection("users").updateOne(
                  { _id: user._id },
                  { $set: adminData }
                );
                user = { ...user, ...adminData };
              }
            }
          }

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "student",
            department: user.department || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
