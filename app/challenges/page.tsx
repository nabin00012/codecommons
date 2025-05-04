"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Code, Search, ArrowRight, Zap, Trophy, Clock, Calendar, Users, CheckCircle2, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Footer from "@/components/footer"

// Mock data for challenges
const challenges = [
  {
    id: 1,
    title: "Implement a Binary Search Algorithm",
    description: "Implement a binary search algorithm that finds the position of a target value within a sorted array.",
    difficulty: "Medium",
    points: 50,
    category: "Algorithms",
    categoryColor: "bg-green-50 text-green-700 border-green-200",
    type: "daily",
    participants: 24,
    timeRemaining: "8 hours",
    languages: ["JavaScript", "Python", "Java", "C++"],
    completed: false,
    progress: 0,
  },
  {
    id: 2,
    title: "Build a React Todo Application",
    description:
      "Create a simple todo application using React with features like adding, completing, and deleting tasks.",
    difficulty: "Easy",
    points: 100,
    category: "React",
    categoryColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    type: "weekly",
    participants: 42,
    timeRemaining: "3 days",
    languages: ["JavaScript", "TypeScript"],
    completed: false,
    progress: 0,
  },
  {
    id: 3,
    title: "Create a RESTful API with Node.js",
    description:
      "Build a complete RESTful API with Node.js, Express, and MongoDB with authentication and authorization.",
    difficulty: "Hard",
    points: 200,
    category: "Node.js",
    categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
    type: "monthly",
    participants: 18,
    timeRemaining: "2 weeks",
    languages: ["JavaScript", "TypeScript"],
    completed: false,
    progress: 0,
  },
  {
    id: 4,
    title: "Optimize Database Queries",
    description: "Optimize a set of SQL queries to improve performance on a large dataset.",
    difficulty: "Medium",
    points: 75,
    category: "Database",
    categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
    type: "weekly",
    participants: 15,
    timeRemaining: "5 days",
    languages: ["SQL", "PostgreSQL", "MySQL"],
    completed: false,
    progress: 0,
  },
  {
    id: 5,
    title: "Implement Authentication with JWT",
    description: "Create a secure authentication system using JSON Web Tokens (JWT) in a web application.",
    difficulty: "Medium",
    points: 100,
    category: "Security",
    categoryColor: "bg-red-50 text-red-700 border-red-200",
    type: "weekly",
    participants: 31,
    timeRemaining: "4 days",
    languages: ["JavaScript", "TypeScript", "Node.js"],
    completed: false,
    progress: 0,
  },
  {
    id: 6,
    title: "Build a Responsive Dashboard",
    description: "Create a responsive dashboard with charts and data visualization using modern CSS and JavaScript.",
    difficulty: "Medium",
    points: 125,
    category: "Frontend",
    categoryColor: "bg-purple-50 text-purple-700 border-purple-200",
    type: "monthly",
    participants: 27,
    timeRemaining: "3 weeks",
    languages: ["HTML", "CSS", "JavaScript"],
    completed: false,
    progress: 0,
  },
  {
    id: 7,
    title: "Implement a Sorting Algorithm Visualizer",
    description: "Build a web application that visualizes different sorting algorithms in action.",
    difficulty: "Hard",
    points: 150,
    category: "Algorithms",
    categoryColor: "bg-green-50 text-green-700 border-green-200",
    type: "monthly",
    participants: 19,
    timeRemaining: "2 weeks",
    languages: ["JavaScript", "React"],
    completed: false,
    progress: 0,
  },
  {
    id: 8,
    title: "Create a Real-time Chat Application",
    description: "Build a real-time chat application using WebSockets and a modern JavaScript framework.",
    difficulty: "Hard",
    points: 175,
    category: "Full Stack",
    categoryColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    type: "monthly",
    participants: 23,
    timeRemaining: "3 weeks",
    languages: ["JavaScript", "Node.js", "React/Vue/Angular"],
    completed: false,
    progress: 0,
  },
]

// Mock data for completed challenges
const completedChallenges = [
  {
    id: 101,
    title: "Implement a Linked List",
    description: "Create a linked list data structure with basic operations like insert, delete, and search.",
    difficulty: "Medium",
    points: 50,
    category: "Data Structures",
    categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
    completedDate: "March 20, 2025",
    languages: ["JavaScript", "Python", "Java"],
    progress: 100,
  },
  {
    id: 102,
    title: "Build a Simple Calculator",
    description: "Create a calculator application with basic arithmetic operations.",
    difficulty: "Easy",
    points: 25,
    category: "Frontend",
    categoryColor: "bg-purple-50 text-purple-700 border-purple-200",
    completedDate: "March 15, 2025",
    languages: ["HTML", "CSS", "JavaScript"],
    progress: 100,
  },
]

