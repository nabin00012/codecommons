import { DefaultSession } from "next-auth";
import { User } from "@/lib/models/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "teacher" | "admin";
      department: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "student" | "teacher" | "admin";
    department: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "student" | "teacher" | "admin";
    department: string;
  }
}
