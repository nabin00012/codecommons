"use client";

import { useState, useEffect, useRef } from "react";
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
  const heroRef = useRef(null);

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#312e81] to-[#9333ea] text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b]/80 via-[#312e81]/70 to-[#9333ea]/80 animate-pulse" />
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 rounded-full blur-3xl opacity-40 animate-spin-slow" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-3xl opacity-30 animate-spin-reverse" />
        </div>
        <div className="container relative z-10 mx-auto text-center flex flex-col items-center justify-center py-24">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-400 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to <span className="text-fuchsia-400">Code Commons</span>
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-indigo-100 mb-10 max-w-3xl mx-auto drop-shadow"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your collaborative platform for learning, sharing, and growing
            together in the world of programming.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/register" passHref legacyBehavior>
              <Button
                size="lg"
                className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-xl hover:scale-105 transition-transform duration-300 text-xl px-8 py-4 rounded-full font-bold animate-bounce"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-fuchsia-400 text-fuchsia-200 hover:bg-fuchsia-900/20 shadow-lg text-xl px-8 py-4 rounded-full font-bold"
            >
              Learn More <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-transparent">
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
      <section className="py-24 bg-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-400 drop-shadow-lg">
              Point System
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Earn points and unlock new privileges as you contribute to the
              community.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {pointSystemData.map((category, index) => (
              <Card
                key={index}
                className="cosmic-card bg-gradient-to-br from-indigo-800/80 via-fuchsia-800/60 to-transparent border-0 shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-fuchsia-200 font-bold">
                    {category.category === "Asking Questions" && (
                      <HelpCircle className="h-5 w-5 text-yellow-400" />
                    )}
                    {category.category === "Answering Questions" && (
                      <MessageSquare className="h-5 w-5 text-green-400" />
                    )}
                    {category.category === "Community Engagement" && (
                      <Users className="h-5 w-5 text-blue-400" />
                    )}
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex justify-between items-center text-indigo-100"
                      >
                        <span>{item.action}</span>
                        <Badge
                          variant="secondary"
                          className="cosmic-glow bg-fuchsia-700/80 text-yellow-300 border-fuchsia-400"
                        >
                          {item.points} pts
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reputation Tiers Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-900/60 via-fuchsia-900/40 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-fuchsia-400 drop-shadow-lg">
              Reputation Tiers
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Progress through different tiers and unlock new privileges.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {reputationTiers.map((tier, index) => (
              <Card
                key={index}
                className="cosmic-card bg-gradient-to-br from-indigo-800/80 via-fuchsia-800/60 to-transparent border-0 shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-fuchsia-200 font-bold">
                    {tier.name === "Bronze" && (
                      <Award className="h-5 w-5 text-amber-400" />
                    )}
                    {tier.name === "Silver" && (
                      <Award className="h-5 w-5 text-gray-300" />
                    )}
                    {tier.name === "Gold" && (
                      <Award className="h-5 w-5 text-yellow-400" />
                    )}
                    {tier.name}
                  </CardTitle>
                  <p className="text-sm text-indigo-200">{tier.range}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.privileges.map((privilege, privilegeIndex) => (
                      <li
                        key={privilegeIndex}
                        className="flex items-center gap-2 text-indigo-100"
                      >
                        <CheckCircle className="h-4 w-4 text-fuchsia-400" />
                        <span className="text-sm">{privilege}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
    </div>
  );
}