// Mock data for leaderboard
const leaderboard = [
  {
    id: 1,
    name: "Rahul Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RS",
    points: 450,
    completedChallenges: 8,
  },
  {
    id: 2,
    name: "Ananya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AP",
    points: 375,
    completedChallenges: 7,
  },
  {
    id: 3,
    name: "Nabin Chapagain",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "NC",
    points: 320,
    completedChallenges: 6,
  },
  {
    id: 4,
    name: "Vikram Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "VK",
    points: 290,
    completedChallenges: 5,
  },
  {
    id: 5,
    name: "Sanjay Mehta",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SM",
    points: 265,
    completedChallenges: 5,
  },
]

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [explodeIndex, setExplodeIndex] = useState<number | null>(null)
  const [myChallenges, setMyChallenges] = useState<typeof challenges>([...challenges])

  // Handle starting a challenge
  const handleStartChallenge = (id: number) => {
    setMyChallenges((prev) =>
      prev.map((challenge) => (challenge.id === id ? { ...challenge, progress: 10 } : challenge)),
    )
  }

  // Handle explode animation
  const handleExplode = (index: number) => {
    setExplodeIndex(index)

    // Create sparkle effect
    const sparkles = document.createElement("div")
    sparkles.className = "fixed pointer-events-none z-50"
    sparkles.style.left = `${Math.random() * 100}%`
    sparkles.style.top = `${Math.random() * 100}%`
    document.body.appendChild(sparkles)

    // Remove sparkles after animation
    setTimeout(() => {
      document.body.removeChild(sparkles)
      setExplodeIndex(null)
    }, 1000)
  }

  // Filter challenges based on active tab, search query, and filters
  const filteredChallenges = myChallenges.filter((challenge) => {
    // Filter by tab
    if (activeTab === "daily" && challenge.type !== "daily") return false
    if (activeTab === "weekly" && challenge.type !== "weekly") return false
    if (activeTab === "monthly" && challenge.type !== "monthly") return false

    // Filter by search query
    if (
      searchQuery &&
      !challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by difficulty
    if (difficultyFilter !== "all" && challenge.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false
    }

    // Filter by category
    if (categoryFilter !== "all" && challenge.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false
    }

    return true
  })

  // Get all unique categories
  const categories = Array.from(new Set(challenges.map((c) => c.category)))

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CodeCommons</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <Link href="/challenges" className="text-sm font-medium text-primary">
              Challenges
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/ask">
              <Button size="sm">Ask Question</Button>
            </Link>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-3xl font-bold tracking-tight">Coding Challenges</h1>
            <p className="text-muted-foreground">
              Test your skills, earn points, and climb the leaderboard with our coding challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search challenges..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Challenges</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <AnimatePresence>
                    {filteredChallenges.length > 0 ? (
                      filteredChallenges.map((challenge, index) => (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className={`bg-gradient-to-r ${
                            challenge.type === "daily"
                              ? "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800"
                              : challenge.type === "weekly"
                                ? "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800"
                                : "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800"
                          } rounded-xl p-5 shadow-sm hover:shadow-md transition-all border`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge
                                className={`${
                                  challenge.type === "daily"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : challenge.type === "weekly"
                                      ? "bg-purple-100 text-purple-800 border-purple-200"
                                      : "bg-amber-100 text-amber-800 border-amber-200"
                                } mb-2`}
                              >
                                {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)} Challenge
                              </Badge>
                              <motion.h3
                                className="font-semibold text-lg"
                                animate={
                                  explodeIndex === index
                                    ? {
                                        scale: [1, 1.05, 1],
                                        color: ["#000", "#3b82f6", "#000"],
                                        transition: { duration: 0.5 },
                                      }
                                    : {}
                                }
                              >
                                {challenge.title}
                              </motion.h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>
                                  Difficulty: {challenge.difficulty} • {challenge.points} points
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline" className={challenge.categoryColor}>
                              {challenge.category}
                            </Badge>
                          </div>
                          <p className="mt-3 text-muted-foreground line-clamp-2">{challenge.description}</p>

                          {challenge.progress > 0 && (
                            <div className="mt-4 space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{challenge.progress}%</span>
                              </div>
                              <Progress value={challenge.progress} className="h-1.5" />
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-blue-200/50 dark:border-blue-800/50">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{challenge.participants} participants</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Ends in {challenge.timeRemaining}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExplode(index)}
                                className="gap-1"
                              >
                                <SparklesIcon className="h-3.5 w-3.5" />
                                Explode
                              </Button>
                              <Button size="sm" className="gap-1" onClick={() => handleStartChallenge(challenge.id)}>
                                {challenge.progress > 0 ? "Continue" : "Start Challenge"}{" "}
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center">
                        <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg mb-2">No challenges found</h3>
                        <p className="text-muted-foreground mb-4">
                          Try adjusting your filters to find challenges that match your criteria.
                        </p>
                        <Button
                          onClick={() => {
                            setSearchQuery("")
                            setDifficultyFilter("all")
                            setCategoryFilter("all")
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  <AnimatePresence>
                    {completedChallenges.length > 0 ? (
                      completedChallenges.map((challenge, index) => (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-green-200 dark:border-green-800"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">Completed</Badge>
                              <h3 className="font-semibold text-lg">{challenge.title}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>
                                  Difficulty: {challenge.difficulty} • {challenge.points} points
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline" className={challenge.categoryColor}>
                              {challenge.category}
                            </Badge>
                          </div>
                          <p className="mt-3 text-muted-foreground line-clamp-2">{challenge.description}</p>

                          <div className="mt-4 space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Completed</span>
                              <span>100%</span>
                            </div>
                            <Progress value={100} className="h-1.5 bg-green-100">
                              <div className="h-full bg-green-500" style={{ width: "100%" }}></div>
                            </Progress>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-green-200/50 dark:border-green-800/50">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Completed on {challenge.completedDate}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> View Solution
                              </Button>
                              <Button size="sm" className="gap-1">
                                Try Again <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center">
                        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg mb-2">No completed challenges yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start working on challenges to see them appear here once completed.
                        </p>
                        <Button onClick={() => setActiveTab("all")}>Browse Challenges</Button>
                      </div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* Other tabs will filter based on challenge type */}
                {["daily", "weekly", "monthly"].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                    <AnimatePresence>
                      {filteredChallenges.length > 0 ? (
                        filteredChallenges.map((challenge, index) => (
                          <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className={`bg-gradient-to-r ${
                              tabValue === "daily"
                                ? "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800"
                                : tabValue === "weekly"
                                  ? "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800"
                                  : "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800"
                            } rounded-xl p-5 shadow-sm hover:shadow-md transition-all border`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge
                                  className={`${
                                    tabValue === "daily"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : tabValue === "weekly"
                                        ? "bg-purple-100 text-purple-800 border-purple-200"
                                        : "bg-amber-100 text-amber-800 border-amber-200"
                                  } mb-2`}
                                >
                                  {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} Challenge
                                </Badge>
                                <h3 className="font-semibold text-lg">{challenge.title}</h3>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>
                                    Difficulty: {challenge.difficulty} • {challenge.points} points
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className={challenge.categoryColor}>
                                {challenge.category}
                              </Badge>
                            </div>
                            <p className="mt-3 text-muted-foreground line-clamp-2">{challenge.description}</p>

                            {challenge.progress > 0 && (
                              <div className="mt-4 space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Progress</span>
                                  <span>{challenge.progress}%</span>
                                </div>
                                <Progress value={challenge.progress} className="h-1.5" />
                              </div>
                            )}

                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-blue-200/50 dark:border-blue-800/50">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{challenge.participants} participants</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Ends in {challenge.timeRemaining}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleExplode(index)}
                                  className="gap-1"
                                >
                                  <SparklesIcon className="h-3.5 w-3.5" />
                                  Explode
                                </Button>
                                <Button size="sm" className="gap-1" onClick={() => handleStartChallenge(challenge.id)}>
                                  {challenge.progress > 0 ? "Continue" : "Start Challenge"}{" "}
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center">
                          <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="font-semibold text-lg mb-2">No {tabValue} challenges found</h3>
                          <p className="text-muted-foreground mb-4">
                            Try adjusting your filters or check back later for new challenges.
                          </p>
                          <Button
                            onClick={() => {
                              setSearchQuery("")
                              setDifficultyFilter("all")
                              setCategoryFilter("all")
                            }}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      )}
                    </AnimatePresence>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Challenge Leaderboard
                  </CardTitle>
                  <CardDescription>Top performers this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between">
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
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.completedChallenges} challenges</div>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {user.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href="/leaderboard" className="w-full">
                    <Button variant="outline" className="w-full">
                      View Full Leaderboard
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    Your Stats
                  </CardTitle>
                  <CardDescription>Your challenge performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span className="font-medium">Total Points</span>
                      </div>
                      <span className="font-bold">320</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Completed</span>
                      </div>
                      <span className="font-bold">6 challenges</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">In Progress</span>
                      </div>
                      <span className="font-bold">2 challenges</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Ranking</span>
                      </div>
                      <span className="font-bold">#3 of 156</span>
                    </div>

                    <div className="pt-2 border-t">
                      <h4 className="font-medium mb-2">Top Categories</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Algorithms</span>
                            <span className="text-muted-foreground">85%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Frontend</span>
                            <span className="text-muted-foreground">70%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-purple-400 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Backend</span>
                            <span className="text-muted-foreground">55%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
