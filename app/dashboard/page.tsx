"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Trophy,
  Calendar,
  BookOpen,
  MessageSquare,
  Code,
  Brain,
  Star,
  Sparkles,
  ArrowRight,
  FolderGit2,
} from "lucide-react";

const spotlightCards = [
  {
    title: "AI Innovation Sprint",
    description: "Join cross-department teams building real-time vehicle tracking systems in this week's hackathon.",
    action: "Participate",
    href: "/dashboard/codecorner",
    icon: <Rocket className="h-6 w-6" />,
    gradient: "from-blue-500 via-blue-400 to-indigo-500",
  },
  {
    title: "Capstone Showcase Portal",
    description: "IT & CSE final-year students present their capstone demos this Friday with faculty review.",
    action: "View schedule",
    href: "/dashboard/projects",
    icon: <FolderGit2 className="h-6 w-6" />,
    gradient: "from-purple-500 via-purple-400 to-pink-500",
  },
];

const quickLinks = [
  {
    title: "Classrooms",
    description: "Access course dashboards, materials, and attendance for your section.",
    href: "/dashboard/classrooms",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Assignments",
    description: "Track deadlines, submit work, and receive feedback in real time.",
    href: "/dashboard/assignments",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Community",
    description: "Ask and answer questions, join study groups, and build your reputation.",
    href: "/dashboard/community",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Code Studio",
    description: "Launch the Monaco-powered editor for labs, challenges, and collaborative coding.",
    href: "/dashboard/code-editor",
    icon: <Code className="h-5 w-5" />,
  },
];

const leaderboard = [
  {
    name: "Vani Ramakrishnan",
    dept: "CSE",
    points: 1280,
    badge: "Capstone Champion",
  },
  {
    name: "Pranav Lokesh",
    dept: "ECE",
    points: 1185,
    badge: "Signal Processing Mentor",
  },
  {
    name: "Divya Sharma",
    dept: "IT",
    points: 1090,
    badge: "UI/UX Visionary",
  },
];

const inspiration = [
  {
    title: "Build your AI-powered attendance tracker",
    description: "Use OpenCV and TensorFlow to detect faces, log attendance, and sync to the CodeCommons cloud.",
  },
  {
    title: "Microservices with FastAPI",
    description: "ECE + IT collaboration deploying microservices on Docker with observability dashboards.",
  },
  {
    title: "Design an autonomous rover",
    description: "Mechanical meets AI with ROS for path planning and real-time obstacle avoidance.",
  },
];

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [user, loading]);

  const heroTitle = user?.role === "admin" ? "Command the campus" : user?.role === "teacher" ? "Lead your classrooms" : "Ignite your engineering journey";
  const heroSubtitle =
    user?.role === "admin"
      ? "Oversee departments, mentor teams, and showcase campus impact with live analytics."
      : user?.role === "teacher"
      ? "Design engaging labs, track student progress, and collaborate with fellow faculty."
      : "Track progress, collaborate with peers, and showcase achievements across departments.";

  const quickActions = user?.role === "admin"
    ? [
        {
          title: "Department Analytics",
          description: "Review engagement across classrooms and communities.",
          href: "/dashboard/analytics",
          icon: <Star className="h-5 w-5" />,
        },
        ...quickLinks.slice(0, 3),
      ]
    : quickLinks;

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#101b33] to-[#111827] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%),radial-gradient(circle_at_center,_rgba(192,38,211,0.25),_transparent_50%)]" />
        {showConfetti && (
          <div className="pointer-events-none absolute inset-0 animate-[pulse_4s_infinite] bg-[radial-gradient(circle,_rgba(255,255,255,0.2),_transparent_55%)]" />
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
          <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-slate-200">
                <Sparkles className="h-4 w-4 text-yellow-300" /> Jain University • School of Engineering
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white lg:text-5xl">
                {heroTitle}
              </h1>
              <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                {heroSubtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/10 p-3">
                  <Brain className="h-6 w-6 text-teal-200" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-wide text-teal-200">Weekly spotlight</p>
                  <h2 className="text-lg font-semibold">
                    Inter-department quantum computing lab launches this Monday.
                  </h2>
                  <p className="text-sm text-slate-200">
                    Collaborate with Physics and AIML faculty to apply quantum algorithms to real datasets.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/dashboard/community">Co-create your project plan</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </header>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {spotlightCards.map((spotlight) => (
              <motion.div
                key={spotlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`relative overflow-hidden border-0 bg-gradient-to-r ${spotlight.gradient} text-white shadow-2xl`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
                  <CardHeader className="relative flex flex-row items-start gap-3">
                    <div className="rounded-2xl bg-white/15 p-3 text-white">
                      {spotlight.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        {spotlight.title}
                      </CardTitle>
                      <CardDescription className="text-white/80 text-sm">
                        {spotlight.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white/20"
                      asChild
                    >
                      <Link href={spotlight.href}>
                        {spotlight.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((link) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="group h-full border-white/10 bg-white/5 text-white transition hover:-translate-y-2 hover:bg-white/10">
                  <CardHeader className="flex flex-row items-start gap-3">
                    <div className="rounded-lg bg-white/10 p-2 text-white group-hover:bg-white/20">
                      {link.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {link.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-white/80">
                        {link.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="text-sm text-white/80 hover:text-white"
                      asChild
                    >
                      <Link href={link.href}>
                        Go to {link.title.toLowerCase()}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-0 bg-white/10 text-white shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Personalized roadmap</CardTitle>
                  <CardDescription className="text-sm text-white/70">
                    Keep momentum with faculty-curated roadmap for your branch.
                  </CardDescription>
                </div>
                <Brain className="h-6 w-6 text-teal-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                {inspiration.map((idea) => (
                  <div
                    key={idea.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <h3 className="text-sm font-semibold text-white">{idea.title}</h3>
                    <p className="text-xs text-white/70">{idea.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/10 text-white shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Top performers this week</CardTitle>
                  <CardDescription className="text-sm text-white/70">
                    Celebrate peers blazing trails across departments.
                  </CardDescription>
                </div>
                <Trophy className="h-6 w-6 text-amber-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboard.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{member.name}</p>
                      <p className="text-xs text-white/70">{member.dept} • {member.badge}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-300">
                      {member.points}
                    </span>
                  </div>
                ))}
                <Button variant="ghost" className="text-sm text-white/80" asChild>
                  <Link href="/leaderboard">
                    View full leaderboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
