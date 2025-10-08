"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Code,
  Search,
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Star,
  Download,
  History,
  Check,
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/footer";

// Mock data for contributors
const contributors = [
  {
    id: 1,
    name: "Rahul Singh",
    username: "rahulsingh",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "Computer Science",
    semester: "6th Sem",
    points: 1245,
    solutions: 42,
    questions: 15,
    comments: 87,
    rank: 1,
    previousRank: 2,
    badges: ["Top Contributor", "Python Expert", "Algorithms Master"],
    weeklyPoints: [320, 280, 210, 435],
    topLanguages: [
      { name: "Python", percentage: 85 },
      { name: "JavaScript", percentage: 65 },
      { name: "Java", percentage: 40 },
    ],
    joinedDate: "August 2023",
  },
  {
    id: 2,
    name: "Ananya Patel",
    username: "ananyapatel",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "Data Science",
    semester: "4th Sem",
    points: 980,
    solutions: 35,
    questions: 12,
    comments: 64,
    rank: 2,
    previousRank: 1,
    badges: ["Rising Star", "Data Science Enthusiast"],
    weeklyPoints: [250, 310, 180, 240],
    topLanguages: [
      { name: "R", percentage: 90 },
      { name: "Python", percentage: 75 },
      { name: "SQL", percentage: 60 },
    ],
    joinedDate: "October 2023",
  },
  {
    id: 3,
    name: "Nabin Chapagain",
    username: "nabinchapagain",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "Computer Science",
    semester: "4th Sem",
    points: 875,
    solutions: 29,
    questions: 18,
    comments: 53,
    rank: 3,
    previousRank: 3,
    badges: ["Web Dev Guru", "Consistent Contributor"],
    weeklyPoints: [180, 220, 240, 235],
    topLanguages: [
      { name: "JavaScript", percentage: 95 },
      { name: "TypeScript", percentage: 80 },
      { name: "HTML/CSS", percentage: 85 },
    ],
    joinedDate: "September 2023",
  },
  {
    id: 4,
    name: "Vikram Kumar",
    username: "vikramkumar",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "AI & ML",
    semester: "6th Sem",
    points: 720,
    solutions: 24,
    questions: 9,
    comments: 42,
    rank: 4,
    previousRank: 5,
    badges: ["AI Specialist", "Problem Solver"],
    weeklyPoints: [150, 180, 190, 200],
    topLanguages: [
      { name: "Python", percentage: 90 },
      { name: "TensorFlow", percentage: 85 },
      { name: "C++", percentage: 60 },
    ],
    joinedDate: "July 2023",
  },
  {
    id: 5,
    name: "Sanjay Mehta",
    username: "sanjaymehta",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "Web Development",
    semester: "4th Sem",
    points: 685,
    solutions: 22,
    questions: 14,
    comments: 38,
    rank: 5,
    previousRank: 4,
    badges: ["CSS Wizard", "Frontend Expert"],
    weeklyPoints: [160, 170, 175, 180],
    topLanguages: [
      { name: "HTML/CSS", percentage: 95 },
      { name: "JavaScript", percentage: 85 },
      { name: "React", percentage: 75 },
    ],
    joinedDate: "November 2023",
  },
  {
    id: 6,
    name: "Dr. Priya Sharma",
    username: "drpriyasharma",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professor",
    department: "Computer Science",
    points: 650,
    solutions: 18,
    questions: 5,
    comments: 75,
    rank: 6,
    previousRank: 7,
    badges: ["Faculty Star", "Mentor", "Algorithm Expert"],
    weeklyPoints: [140, 160, 170, 180],
    topLanguages: [
      { name: "Java", percentage: 90 },
      { name: "C++", percentage: 85 },
      { name: "Python", percentage: 70 },
    ],
    joinedDate: "June 2023",
  },
  {
    id: 7,
    name: "Arjun Reddy",
    username: "arjunreddy",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "Mobile App Development",
    semester: "6th Sem",
    points: 610,
    solutions: 20,
    questions: 10,
    comments: 35,
    rank: 7,
    previousRank: 6,
    badges: ["Mobile Dev Expert", "UI/UX Enthusiast"],
    weeklyPoints: [130, 150, 160, 170],
    topLanguages: [
      { name: "Kotlin", percentage: 90 },
      { name: "Swift", percentage: 75 },
      { name: "JavaScript", percentage: 65 },
    ],
    joinedDate: "December 2023",
  },
  {
    id: 8,
    name: "Prof. Rajesh Kumar",
    username: "profrajeshkumar",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professor",
    department: "Data Science",
    points: 580,
    solutions: 15,
    questions: 3,
    comments: 68,
    rank: 8,
    previousRank: 9,
    badges: ["Data Guru", "Research Mentor"],
    weeklyPoints: [120, 140, 150, 170],
    topLanguages: [
      { name: "R", percentage: 95 },
      { name: "Python", percentage: 80 },
      { name: "MATLAB", percentage: 75 },
    ],
    joinedDate: "May 2023",
  },
  {
    id: 9,
    name: "Meera Desai",
    username: "meeradesai",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "Cybersecurity",
    semester: "8th Sem",
    points: 550,
    solutions: 18,
    questions: 8,
    comments: 30,
    rank: 9,
    previousRank: 8,
    badges: ["Security Expert", "Ethical Hacker"],
    weeklyPoints: [110, 130, 150, 160],
    topLanguages: [
      { name: "Python", percentage: 85 },
      { name: "Bash", percentage: 80 },
      { name: "C", percentage: 70 },
    ],
    joinedDate: "July 2023",
  },
  {
    id: 10,
    name: "Karthik Nair",
    username: "karthiknair",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Student",
    department: "Game Development",
    semester: "6th Sem",
    points: 520,
    solutions: 16,
    questions: 12,
    comments: 28,
    rank: 10,
    previousRank: 10,
    badges: ["Game Dev Enthusiast", "Graphics Specialist"],
    weeklyPoints: [100, 120, 140, 160],
    topLanguages: [
      { name: "C#", percentage: 90 },
      { name: "Unity", percentage: 85 },
      { name: "JavaScript", percentage: 60 },
    ],
    joinedDate: "October 2023",
  },
];

