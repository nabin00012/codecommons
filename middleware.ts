import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { safeGetCookie } from "@/lib/safe-fetch";

const isProd = process.env.NODE_ENV === "production";

const publicPrefixes = [
  "/",
  "/login",
  "/register",
  "/onboarding",
  "/api/auth",
  "/api/projects",
  "/_next",
  "/static",
  "/favicon.ico",
  "/placeholder.svg",
  "/sitemap.xml",
  "/robots.txt",
];

// Pages that don't require profile completion
const profileNotRequiredPaths = [
  "/complete-profile",
  "/settings",
  "/profile",
  "/api/",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow static and public prefixes
  const isPublic = publicPrefixes.some((p) => path.startsWith(p));
  if (isPublic) return NextResponse.next();

  // Check for auth tokens (both NextAuth and custom)
  const token = 
    safeGetCookie(request.cookies, "next-auth.session-token") ||
    safeGetCookie(request.cookies, "__Secure-next-auth.session-token") ||
    safeGetCookie(request.cookies, "auth-token") ||
    safeGetCookie(request.cookies, "token");

  if (!token) {
    // Don't redirect API routes, return 401 instead
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
