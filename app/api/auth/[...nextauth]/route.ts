import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function GET(request: Request) {
  return NextAuth(authConfig)(request);
}

export async function POST(request: Request) {
  return NextAuth(authConfig)(request);
}
