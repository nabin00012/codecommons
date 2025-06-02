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
  "/about",
  "/contact",
  "/api/auth",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Always allow access to static files and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => {
    const pattern = protectedPath.replace("[id]", "[^/]+");
    return new RegExp(`^${pattern}`).test(path);
  });

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path);

  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // Always allow access to home page and auth pages
  if (path === "/" || isPublicPath) {
    return NextResponse.next();
  }

  // If path is protected and no token exists, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to all other paths
  return NextResponse.next();
}

// Update the matcher configuration to be more specific
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
