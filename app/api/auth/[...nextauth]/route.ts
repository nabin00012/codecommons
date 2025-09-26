import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

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
          
          // Auto-provision admin if it's admin email
          if (credentials.email === "admin@jainuniversity.ac.in") {
            const hashedPassword = await bcrypt.hash("admin123", 12);
            await db.collection("users").updateOne(
              { email: "admin@jainuniversity.ac.in" },
              {
                $set: {
                  email: "admin@jainuniversity.ac.in",
                  password: hashedPassword,
                  name: "Jain University Admin",
                  role: "admin",
                  department: "administration",
                  onboardingCompleted: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
              },
              { upsert: true }
            );
          }

          const user = await db.collection("users").findOne({
            email: credentials.email,
          });

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
            section: user.section || "",
            year: user.year || "",
            specialization: user.specialization || "",
            onboardingCompleted: user.onboardingCompleted || false,
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
    maxAge: 30 * 24 * 60 * 60,
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
        token.section = (user as any).section;
        token.year = (user as any).year;
        token.specialization = (user as any).specialization;
        token.onboardingCompleted = (user as any).onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string;
        session.user.section = token.section as string;
        session.user.year = token.year as string;
        session.user.specialization = token.specialization as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
});

export { handler as GET, handler as POST };
