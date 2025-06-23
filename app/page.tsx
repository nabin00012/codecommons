"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import {
  Code,
  ArrowRight,
  Trophy,
  Users,
  Zap,
  ChevronDown,
  Award,
  BookOpen,
  FileText,
  Briefcase,
  Folder,
  Bell,
  GraduationCap,
  Calendar,
  PenTool,
  GitBranch,
  HelpCircle,
  UserPlus,
  Bookmark,
  CheckCircle,
  Clock,
  FileCode,
  UserCheck,
  Layers,
  Cpu,
  FileSpreadsheet,
  MessageSquare,
  Eye,
  ThumbsUp,
  Rocket,
  Heart,
  TrendingUp,
  Sparkles,
  Play,
  Share2,
  Code2,
  CheckCircle2,
  Star,
  Brain,
  Shield,
  Cloud,
  Database,
  MessageSquare as MessageSquareIcon,
} from "lucide-react";
import { DemoQuestions } from "@/components/demo-questions";
import { EnhancedFeaturesSection } from "@/components/enhanced-features-section";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/navbar";

const leaderboardData = [
  {
    rank: 1,
    name: "Rahul Singh",
    department: "Computer Science",
    semester: "6th Sem",
    points: 1245,
    solutions: 42,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RS",
  },
  {
    rank: 2,
    name: "Ananya Patel",
    department: "Data Science",
    semester: "4th Sem",
    points: 980,
    solutions: 35,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AP",
  },
  {
    rank: 3,
    name: "Nabin Chapagain",
    department: "Computer Science",
    semester: "4th Sem",
    points: 875,
    solutions: 29,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "NC",
  },
  {
    rank: 4,
    name: "Vikram Kumar",
    department: "AI & ML",
    semester: "6th Sem",
    points: 720,
    solutions: 24,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "VK",
  },
  {
    rank: 5,
    name: "Sanjay Mehta",
    department: "Web Development",
    semester: "4th Sem",
    points: 685,
    solutions: 22,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SM",
  },
];

const pointSystemData = [
  {
    category: "Asking Questions",
    items: [
      { action: "Posting a question", points: 5 },
      { action: "Question upvoted", points: 2 },
      { action: "Question marked as solved", points: 3 },
      { action: "Featured question", points: 10 },
    ],
  },
  {
    category: "Answering Questions",
    items: [
      { action: "Posting an answer", points: 5 },
      { action: "Answer upvoted", points: 5 },
      { action: "Answer accepted", points: 25 },
      { action: "Detailed explanation", points: 10 },
    ],
  },
  {
    category: "Community Engagement",
    items: [
      { action: "Daily login streak", points: 1 },
      { action: "Weekly challenge completed", points: 20 },
      { action: "Editing/improving posts", points: 2 },
      { action: "Receiving badges", points: "5-50" },
    ],
  },
];

