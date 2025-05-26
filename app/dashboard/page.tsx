"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      setIsRedirecting(true);
      router.replace("/dashboard/classrooms");
    }
  }, [user, loading, router, isRedirecting]);

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

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </ProtectedRoute>
  );
}
