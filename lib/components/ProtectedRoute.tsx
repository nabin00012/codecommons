"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireTeacher?: boolean;
}

export default function ProtectedRoute({
  children,
  requireTeacher = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (requireTeacher && user.role !== "teacher") {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, router, requireTeacher]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