// Weekly data for March 2025
const weeklyData = [
  { id: 1, week: "Week 1 (Mar 1-7)", status: "completed" },
  { id: 2, week: "Week 2 (Mar 8-14)", status: "completed" },
  { id: 3, week: "Week 3 (Mar 15-21)", status: "completed" },
  { id: 4, week: "Week 4 (Mar 22-28)", status: "current" },
  { id: 5, week: "Week 5 (Mar 29-31)", status: "upcoming" },
];

export default function LeaderboardPage() {
  const [currentWeek, setCurrentWeek] = useState(4); // Week 4 is current
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("points");
  const [explodeIndex, setExplodeIndex] = useState<number | null>(null);

  // Filter contributors based on role and search query
  const filteredContributors = contributors
    .filter((contributor) => {
      if (filterRole === "all") return true;
      return contributor.role.toLowerCase() === filterRole.toLowerCase();
    })
    .filter((contributor) => {
      if (!searchQuery) return true;
      return (
        contributor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contributor.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "solutions") return b.solutions - a.solutions;
      if (sortBy === "questions") return b.questions - a.questions;
      return b.points - a.points; // Default sort by points
    });

  // Get rank change indicator
  const getRankChange = (current: number, previous: number) => {
    if (current < previous) return { icon: ArrowUp, color: "text-green-500" };
    if (current > previous) return { icon: ArrowDown, color: "text-red-500" };
    return { icon: Minus, color: "text-gray-500" };
  };

  // Get badge color based on badge name
  const getBadgeColor = (badge: string) => {
    if (badge.includes("Expert") || badge.includes("Master"))
      return "bg-purple-100 text-purple-800 border-purple-200";
    if (badge.includes("Star") || badge.includes("Top"))
      return "bg-amber-100 text-amber-800 border-amber-200";
    if (badge.includes("Guru") || badge.includes("Wizard"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  // Handle explode animation
  const handleExplode = (index: number) => {
    setExplodeIndex(index);
    setTimeout(() => setExplodeIndex(null), 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold">CodeCommons</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-primary"
            >
              Leaderboard
            </Link>
            <Link
              href="/challenges"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Challenges
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard/ask">
              <Button size="sm" className="hidden sm:inline-flex">
                Ask Question
              </Button>
            </Link>
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="@user"
              />
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Top contributors for March 2025. See who's making the biggest
              impact in our community.
            </p>
          </motion.div>

          {/* Mock Data Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
          >
            <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-yellow-500/20 p-2">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      📊 Demo Data Display
                    </h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      This leaderboard currently shows <strong>sample data for demonstration purposes</strong>. 
                      As you and your friends use the platform, real rankings will be displayed based on actual contributions, 
                      points earned, and community engagement. Start asking questions, submitting projects, and helping others to climb the ranks!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="overflow-hidden border-primary/10">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl">
                      March 2025
                    </CardTitle>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setCurrentWeek((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentWeek === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Select
                        value={currentWeek.toString()}
                        onValueChange={(value) =>
                          setCurrentWeek(Number.parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-[160px] sm:w-[180px]">
                          <SelectValue placeholder="Select week" />
                        </SelectTrigger>
                        <SelectContent>
                          {weeklyData.map((week) => (
                            <SelectItem
                              key={week.id}
                              value={week.id.toString()}
                            >
                              {week.week}
                              {week.status === "current" && " (Current)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setCurrentWeek((prev) =>
                            Math.min(weeklyData.length, prev + 1)
                          )
                        }
                        disabled={currentWeek === weeklyData.length}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search contributors..."
                          className="pl-8 h-9 sm:h-8 w-full sm:w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-9 sm:h-8 w-full sm:w-auto"
                          >
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filter</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setFilterRole("all")}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            <span>All</span>
                            {filterRole === "all" && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setFilterRole("student")}
                          >
                            <GraduationCap className="mr-2 h-4 w-4" />
                            <span>Students</span>
                            {filterRole === "student" && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setFilterRole("professor")}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Professors</span>
                            {filterRole === "professor" && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSortBy("points")}>
                            <Trophy className="mr-2 h-4 w-4" />
                            <span>Points</span>
                            {sortBy === "points" && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSortBy("solutions")}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Solutions</span>
                            {sortBy === "solutions" && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSortBy("questions")}
                          >
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>Questions</span>
                            {sortBy === "questions" && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-[60px]">
                          Rank
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Contributor
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                          Role
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Points
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden sm:table-cell">
                          Solutions
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden lg:table-cell">
                          Questions
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground w-[100px]">
                          Weekly Trend
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-[150px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredContributors.map((contributor, index) => {
                          const RankChange = getRankChange(
                            contributor.rank,
                            contributor.previousRank
                          ).icon;
                          const rankChangeColor = getRankChange(
                            contributor.rank,
                            contributor.previousRank
                          ).color;

                          return (
                            <motion.tr
                              key={contributor.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.3,
                              }}
                              className={`border-b hover:bg-muted/50 transition-colors ${
                                index < 3
                                  ? "bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/10"
                                  : ""
                              }`}
                            >
                              <td className="px-4 py-4 text-sm">
                                <div className="flex items-center gap-1.5">
                                  {index < 3 ? (
                                    <div
                                      className={`flex items-center justify-center h-7 w-7 rounded-full 
                                      ${
                                        index === 0
                                          ? "bg-amber-100 text-amber-800"
                                          : index === 1
                                          ? "bg-slate-100 text-slate-800"
                                          : "bg-orange-100 text-orange-800"
                                      } 
                                      font-bold text-xs`}
                                    >
                                      {contributor.rank}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-medium">
                                        {contributor.rank}
                                      </span>
                                      <RankChange
                                        className={`h-3.5 w-3.5 ${rankChangeColor}`}
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    animate={
                                      explodeIndex === index
                                        ? {
                                            scale: [1, 1.5, 1],
                                            rotate: [0, 15, -15, 0],
                                            transition: { duration: 0.5 },
                                          }
                                        : {}
                                    }
                                  >
                                    <Avatar
                                      className={`h-10 w-10 ${
                                        index < 3
                                          ? "border-2 " +
                                            (index === 0
                                              ? "border-amber-300"
                                              : index === 1
                                              ? "border-slate-300"
                                              : "border-orange-300")
                                          : ""
                                      }`}
                                    >
                                      <AvatarImage
                                        src={contributor.avatar}
                                        alt={contributor.name}
                                      />
                                      <AvatarFallback>
                                        {contributor.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                  </motion.div>
                                  <div>
                                    <div className="font-medium">
                                      {contributor.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {contributor.role === "Student"
                                        ? `${contributor.department}, ${contributor.semester}`
                                        : contributor.department}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm hidden md:table-cell">
                                <Badge
                                  variant="outline"
                                  className={
                                    contributor.role === "Professor"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                  }
                                >
                                  {contributor.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-4 text-sm text-right font-medium">
                                {contributor.points}
                              </td>
                              <td className="px-4 py-4 text-sm text-right hidden sm:table-cell">
                                {contributor.solutions}
                              </td>
                              <td className="px-4 py-4 text-sm text-right hidden lg:table-cell">
                                {contributor.questions}
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <div className="flex items-center justify-center h-10">
                                  <div className="flex items-end h-8 gap-[3px]">
                                    {contributor.weeklyPoints.map(
                                      (points, i) => (
                                        <div
                                          key={i}
                                          className={`w-[6px] rounded-t-sm ${
                                            i === currentWeek - 1
                                              ? "bg-primary"
                                              : "bg-muted-foreground/30"
                                          }`}
                                          style={{
                                            height: `${Math.max(
                                              15,
                                              (points / 500) * 100
                                            )}%`,
                                          }}
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleExplode(index)}
                                    className="h-8 px-2"
                                  >
                                    Explode
                                  </Button>
                                  <Link
                                    href={`/profile/${contributor.username}`}
                                  >
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2"
                                    >
                                      View
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>

                      {filteredContributors.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No contributors found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/30 border-t p-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredContributors.length} of {contributors.length}{" "}
                  contributors
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                  </Button>
                  <Link href="/leaderboard/history">
                    <Button variant="outline" size="sm" className="gap-1">
                      <History className="h-3.5 w-3.5" />
                      <span>View History</span>
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Contributors
                  </CardTitle>
                  <CardDescription>
                    All-time leaders in our community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contributors.slice(0, 5).map((contributor, index) => (
                      <div
                        key={contributor.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center h-7 w-7 rounded-full 
                            ${
                              index === 0
                                ? "bg-amber-100 text-amber-800"
                                : index === 1
                                ? "bg-slate-100 text-slate-800"
                                : index === 2
                                ? "bg-orange-100 text-orange-800"
                                : "bg-muted text-muted-foreground"
                            } 
                            font-bold text-xs`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {contributor.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {contributor.points} points
                            </div>
                          </div>
                        </div>
                        <Link href={`/profile/${contributor.username}`}>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href="/leaderboard/all-time" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All-Time Leaderboard
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    Top Professors
                  </CardTitle>
                  <CardDescription>
                    Faculty members leading by example
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contributors
                      .filter((c) => c.role === "Professor")
                      .slice(0, 5)
                      .map((contributor, index) => (
                        <div
                          key={contributor.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={contributor.avatar}
                                alt={contributor.name}
                              />
                              <AvatarFallback>
                                {contributor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {contributor.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {contributor.department}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {contributor.points} pts
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href="/leaderboard/professors" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Professors
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    Rising Stars
                  </CardTitle>
                  <CardDescription>
                    New members making an impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contributors
                      .sort((a, b) => {
                        // Sort by weekly growth (last week points - first week points)
                        const aGrowth = a.weeklyPoints[3] - a.weeklyPoints[0];
                        const bGrowth = b.weeklyPoints[3] - b.weeklyPoints[0];
                        return bGrowth - aGrowth;
                      })
                      .slice(0, 5)
                      .map((contributor, index) => {
                        const growth =
                          contributor.weeklyPoints[3] -
                          contributor.weeklyPoints[0];
                        const growthPercentage = Math.round(
                          (growth / contributor.weeklyPoints[0]) * 100
                        );

                        return (
                          <div
                            key={contributor.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={contributor.avatar}
                                  alt={contributor.name}
                                />
                                <AvatarFallback>
                                  {contributor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {contributor.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {contributor.role === "Student"
                                    ? `${contributor.department}, ${contributor.semester}`
                                    : contributor.department}
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
                              <ArrowUp className="h-3 w-3" />
                              {growthPercentage}%
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href="/leaderboard/rising-stars" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Rising Stars
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Additional components needed for the dropdown menu
function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

function HelpCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
