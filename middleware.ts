import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify",
  "/placeholder.svg",
  "/favicon.ico",
  "/_next",
  "/static",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Middleware processing path:", path);

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  if (isPublicPath) {
    console.log("Path is public, allowing access");
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get("token")?.value;
  console.log("Checking for token in cookies:", token ? "exists" : "none");

  if (!token) {
    console.log("No token found, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(loginUrl);
  }

  console.log("Token found, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
