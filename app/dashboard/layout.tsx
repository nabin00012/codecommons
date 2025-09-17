"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Open sidebar by default on desktop screens
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = window.matchMedia("(min-width: 1280px)").matches; // xl and up
      if (isDesktop) setIsSidebarOpen(true);
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Mobile Sidebar */}
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {/* Mobile/Laptop Header */}
          <div className="2xl:hidden flex items-center justify-between p-4 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="2xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
