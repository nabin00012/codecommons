import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectToDatabase } from "@/lib/mongodb";

const handler = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(connectToDatabase().then(({ client }) => client)),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
  },
});

export { handler as GET, handler as POST };
