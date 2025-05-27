import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be protected
const protectedPaths = [
  "/dashboard",
  "/dashboard/classrooms",
  "/dashboard/classrooms/[id]",
  "/dashboard/classrooms/[id]/assignments",
  "/dashboard/assignments",
  "/dashboard/discussions",
  "/dashboard/students",
  "/dashboard/settings",
  "/dashboard/help",
  "/profile",
  "/achievements",
  "/challenges",
  "/community",
  "/leaderboard",
];

// Add paths that should be public
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/signup",
  "/about",
  "/contact",
  "/api/auth",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Debug logging
  console.log("Middleware - Current path:", path);
  console.log("Middleware - Is root path:", path === "/");
  console.log("Middleware - Is public path:", publicPaths.includes(path));

  // Always allow access to root path and public paths
  if (path === "/" || publicPaths.includes(path)) {
    console.log("Middleware - Allowing access to public path");
    return NextResponse.next();
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => {
    const pattern = protectedPath.replace("[id]", "[^/]+");
    return new RegExp(`^${pattern}`).test(path);
  });

  console.log("Middleware - Is protected path:", isProtectedPath);

  if (isProtectedPath) {
    const token = request.cookies.get("token")?.value;
    console.log("Middleware - Token exists:", !!token);

    if (!token) {
      console.log("Middleware - Redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  console.log("Middleware - Allowing access");
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
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
