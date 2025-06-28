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
  Target,
  Users,
  Award,
  Trophy,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Calendar,
  FolderGit2,
  Brain,
  Settings,
  HelpCircle,
} from "lucide-react";
import { DemoQuestions } from "@/components/demo-questions";
import { PointAllocationExplainer } from "@/components/point-allocation-explainer";
import Footer from "@/components/footer";

const featureCards = [
  {
    title: "Interactive Q&A",
    description:
      "Ask questions, get answers, and connect with peers in a dedicated space.",
    icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />,
    link: "/dashboard/questions",
  },
  {
    title: "Smart Code Editor",
    description:
      "Advanced code editor with syntax highlighting, auto-completion, and real-time collaboration.",
    icon: <Code className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />,
    link: "/dashboard/code-editor",
  },
  {
    title: "Classroom Management",
    description:
      "Create and manage virtual classrooms with assignments, materials, and student tracking.",
    icon: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />,
    link: "/dashboard/classrooms",
  },
  {
    title: "Community Discussions",
    description:
      "Engage in meaningful discussions, share knowledge, and learn from the community.",
    icon: <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />,
    link: "/dashboard/community",
  },
  {
    title: "Project Showcasing",
    description:
      "Share your projects with the community and get valuable feedback.",
    icon: <FolderGit2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />,
    link: "/projects",
  },
  {
    title: "Events & Workshops",
    description:
      "Join coding workshops, hackathons, and tech events organized by the community.",
    icon: <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />,
    link: "/dashboard/community",
  },
  {
    title: "Challenges & Competitions",
    description: "Test your skills against others and compete for top spots.",
    icon: <Target className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500" />,
    link: "/challenges",
  },
  {
    title: "Achievements & Leaderboards",
    description: "Earn badges for your contributions and see where you rank.",
    icon: <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />,
    link: "/leaderboard",
  },
  {
    title: "AI-Powered Learning",
    description:
      "Get intelligent code suggestions and explanations powered by advanced AI models.",
    icon: <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />,
    link: "/dashboard/code-editor",
  },
  {
    title: "Assignment Management",
    description:
      "Submit assignments, track progress, and receive feedback from teachers.",
    icon: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500" />,
    link: "/dashboard/assignments",
  },
  {
    title: "Study Groups",
    description:
      "Create and join study groups to collaborate on projects and share resources.",
    icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 text-violet-500" />,
    link: "/dashboard/community",
  },
];

// Mock leaderboard data for homepage
const topContributors = [
  {
    id: 1,
    name: "Rahul Singh",
    username: "rahulsingh",
    avatar: "/placeholder.svg",
    points: 1245,
    rank: 1,
    department: "Computer Science",
    badges: ["Top Contributor", "Python Expert"],
  },
  {
    id: 2,
    name: "Ananya Patel",
    username: "ananyapatel",
    avatar: "/placeholder.svg",
    points: 980,
    rank: 2,
    department: "Data Science",
    badges: ["Rising Star", "Data Science Enthusiast"],
  },
  {
    id: 3,
    name: "Nabin Chapagain",
    username: "nabinchapagain",
    avatar: "/placeholder.svg",
    points: 875,
    rank: 3,
    department: "Computer Science",
    badges: ["Web Dev Guru", "Consistent Contributor"],
  },
  {
    id: 4,
    name: "Vikram Kumar",
    username: "vikramkumar",
    avatar: "/placeholder.svg",
    points: 720,
    rank: 4,
    department: "AI & ML",
    badges: ["AI Specialist", "Problem Solver"],
  },
  {
    id: 5,
    name: "Sanjay Mehta",
    username: "sanjaymehta",
    avatar: "/placeholder.svg",
    points: 685,
    rank: 5,
    department: "Web Development",
    badges: ["CSS Wizard", "Frontend Expert"],
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeCommons
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4">
              The ultimate platform for student developers to collaborate,
              learn, and showcase their skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white">
              Why CodeCommons?
            </h2>
            <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Discover all the powerful features that make CodeCommons the
              perfect platform for learning, collaboration, and growth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featureCards.map((feature, index) => (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 group"
                >
                  <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 pb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-base sm:text-lg font-semibold leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Point System Section */}
        <section
          id="point-system"
          className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto max-w-6xl">
            <PointAllocationExplainer />
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                  Top Contributors
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Meet our most active community members who are leading the way
                in learning and collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {topContributors.slice(0, 3).map((contributor, index) => (
                <Card
                  key={contributor.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    index === 0
                      ? "ring-2 ring-yellow-400 shadow-xl"
                      : index === 1
                      ? "ring-2 ring-gray-300 shadow-lg"
                      : index === 2
                      ? "ring-2 ring-amber-600 shadow-md"
                      : ""
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        {contributor.rank}
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-2 -right-2">
                          <Trophy className="h-6 w-6 text-yellow-500" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                      {contributor.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      @{contributor.username} • {contributor.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {contributor.points.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        points
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {contributor.badges
                        .slice(0, 2)
                        .map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-3 h-auto"
                >
                  View Full Leaderboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Demo Questions Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <DemoQuestions />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
