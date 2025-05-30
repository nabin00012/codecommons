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
      <div className="container py-8">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-blue-100">
              Here's an overview of your learning journey
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/dashboard/classrooms")}
            >
              <h2 className="text-xl font-semibold mb-2">Classrooms</h2>
              <p className="text-muted-foreground">
                Access your learning spaces
              </p>
            </div>
            <div
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/dashboard/assignments")}
            >
              <h2 className="text-xl font-semibold mb-2">Assignments</h2>
              <p className="text-muted-foreground">
                View and manage your tasks
              </p>
            </div>
            <div
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/dashboard/profile")}
            >
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <p className="text-muted-foreground">
                Manage your account settings
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your recent activity will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
