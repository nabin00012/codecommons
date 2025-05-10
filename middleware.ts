import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authService } from "@/lib/services/auth";

// Add paths that should be protected
const protectedPaths = [
  "/dashboard",
  "/dashboard/classrooms",
  "/dashboard/classrooms/[id]",
  "/dashboard/classrooms/[id]/assignments",
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => {
    // Convert protected path pattern to regex
    const pattern = protectedPath.replace("[id]", "[^/]+");
    return new RegExp(`^${pattern}`).test(path);
  });

  if (isProtectedPath) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify token and get user role
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();
      const userRole = data.user.role;

      // For classroom routes, check if user is authorized
      if (path.includes("/classrooms/") && path !== "/dashboard/classrooms") {
        const classroomId = path.split("/")[3]; // Get classroom ID from URL
        const classroomResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/classrooms/${classroomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!classroomResponse.ok) {
          // If user is not authorized to access the classroom, redirect to classrooms list
          return NextResponse.redirect(
            new URL("/dashboard/classrooms", request.url)
          );
        }
      }
    } catch (error) {
      // If token verification fails, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard/classrooms/:path*"],
};
