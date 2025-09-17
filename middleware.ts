import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProd = process.env.NODE_ENV === "production";

const publicPrefixes = [
  "/",
  "/login",
  "/register",
  "/api/auth",
  "/_next",
  "/static",
  "/favicon.ico",
  "/placeholder.svg",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow static and public prefixes
  const isPublic = publicPrefixes.some((p) => path.startsWith(p));
  if (isPublic) return NextResponse.next();

  // JWT cookie set by NextAuth
  const token = request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
