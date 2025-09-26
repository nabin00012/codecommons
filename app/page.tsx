"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Code,
  Users,
  Award,
  Trophy,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Calendar,
  FolderGit2,
  Brain,
  Sparkles,
  Zap,
  ShieldCheck,
  GraduationCap,
  Rocket,
} from "lucide-react";
import { DemoQuestions } from "@/components/demo-questions";
import { PointAllocationExplainer } from "@/components/point-allocation-explainer";
import Footer from "@/components/footer";

const featureHighlights = [
  {
    title: "Guided Courses",
    description:
      "Structured learning paths designed with faculty to help you master core concepts step by step.",
    icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Hands-on Practice",
    description:
      "Solve live challenges, participate in hackathons, and collaborate on industry-level projects.",
    icon: <Code className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Community Support",
    description:
      "Discuss ideas, get feedback, and grow with peers, mentors, and faculty in real-time.",
    icon: <Users className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "Career Ready",
    description:
      "Build your portfolio, earn badges, and showcase achievements that matter to recruiters.",
    icon: <Award className="h-6 w-6 text-amber-500" />,
  },
];

const stats = [
  { value: "6", label: "Engineering Departments", icon: <Sparkles className="h-5 w-5" /> },
  { value: "70+", label: "Active Classrooms", icon: <BookOpen className="h-5 w-5" /> },
  { value: "500+", label: "Projects Showcased", icon: <FolderGit2 className="h-5 w-5" /> },
  { value: "1,200+", label: "Students Collaborating", icon: <Users className="h-5 w-5" /> },
];

const journeySteps = [
  {
    title: "Sign Up & Choose Your Branch",
    description:
      "Register with your Jain University email, pick your department, section, and interests.",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    title: "Join Classrooms & Communities",
    description:
      "Access branch-specific classrooms, study groups, and discussion forums instantly.",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Learn, Build, Showcase",
    description:
      "Use the Monaco-powered editor, submit assignments, and share your best work.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Earn Recognition",
    description:
      "Climb the leaderboard, earn badges, and present your portfolio to hiring partners.",
    icon: <Trophy className="h-5 w-5" />,
  },
];

