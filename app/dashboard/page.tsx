"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 sm:p-6 text-white shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm sm:text-base text-blue-100">
              Here's an overview of your learning journey
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div
              className="bg-card rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border border-border/50"
              onClick={() => router.push("/dashboard/classrooms")}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Classrooms
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Access your learning spaces
              </p>
            </div>
            <div
              className="bg-card rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border border-border/50"
              onClick={() => router.push("/dashboard/assignments")}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Assignments
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                View and manage your tasks
              </p>
            </div>
            <div
              className="bg-card rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border border-border/50"
              onClick={() => router.push("/dashboard/profile")}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Profile</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your account settings
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg p-4 sm:p-6 shadow-md border border-border/50">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground">
                Your recent activity will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
