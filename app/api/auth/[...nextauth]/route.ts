import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const handler = NextAuth(authConfig);

export async function GET(request: Request) {
  return handler(request as any);
}

export async function POST(request: Request) {
  return handler(request as any);
}