const communityMentions = [
  {
    title: "AI & ML Guild",
    description: "Weekly research reviews, Kaggle competitions, and ML project clinics.",
  },
  {
    title: "Web Innovators Club",
    description: "Full-stack build nights, UI/UX critique sessions, and product demos.",
  },
  {
    title: "Robotics & IoT Circle",
    description: "Hardware prototyping labs, embedded systems workshops, and live demos.",
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#2563eb0d,_transparent_60%),radial-gradient(circle_at_bottom,_#9333ea12,_transparent_55%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1 text-sm font-medium text-blue-600 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/30 dark:text-blue-200">
                  <ShieldCheck className="h-4 w-4" /> Official Campus Platform
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Empowering Jain University Engineers to learn, build, and shine together.
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  CodeCommons brings students, faculty, and alumni into one collaborative hub with guided learning journeys, real-time discussions, and portfolio-ready projects tailored for the School of Engineering.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Join CodeCommons
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/30"
                    >
                      I already have an account
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  {stats.map((stat) => (
                    <Card key={stat.label} className="border-0 bg-white/80 shadow-md backdrop-blur dark:bg-slate-900/60">
                      <CardContent className="flex flex-col items-start gap-2 p-4">
                        <span className="flex items-center gap-2 text-sm font-medium text-blue-500 dark:text-blue-300">
                          {stat.icon}
                          {stat.label}
                        </span>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl" />
                <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-lg dark:bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      Everything you need to thrive in 2025 and beyond
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">
                      Curated for Jain University's engineering community.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {featureHighlights.map((feature) => (
                      <div key={feature.title} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900/80">
                        <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white/80 dark:bg-slate-950/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                Your CodeCommons journey
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Built for every step of your engineering career
              </h2>
              <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                From your first year to final placement, CodeCommons adapts to your interests and goals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {journeySteps.map((step) => (
                <Card key={step.title} className="border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900/80">
                  <CardContent className="space-y-3 p-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                      {step.icon}
                      Step
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  A vibrant community of builders & innovators
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-xl">
                  Join specialized clubs, project guilds, and research circles. Collaborate on capstone projects, launch startups, and get mentorship from alumni.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                    <Brain className="mr-2 h-4 w-4" /> AI & ML Labs
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                    <Code className="mr-2 h-4 w-4" /> Dev Sprints
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                    <Calendar className="mr-2 h-4 w-4" /> Weekend Workshops
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {communityMentions.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-6">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Tools crafted for engineering excellence
              </h2>
              <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Explore the ecosystem that powers classroom learning, project execution, and skill development at Jain University.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[
                {
                  title: "Live Classrooms",
                  description: "Real-time attendance, assignment tracking, and teacher dashboards integrated with campus workflow.",
                  icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
                  link: "/dashboard/classrooms",
                },
                {
                  title: "Monaco Code Studio",
                  description: "Multi-language editor with AI hints, collaborative coding sessions, and submission history.",
                  icon: <Code className="h-6 w-6 text-purple-500" />,
                  link: "/dashboard/code-editor",
                },
                {
                  title: "Community Town Hall",
                  description: "Ask questions, host polls, share resources, and build your reputation with verified answers.",
                  icon: <MessageSquare className="h-6 w-6 text-rose-500" />,
                  link: "/dashboard/community",
                },
                {
                  title: "Showcase Portfolio",
                  description: "Publish capstone projects, get peer feedback, and share with internship partners.",
                  icon: <FolderGit2 className="h-6 w-6 text-emerald-500" />,
                  link: "/projects",
                },
                {
                  title: "Events & Workshops",
                  description: "Stay in sync with campus events, technical workshops, and alumni masterclasses.",
                  icon: <Calendar className="h-6 w-6 text-orange-500" />,
                  link: "/dashboard/community",
                },
                {
                  title: "Leaderboard & Badges",
                  description: "Get recognized for your contributions, win challenges, and inspire your cohort.",
                  icon: <Award className="h-6 w-6 text-yellow-500" />,
                  link: "/leaderboard",
                },
              ].map((feature) => (
                <Card key={feature.title} className="border border-slate-100 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900/80">
                  <CardHeader className="flex items-start gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={feature.link} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300">
                      Explore feature
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Point System & Leaderboard */}
        <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 dark:bg-slate-950/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 bg-white shadow-lg dark:bg-slate-900/80">
                <CardHeader>
                  <div className="flex items-center gap-3 text-blue-600 dark:text-blue-300">
                    <TrendingUp className="h-5 w-5" />
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      Point Allocation & Recognition
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Earn points by answering questions, completing assignments, contributing to projects, and leading community initiatives.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PointAllocationExplainer />
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-lg dark:bg-slate-900/80">
                <CardHeader className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-amber-500">
                    <Trophy className="h-6 w-6" />
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      Current Community Trailblazers
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Celebrating students making the strongest impact across departments this semester.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "Rahul Singh",
                      role: "CSE • AI & ML Guild",
                      points: "1,245 pts",
                      badges: ["Top Contributor", "Python Expert"],
                    },
                    {
                      name: "Ananya Patel",
                      role: "ECE • Embedded Systems Lead",
                      points: "980 pts",
                      badges: ["Community Mentor", "Rising Star"],
                    },
                    {
                      name: "Nabin Chapagain",
                      role: "IT • Web Innovators Club",
                      points: "875 pts",
                      badges: ["UI Prototyper", "Consistent Contributor"],
                    },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/80">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {member.role}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.badges.map((badge) => (
                            <span key={badge} className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {member.points}
                      </span>
                    </div>
                  ))}
                  <Link href="/leaderboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-800/50 dark:text-emerald-300 dark:hover:bg-emerald-900/30">
                    View full leaderboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Questions */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl">
            <Card className="border-0 bg-white shadow-lg dark:bg-slate-900/80">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  See CodeCommons in action
                </CardTitle>
                <CardDescription className="text-base text-slate-600 dark:text-slate-300">
                  Explore demo questions, collaborative answers, and the interactive code experience before you even sign in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DemoQuestions />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 shadow-xl">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.2),_transparent_40%)]" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-white">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Ready to transform the way you learn and collaborate?
                  </h2>
                  <p className="text-base text-white/80 max-w-xl">
                    Join thousands of engineers at Jain University using CodeCommons to accelerate their academic journey, build impressive portfolios, and launch impactful careers.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-white text-blue-700 hover:bg-blue-50">
                      Create your account
                    </Button>
                  </Link>
                  <Link href="/leaderboard" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-white text-white hover:bg-white/10"
                    >
                      Explore community wins
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
