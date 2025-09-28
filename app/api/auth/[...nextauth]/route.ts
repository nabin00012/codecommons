import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";

export async function GET(request: Request) {
  return NextAuth(authConfig)(request);
}

export async function POST(request: Request) {
  return NextAuth(authConfig)(request);
}
