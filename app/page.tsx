"use client";

import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/components/ui/use-toast";
import {
  Code,
  ArrowRight,
  Trophy,
  Users,
  Zap,
  ChevronDown,
  Award,
} from "lucide-react";
import { EnhancedDemoQuestions } from "@/components/enhanced-demo-questions";
import { PointAllocationExplainer } from "@/components/point-allocation-explainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  // Function to handle smooth scroll to sections
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to handle explore features click
  const handleExploreClick = () => {
    scrollToSection("features");
    toast({
      title: "Exploring Features",
      description: "Discover all the powerful features of CodeCommons",
    });
  };

  // Function to handle view all questions
  const handleViewAllQuestions = () => {
    // Store a flag in localStorage to redirect after signup
    localStorage.setItem("redirectAfterSignup", "/dashboard/questions");
    router.push("/signup?redirectTo=/dashboard/questions");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary cosmic-glow" />
              <span className="text-xl font-bold cosmic-text">CodeCommons</span>
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex gap-6"
          >
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("questions")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Questions
            </button>
            <button
              onClick={() => scrollToSection("points")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Point System
            </button>
            <button
              onClick={() => scrollToSection("leaderboard")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Leaderboard
            </button>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <ModeToggle />
            <Link href="/login">
              <Button
                variant="outline"
                className="transition-all hover:border-primary"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="cosmic-button shadow-sm hover:shadow-md transition-all">
                Sign Up
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Badge className="mb-4 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 rounded-full cosmic-glow">
                  Jain University's Coding Community
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 cosmic-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Elevate Your Coding Journey Together
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Challenge yourself, collaborate with peers, and build your
                reputation in a vibrant community of passionate coders. Learn,
                compete, and grow together.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="gap-2 px-8 shadow-md hover:shadow-lg transition-all cosmic-button"
                  >
                    Join Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-8"
                  onClick={handleExploreClick}
                >
                  Explore Features
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center"
          >
            <button
              onClick={() => scrollToSection("features")}
              className="text-muted-foreground hover:text-primary transition-colors animate-bounce"
              aria-label="Scroll down"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
          </motion.div>
        </section>

        <section id="features" className="py-20 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 cosmic-text">
                Powerful Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to excel in your coding journey and connect
                with fellow developers
              </p>
            </motion.div>

            {/* Feature Categories Navigation */}
            <div className="mb-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                {[
                  {
                    name: "Learning",
                    color:
                      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
                  },
                  {
                    name: "Classroom",
                    color:
                      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50",
                  },
                  {
                    name: "Community",
                    color:
                      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
                  },
                  {
                    name: "Project",
                    color:
                      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
                  },
                  {
                    name: "Career",
                    color:
                      "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/50",
                  },
                  {
                    name: "Admin",
                    color:
                      "bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/50",
                  },
                ].map((category, index) => (
                  <motion.button
                    key={category.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className={`p-3 rounded-lg border ${category.color} font-medium text-sm hover:opacity-90 transition-all`}
                    onClick={() =>
                      scrollToSection(`${category.name.toLowerCase()}-features`)
                    }
                  >
                    {category.name} Features
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Learning Features */}
            <div id="learning-features" className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400"
              >
                Learning Features
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Coding Challenges",
                    description:
                      "Sharpen your skills with daily challenges across multiple programming languages and difficulty levels.",
                    icon: (
                      <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    ),
                  },
                  {
                    title: "Resource Library",
                    description:
                      "Access a vast collection of tutorials, articles, and reference materials for continuous learning.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                      </svg>
                    ),
                  },
                  {
                    title: "Code Editor",
                    description:
                      "Write, run, and debug code directly in your browser with our powerful integrated editor.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      >
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-blue-200/50 dark:border-blue-800/20 cosmic-card"
                  >
                    <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 cosmic-glow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Classroom Features */}
            <div id="classroom-features" className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold mb-8 text-center text-green-600 dark:text-green-400"
              >
                Classroom Features
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Virtual Classrooms",
                    description:
                      "Join interactive virtual classrooms with real-time collaboration tools and video lectures.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-green-600 dark:text-green-400"
                      >
                        <rect width="20" height="14" x="2" y="3" rx="2" />
                        <line x1="8" x2="16" y1="21" y2="21" />
                        <line x1="12" x2="12" y1="17" y2="21" />
                      </svg>
                    ),
                  },
                  {
                    title: "Assignment Tracking",
                    description:
                      "Stay on top of your coursework with our comprehensive assignment tracking system.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-green-600 dark:text-green-400"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ),
                  },
                  {
                    title: "Smart Notifications",
                    description:
                      "Get timely reminders about deadlines, class schedules, and important announcements.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-green-600 dark:text-green-400"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-green-200/50 dark:border-green-800/20 cosmic-card"
                  >
                    <div className="h-12 w-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4 cosmic-glow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Community Features */}
            <div id="community-features" className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold mb-8 text-center text-amber-600 dark:text-amber-400"
              >
                Community Features
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Community Interaction",
                    description:
                      "Ask questions, provide guidance, and collaborate with peers and professors in a supportive environment.",
                    icon: (
                      <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    ),
                  },
                  {
                    title: "Q&A Forum",
                    description:
                      "Get your coding questions answered by the community with our dedicated Q&A platform.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-amber-600 dark:text-amber-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    ),
                  },
                  {
                    title: "Leaderboard System",
                    description:
                      "Track your progress, earn points for helping others, and climb the ranks in our community leaderboard.",
                    icon: (
                      <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-amber-200/50 dark:border-amber-800/20 cosmic-card"
                  >
                    <div className="h-12 w-12 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4 cosmic-glow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Project Features */}
            <div id="project-features" className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold mb-8 text-center text-purple-600 dark:text-purple-400"
              >
                Project Features
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Project Showcase",
                    description:
                      "Display your projects to the community and potential employers with detailed portfolios.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-purple-600 dark:text-purple-400"
                      >
                        <rect
                          width="20"
                          height="14"
                          x="2"
                          y="7"
                          rx="2"
                          ry="2"
                        />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    ),
                  },
                  {
                    title: "Team Collaboration",
                    description:
                      "Work seamlessly with team members on shared projects with real-time collaboration.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-purple-600 dark:text-purple-400"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                  },
                  {
                    title: "Version Control",
                    description:
                      "Integrate with popular version control systems like Git for streamlined development workflows.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-purple-600 dark:text-purple-400"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="19" r="3" />
                        <path d="M15.71 7.4a8 8 0 0 1 0 9.2" />
                        <path d="M8.29 7.4a8 8 0 0 0 0 9.2" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-purple-200/50 dark:border-purple-800/20 cosmic-card"
                  >
                    <div className="h-12 w-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4 cosmic-glow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Career Features */}
            <div id="career-features" className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold mb-8 text-center text-pink-600 dark:text-pink-400"
              >
                Career Features
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Career Opportunities",
                    description:
                      "Discover job openings, internships, and career opportunities tailored to your skills.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-pink-600 dark:text-pink-400"
                      >
                        <rect
                          width="20"
                          height="14"
                          x="2"
                          y="7"
                          rx="2"
                          ry="2"
                        />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    ),
                  },
                  {
                    title: "Skill Certification",
                    description:
                      "Earn certifications for your skills and achievements to stand out to potential employers.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-pink-600 dark:text-pink-400"
                      >
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" x2="4" y1="22" y2="15" />
                      </svg>
                    ),
                  },
                  {
                    title: "Interview Preparation",
                    description:
                      "Practice coding interviews with mock interviews and technical problem-solving sessions.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-pink-600 dark:text-pink-400"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 18h.01" />
                        <path d="M12 18h.01" />
                        <path d="M16 18h.01" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-pink-200/50 dark:border-pink-800/20 cosmic-card"
                  >
                    <div className="h-12 w-12 rounded-lg bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-4 cosmic-glow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Administrative Features */}
            <div id="admin-features" className="mb-10">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold mb-8 text-center text-slate-600 dark:text-slate-400"
              >
                Administrative Features
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Analytics Dashboard",
                    description:
                      "Access comprehensive analytics on user engagement, learning progress, and platform usage.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-slate-600 dark:text-slate-400"
                      >
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    ),
                  },
                  {
                    title: "User Management",
                    description:
                      "Efficiently manage users, roles, and permissions across the platform.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-slate-600 dark:text-slate-400"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                  },
                  {
                    title: "Reporting Tools",
                    description:
                      "Generate detailed reports on student performance, engagement, and platform metrics.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-slate-600 dark:text-slate-400"
                      >
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="M5 22h14a2 2 0 0 0 2-2V7.5L14.5 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
                        <path d="M10 12h6" />
                        <path d="M10 16h6" />
                        <path d="M8 12h.01" />
                        <path d="M8 16h.01" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-200/50 dark:border-slate-800/20 cosmic-card"
                  >
                    <div className="h-12 w-12 rounded-lg bg-slate-50 dark:bg-slate-900/20 flex items-center justify-center mb-4 cosmic-glow">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="questions" className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 cosmic-text">
                Browse Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore sample questions and answers from our community
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <EnhancedDemoQuestions />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 text-center"
              >
                <Button
                  size="lg"
                  className="gap-2 cosmic-button"
                  onClick={handleViewAllQuestions}
                >
                  View All Questions <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="points" className="py-20 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 cosmic-text">
                Point System
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Build your reputation by contributing to the community
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <PointAllocationExplainer />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-12 text-center"
              >
                <div className="bg-background rounded-xl p-6 shadow-sm border border-border/50 cosmic-card">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Award className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">Reputation Tiers</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                      <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-2">
                        Bronze
                      </h4>
                      <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mb-3">
                        0-500 points
                      </p>
                      <ul className="text-xs space-y-1 text-amber-700/70 dark:text-amber-400/70">
                        <li>• Ask and answer questions</li>
                        <li>• Upvote helpful content</li>
                        <li>• Track your progress</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/20 border border-slate-200 dark:border-slate-700/30">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Silver
                      </h4>
                      <p className="text-sm text-slate-700/80 dark:text-slate-300/80 mb-3">
                        501-2000 points
                      </p>
                      <ul className="text-xs space-y-1 text-slate-700/70 dark:text-slate-300/70">
                        <li>• All Bronze privileges</li>
                        <li>• Create tags</li>
                        <li>• Flag inappropriate content</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200 dark:border-yellow-800/30">
                      <h4 className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                        Gold
                      </h4>
                      <p className="text-sm text-yellow-700/80 dark:text-yellow-400/80 mb-3">
                        2001+ points
                      </p>
                      <ul className="text-xs space-y-1 text-yellow-700/70 dark:text-yellow-400/70">
                        <li>• All Silver privileges</li>
                        <li>• Edit others' posts</li>
                        <li>• Access to moderator tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 cosmic-text">
                Community Leaderboard
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our top contributors who are helping shape the CodeCommons
                community
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-xl shadow-md overflow-hidden border border-border/50 cosmic-card"
              >
                <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Top Contributors This Month</h3>
                  <Badge variant="outline" className="gap-1">
                    <Trophy className="h-3 w-3 text-amber-500" /> April 2024
                  </Badge>
                </div>

                <div className="divide-y">
                  {[
                    {
                      rank: 1,
                      name: "Rahul Singh",
                      avatar: "/placeholder.svg?height=40&width=40",
                      department: "Computer Science",
                      semester: "6th Sem",
                      points: 1245,
                      solutions: 42,
                      color: "border-amber-300 bg-amber-100 text-amber-700",
                      badgeColor:
                        "bg-amber-100 text-amber-800 hover:bg-amber-200",
                    },
                    {
                      rank: 2,
                      name: "Ananya Patel",
                      avatar: "/placeholder.svg?height=40&width=40",
                      department: "Data Science",
                      semester: "4th Sem",
                      points: 980,
                      solutions: 35,
                      color: "border-slate-300 bg-slate-100 text-slate-700",
                      badgeColor:
                        "bg-slate-100 text-slate-800 hover:bg-slate-200",
                    },
                    {
                      rank: 3,
                      name: "Nabin Chapagain",
                      avatar: "/placeholder.svg?height=40&width=40",
                      department: "Computer Science",
                      semester: "4th Sem",
                      points: 875,
                      solutions: 29,
                      color: "border-orange-300 bg-orange-100 text-orange-700",
                      badgeColor:
                        "bg-orange-100 text-orange-800 hover:bg-orange-200",
                    },
                    {
                      rank: 4,
                      name: "Vikram Kumar",
                      avatar: "/placeholder.svg?height=40&width=40",
                      department: "AI & ML",
                      semester: "6th Sem",
                      points: 720,
                      solutions: 24,
                      color: "bg-muted text-muted-foreground",
                      badgeColor: "",
                    },
                    {
                      rank: 5,
                      name: "Sanjay Mehta",
                      avatar: "/placeholder.svg?height=40&width=40",
                      department: "Web Development",
                      semester: "4th Sem",
                      points: 685,
                      solutions: 22,
                      color: "bg-muted text-muted-foreground",
                      badgeColor: "",
                    },
                  ].map((user, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${user.color}`}
                        >
                          {user.rank}
                        </div>
                        <Avatar
                          className={`h-10 w-10 ${
                            user.rank <= 3 ? "border-2" : ""
                          } ${user.rank <= 3 ? user.color.split(" ")[0] : ""}`}
                        >
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={`@${user.name}`}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.department}, {user.semester}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={user.badgeColor || "variant-outline"}>
                          {user.points} points
                        </Badge>
                        <Badge variant="outline">
                          {user.solutions} solutions
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 border-t bg-muted/10 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewAllQuestions}
                  >
                    View Full Leaderboard
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-background z-0"></div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 cosmic-text">
                Ready to join our coding community?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Create an account today and start your journey with CodeCommons.
                Connect with fellow students, solve challenges, and build your
                reputation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="gap-2 px-8 shadow-md hover:shadow-lg transition-all cosmic-button"
                  >
                    Sign Up Now <Award className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="gap-2 px-8">
                    Log In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <span className="font-semibold">CodeCommons</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 CodeCommons. Created by Nabin Chapagain. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
