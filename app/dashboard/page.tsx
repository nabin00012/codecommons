"use client";

import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  MessageSquare,
  Code,
  FolderGit2,
  Users,
  Trophy,
  Settings,
} from "lucide-react";

const quickActions = [
  {
    title: "Classrooms",
    description: "Access your courses and materials",
    href: "/dashboard/classrooms",
    icon: <BookOpen className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Assignments",
    description: "View and submit your assignments",
    href: "/dashboard/assignments",
    icon: <Calendar className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Community",
    description: "Ask questions and help others",
    href: "/dashboard/community",
    icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Code Editor",
    description: "Write and test your code",
    href: "/dashboard/code-editor",
    icon: <Code className="h-6 w-6 text-orange-500" />,
  },
  {
    title: "Projects",
    description: "Manage your projects",
    href: "/dashboard/projects",
    icon: <FolderGit2 className="h-6 w-6 text-indigo-500" />,
  },
  {
    title: "Leaderboard",
    description: "See top contributors",
    href: "/leaderboard",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />,
  },
];

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {user?.role === "admin" 
              ? "Manage the platform and oversee all activities"
              : user?.role === "teacher"
              ? "Create and manage your classrooms"
              : "Continue your learning journey"}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="mr-3">
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Your recent activity will appear here as you use the platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}