import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/register",
  "/about",
  "/contact",
];

// Add API paths that don't require authentication
const publicApiPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware processing path:", pathname);

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    console.log("Path is public, allowing access");
    return NextResponse.next();
  }

  // Check if the path is an API route
  const isApiRoute = pathname.startsWith("/api/");
  if (isApiRoute) {
    // Allow public API paths
    if (publicApiPaths.some((path) => pathname.endsWith(path))) {
      console.log("API path is public, allowing access");
      return NextResponse.next();
    }

    console.log("Path is API route, checking Authorization header");
    // For API routes, check for Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No valid Authorization header found");
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    console.log("Valid Authorization header found");
    return NextResponse.next();
  }

  // For non-API routes, check for token in cookies
  const token = request.cookies.get("token")?.value;
  console.log("Checking for token in cookies:", token ? "exists" : "none");

  if (!token) {
    console.log("No token found, redirecting to login");
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  console.log("Token found, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
