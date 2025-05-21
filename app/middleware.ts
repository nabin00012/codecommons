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
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow access to public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => {
    // Convert protected path pattern to regex
    const pattern = protectedPath.replace("[id]", "[^/]+");
    return new RegExp(`^${pattern}`).test(path);
  });

  if (isProtectedPath) {
    // Check for token in cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirect to login if no token is found
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

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
