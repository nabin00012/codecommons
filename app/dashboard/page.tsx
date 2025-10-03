"use client";

import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  MessageSquare,
  Code,
  FolderGit2,
  Users,
  Trophy,
  Settings,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Activity,
} from "lucide-react";
import { CosmicBackground } from "@/components/cosmic-background";
import { CosmicCardEffect } from "@/components/cosmic-card-effect";
import { useEffect, useState, useRef, useMemo } from "react";

// Custom hook for animated counters
function useAnimatedCounter(endValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    let startTime: number;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easeOutQuart
      );

      setCount(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, endValue, duration, hasAnimated]);

  return { count, ref };
}

// Separate component for stat cards to use hooks properly
function StatCard({ stat, index }: { stat: any; index: number }) {
  const numericValue = parseInt(stat.value?.replace(/\D/g, "") || "0") || 0;
  const { count, ref } = useAnimatedCounter(numericValue, 1500);
  const progressValue = Math.floor(Math.random() * 40 + 60);

  return (
    <motion.div
      key={stat.title}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      ref={ref}
    >
      <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/50 cosmic-card">
        <CosmicCardEffect />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary cosmic-glow">
            {stat.icon}
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold cosmic-text mb-2">
            {count}
            {stat.value?.includes("+") && "+"}
          </div>
          <Progress
            value={progressValue}
            className="h-2 cosmic-progress"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {stat.change}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const quickActions = [
  {
    title: "My Classrooms",
    description: "Access your courses and materials",
    href: "/dashboard/classrooms",
    icon: <BookOpen className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
    bgColor:
      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    count: 5,
    glowColor: "shadow-blue-500/25",
  },
  {
    title: "Assignments",
    description: "View and submit your assignments",
    href: "/dashboard/assignments",
    icon: <Calendar className="h-6 w-6" />,
    color: "from-green-500 to-emerald-500",
    bgColor:
      "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    count: 3,
    glowColor: "shadow-green-500/25",
  },
  {
    title: "Code Editor",
    description: "Write and test your code",
    href: "/dashboard/code-editor",
    icon: <Code className="h-6 w-6" />,
    color: "from-orange-500 to-red-500",
    bgColor:
      "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
    glowColor: "shadow-orange-500/25",
  },
  {
    title: "Q&A Forum",
    description: "Ask questions and help others",
    href: "/dashboard/questions",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "from-purple-500 to-pink-500",
    bgColor:
      "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    count: 8,
    glowColor: "shadow-purple-500/25",
  },
  {
    title: "Projects",
    description: "Manage your projects",
    href: "/dashboard/projects",
    icon: <FolderGit2 className="h-6 w-6" />,
    color: "from-indigo-500 to-blue-500",
    bgColor:
      "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
    glowColor: "shadow-indigo-500/25",
  },
  {
    title: "Leaderboard",
    description: "See top contributors",
    href: "/leaderboard",
    icon: <Trophy className="h-6 w-6" />,
    color: "from-yellow-500 to-orange-500",
    bgColor:
      "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
    glowColor: "shadow-yellow-500/25",
  },
  {
    title: "Community",
    description: "Connect with fellow developers",
    href: "/community",
    icon: <Users className="h-6 w-6" />,
    color: "from-teal-500 to-green-500",
    bgColor:
      "bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20",
    glowColor: "shadow-teal-500/25",
  },
];

const stats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2 this week",
    icon: <FolderGit2 className="h-4 w-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Assignments Completed",
    value: "28",
    change: "+5 this month",
    icon: <Calendar className="h-4 w-4" />,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "Community Posts",
    value: "156",
    change: "+12 today",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Current Streak",
    value: "7 days",
    change: "Keep it up!",
    icon: <Zap className="h-4 w-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
];

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const leftPos = `${Math.random() * 100}%`;
            const topPos = `${Math.random() * 100}%`;
            const delay = Math.random() * 2;

            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: leftPos,
                  top: topPos,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: delay,
                }}
              />
            );
          })}
        </div>

        {/* Main loading spinner */}
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full relative"
          >
            {/* Inner spinning ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-1 border-2 border-transparent border-r-primary/50 rounded-full"
            />
          </motion.div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4 text-sm text-muted-foreground"
          >
            Loading your dashboard...
          </motion.p>
        </div>

        {/* Cosmic particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${20 + i * 8}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen overflow-hidden">
        {/* Cosmic Background */}
        <CosmicBackground />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
          <AnimatePresence>
            {mounted && (
              <>
                {/* Welcome Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <div className="relative mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="relative"
                      >
                        <Sparkles className="h-8 w-8 text-primary pulse-glow" />
                        {/* Sparkle particles around the icon */}
                        <div className="absolute inset-0">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-primary rounded-full"
                              style={{
                                top: `${
                                  20 + Math.sin((i * 60 * Math.PI) / 180) * 15
                                }px`,
                                left: `${
                                  20 + Math.cos((i * 60 * Math.PI) / 180) * 15
                                }px`,
                              }}
                              animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary/80 to-foreground/70 bg-clip-text text-transparent">
                        Welcome back, {user?.name || "User"}!
                      </h1>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute -top-4 -right-4">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full"
                          style={{
                            top: `${i * 8}px`,
                            left: `${i * 6}px`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-lg text-muted-foreground max-w-2xl"
                  >
                    {user?.role === "admin"
                      ? "Manage the platform and oversee all activities with powerful administrative tools"
                      : user?.role === "teacher"
                      ? "Create and manage your classrooms, inspire the next generation of developers"
                      : "Continue your learning journey, build amazing projects, and connect with the community"}
                  </motion.p>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                  {stats?.map((stat, index) => (
                    <StatCard key={stat.title} stat={stat} index={index} />
                  ))}
                </motion.div>

                {/* Main Navigation Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">Quick Access</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {quickActions?.map((action, index) => (
                      <motion.div
                        key={action?.title || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.4 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link href={action?.href || "#"}>
                          <Card
                            className={`cosmic-card relative overflow-hidden border-0 ${
                              action?.bgColor || "bg-gray-50"
                            } hover:shadow-2xl transition-all duration-500 group cursor-pointer h-full`}
                          >
                            {/* Cosmic spotlight effect */}
                            <div className="cosmic-spotlight absolute inset-0" />

                            {/* Animated cosmic border */}
                            <div className="cosmic-border absolute inset-0" />

                            {/* Floating particles */}
                            <div className="cosmic-particles absolute inset-0" />

                            {/* Cosmic glow effect */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                            />

                            {/* 3D Content wrapper */}
                            <div className="cosmic-content relative z-10 h-full flex flex-col">
                              <CardHeader className="relative pb-3">
                                <div className="flex items-center justify-between">
                                  <div
                                    className={`p-3 rounded-xl bg-gradient-to-r ${
                                      action?.color ||
                                      "from-gray-500 to-gray-600"
                                    } text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden`}
                                  >
                                    {/* Icon glow effect */}
                                    <div
                                      className={`absolute inset-0 bg-gradient-to-r ${
                                        action?.color ||
                                        "from-gray-500 to-gray-600"
                                      } opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                                    />
                                    <div className="relative z-10">
                                      {action?.icon || (
                                        <Activity className="h-6 w-6" />
                                      )}
                                    </div>
                                  </div>
                                  {action?.count && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-white/80 text-foreground border-0 backdrop-blur-sm shadow-lg animate-pulse"
                                    >
                                      {action.count}
                                    </Badge>
                                  )}
                                </div>
                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 relative z-10">
                                  {action?.title || "Section"}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="relative flex-1 flex flex-col">
                                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 flex-1 relative z-10">
                                  {action?.description ||
                                    "No description available"}
                                </p>

                                {/* Progress bar for visual appeal */}
                                <div className="mt-4 relative z-10">
                                  <Progress
                                    value={Math.random() * 100}
                                    className="h-1 bg-white/20"
                                  />
                                </div>

                                {/* Activity indicator */}
                                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                  <span>Active</span>
                                </div>
                              </CardContent>

                              {/* Hover effect overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="relative"
                >
                  <Card className="cosmic-glass relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <CardHeader className="relative">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        >
                          <Clock className="h-5 w-5 text-primary" />
                        </motion.div>
                        <CardTitle className="text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                          Recent Activity
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-3">
                        {[
                          {
                            id: 1,
                            title: "Completed JavaScript Assignment",
                            type: "assignment",
                            time: "2h ago",
                          },
                          {
                            id: 2,
                            title: "Joined React Classroom",
                            type: "classroom",
                            time: "5h ago",
                          },
                          {
                            id: 3,
                            title: "Submitted Project Proposal",
                            type: "project",
                            time: "1d ago",
                          },
                        ].map((activity, i) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i, duration: 0.4 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all duration-300 border border-transparent hover:border-primary/20"
                          >
                            <motion.div
                              className={`w-3 h-3 rounded-full ${
                                activity.type === "assignment"
                                  ? "bg-green-500"
                                  : activity.type === "classroom"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                              }`}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.5,
                              }}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium group-hover:text-primary transition-colors duration-200">
                                {activity.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.type} • {activity.time}
                              </p>
                            </div>
                            <motion.div
                              whileHover={{ rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Star className="h-4 w-4 text-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Activity summary */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            This week's activity
                          </span>
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-2 h-2 bg-green-500 rounded-full"
                            />
                            <span className="font-medium text-green-600">
                              High
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Cosmic Card Effect Hook */}
        <CosmicCardEffect />
      </div>
    </ProtectedRoute>
  );
}
