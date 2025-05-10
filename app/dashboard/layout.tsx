"use client";

import { Sidebar } from "@/components/sidebar";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
