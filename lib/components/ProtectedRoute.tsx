"use client";

import { useEffect, useState } from "react";
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !isRedirecting) {
      if (!user) {
        setIsRedirecting(true);
        router.push("/login");
        return;
      }

      if (requireTeacher && user.role !== "teacher") {
        setIsRedirecting(true);
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, router, requireTeacher, isRedirecting]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || isRedirecting) {
    return null;
  }

  return <>{children}</>;
}
