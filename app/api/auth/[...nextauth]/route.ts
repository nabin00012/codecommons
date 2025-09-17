import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  providers: authConfig.providers,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: authConfig.callbacks,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