const reputationTiers = [
  {
    name: "Bronze",
    range: "0-500 points",
    privileges: [
      "Ask and answer questions",
      "Upvote helpful content",
      "Track your progress",
    ],
  },
  {
    name: "Silver",
    range: "501-2000 points",
    privileges: [
      "All Bronze privileges",
      "Create tags",
      "Flag inappropriate content",
    ],
  },
  {
    name: "Gold",
    range: "2001+ points",
    privileges: [
      "All Silver privileges",
      "Edit others' posts",
      "Access to moderator tools",
    ],
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeatureCategory, setActiveFeatureCategory] = useState("all");
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { scrollYProgress } = useScroll();
  const { theme } = useTheme();
  const heroRef = useRef(null);

  // Generate consistent random values for each dot
  const dotPositions = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      left: `${(i * 5) % 100}%`,
      top: `${(i * 7) % 100}%`,
      animationDelay: `${(i * 0.25) % 5}s`,
      opacity: 0.2 + ((i * 0.15) % 0.5),
    }));
  }, []);

  // Generate consistent random values for footer dots
  const footerDotPositions = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      left: `${(i * 11) % 100}%`,
      top: `${(i * 13) % 100}%`,
      animationDelay: `${(i * 0.5) % 5}s`,
      opacity: 0.1 + ((i * 0.2) % 0.3),
    }));
  }, []);

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "cosmic"
          ? "bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4c1d95]"
          : theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200"
      } text-foreground overflow-hidden`}
    >
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            theme === "cosmic"
              ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-indigo-900/20 to-blue-900/20"
              : theme === "dark"
              ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-gray-700/20 to-gray-900/20"
              : "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-200/20 via-slate-100/20 to-slate-50/20"
          } animate-pulse`}
        />
        <div className="absolute top-0 left-0 w-full h-full">
          {dotPositions.map((position, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-float ${
                theme === "cosmic"
                  ? "bg-white"
                  : theme === "dark"
                  ? "bg-gray-400"
                  : "bg-slate-600"
              }`}
              style={position}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="container relative z-10 mx-auto text-center flex flex-col items-center justify-center py-24">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className={`absolute -inset-1 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x ${
                theme === "cosmic"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600"
                  : theme === "dark"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : "bg-gradient-to-r from-blue-400 to-purple-400"
              }`}
            ></div>
            <h1
              className={`relative text-6xl md:text-8xl font-extrabold mb-6 bg-clip-text text-transparent ${
                theme === "cosmic"
                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
                  : theme === "dark"
                  ? "bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
              } drop-shadow-lg`}
            >
              Welcome to{" "}
              <span className="relative inline-block">
                <span
                  className={`relative z-10 ${
                    theme === "cosmic"
                      ? "text-fuchsia-400"
                      : theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                  }`}
                >
                  Code Commons
                </span>
                <span
                  className={`absolute inset-0 blur-xl opacity-50 ${
                    theme === "cosmic"
                      ? "bg-gradient-to-r from-fuchsia-400 to-purple-400"
                      : theme === "dark"
                      ? "bg-gradient-to-r from-blue-400 to-purple-400"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }`}
                ></span>
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-lg text-gray-300 mb-8">
              A collaborative platform for students to learn, share, and grow
              together.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register">
                <Button
                  variant="default"
                  size="lg"
                  className="group cosmic-button"
                >
                  Get Started <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-400 drop-shadow-lg">
              Powerful Features
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Everything you need to learn, collaborate, and grow as a
              developer.
            </p>
          </div>
          <EnhancedFeaturesSection />
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-900/60 via-fuchsia-900/40 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-fuchsia-400 drop-shadow-lg">
              Top Contributors
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join our community of passionate developers and make your mark.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {leaderboardData.map((user, index) => (
              <Card
                key={index}
                className="cosmic-card bg-gradient-to-br from-indigo-800/80 via-fuchsia-800/60 to-transparent border-0 shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold text-fuchsia-200 drop-shadow">
                      {user.name}
                    </CardTitle>
                    <p className="text-sm text-indigo-200">
                      {user.department} • {user.semester}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-indigo-200">
                        Points
                      </p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {user.points}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-200">
                        Solutions
                      </p>
                      <p className="text-2xl font-bold text-fuchsia-400">
                        {user.solutions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Point System Section */}
      <section
        id="point-system"
        className={`py-24 ${
          theme === "cosmic"
            ? "bg-gradient-to-t from-[#0f172a] via-[#1e1b4b] to-[#0f172a]"
            : theme === "dark"
            ? "bg-gray-900"
            : "bg-white"
        }`}
      >
        <div className="container">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-400 drop-shadow-lg">
              Point System
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Earn points and gain reputation by contributing to the CodeCommons
              community.
            </p>
          </motion.div>
          <div className="grid gap-10 md:grid-cols-3">
            {pointSystemData.map((category, index) => (
              <motion.div
                key={category.category}
                className="cosmic-card p-8 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-6 cosmic-text">
                  {category.category}
                </h3>
                <ul className="space-y-4">
                  {category.items.map((item) => (
                    <li key={item.action} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.action}
                      </span>
                      <span className="font-bold cosmic-text">
                        {item.points}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button variant="default" size="lg" className="group cosmic-button">
              Learn More <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Reputation Tiers Section */}
      <section
        className={`py-24 ${
          theme === "cosmic"
            ? "bg-gradient-to-t from-[#0f172a] via-[#1e1b4b] to-[#0f172a]"
            : theme === "dark"
            ? "bg-gray-900"
            : "bg-white"
        }`}
      >
        <div className="container">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-400 drop-shadow-lg">
              Reputation Tiers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlock new privileges and showcase your expertise as you climb the
              ranks.
            </p>
          </motion.div>
          <div className="grid gap-10 md:grid-cols-3">
            {reputationTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                className="cosmic-card p-8 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-4 cosmic-text">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground mb-6">{tier.range}</p>
                <ul className="space-y-3">
                  {tier.privileges.map((privilege) => (
                    <li key={privilege} className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                      <span className="text-muted-foreground">{privilege}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Questions Section */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-400 drop-shadow-lg">
              Recent Questions
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Check out some of the latest questions from our community.
            </p>
          </div>
          <DemoQuestions />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-gradient-to-br from-indigo-900/60 via-fuchsia-900/40 to-transparent border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-fuchsia-400" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
                  CodeCommons
                </span>
              </div>
              <p className="text-indigo-200 text-sm">
                Jain University's collaborative platform for learning, sharing,
                and growing together in the world of programming.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-end justify-center">
              <h3 className="text-lg font-semibold text-fuchsia-200 mb-4">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                <Link
                  href="https://github.com/nabin00012"
                  className="text-indigo-200 hover:text-fuchsia-400 transition-colors"
                >
                  <GitBranch className="h-5 w-5" />
                </Link>
                <Link
                  href="https://linkedin.com/in/nabin-chapagain"
                  className="text-indigo-200 hover:text-fuchsia-400 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-indigo-200 text-sm text-center">
              © 2024 CodeCommons. Created by{" "}
              <span className="text-fuchsia-400 font-semibold">
                Nabin Chapagain
              </span>
              . All rights reserved.
            </p>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-indigo-900/10 to-blue-900/10 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full">
            {footerDotPositions.map((position, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-float"
                style={position}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
