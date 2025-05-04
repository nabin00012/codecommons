"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Code,
  Trophy,
  Award,
  Star,
  Calendar,
  FileCode,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  Zap,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Mock user data
const currentUser = {
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
};

// Achievement data
const achievements = [
  {
    id: 1,
    name: "First Question",
    description: "Ask your first question on CodeCommons",
    icon: "help-circle",
    category: "participation",
    points: 10,
    progress: 100,
    completed: true,
    completedDate: "September 20, 2023",
  },
  {
    id: 2,
    name: "First Answer",
    description: "Post your first answer on CodeCommons",
    icon: "message-square",
    category: "participation",
    points: 10,
    progress: 100,
    completed: true,
    completedDate: "September 25, 2023",
  },
  {
    id: 3,
    name: "Helpful Guide",
    description: "Receive 50+ upvotes on your answers",
    icon: "thumbs-up",
    category: "reputation",
    points: 50,
    progress: 100,
    completed: true,
    completedDate: "February 10, 2025",
  },
  {
    id: 4,
    name: "Web Wizard",
    description: "Answer 25+ web development questions",
    icon: "code",
    category: "expertise",
    points: 100,
    progress: 100,
    completed: true,
    completedDate: "March 5, 2025",
  },
  {
    id: 5,
    name: "Rising Star",
    description: "Earn 500+ points in your first 3 months",
    icon: "star",
    category: "reputation",
    points: 50,
    progress: 100,
    completed: true,
    completedDate: "December 15, 2023",
  },
  {
    id: 6,
    name: "Consistent Contributor",
    description: "Contribute for 30 consecutive days",
    icon: "calendar",
    category: "participation",
    points: 100,
    progress: 100,
    completed: true,
    completedDate: "January 20, 2025",
  },
  {
    id: 7,
    name: "Question Master",
    description: "Ask 50+ questions",
    icon: "help-circle",
    category: "participation",
    points: 100,
    progress: 36,
    completed: false,
    completedDate: null,
  },
  {
    id: 8,
    name: "Solution Guru",
    description: "Provide 50+ solutions",
    icon: "message-square",
    category: "participation",
    points: 100,
    progress: 58,
    completed: false,
    completedDate: null,
  },
  {
    id: 9,
    name: "Top 10 Contributor",
    description: "Reach the top 10 on the leaderboard",
    icon: "trophy",
    category: "reputation",
    points: 200,
    progress: 100,
    completed: true,
    completedDate: "March 1, 2025",
  },
  {
    id: 10,
    name: "Mentor",
    description: "Help 100+ students with their questions",
    icon: "users",
    category: "reputation",
    points: 200,
    progress: 29,
    completed: false,
    completedDate: null,
  },
  {
    id: 11,
    name: "JavaScript Expert",
    description: "Answer 50+ JavaScript questions",
    icon: "file-code",
    category: "expertise",
    points: 150,
    progress: 42,
    completed: false,
    completedDate: null,
  },
  {
    id: 12,
    name: "React Master",
    description: "Answer 30+ React questions",
    icon: "code",
    category: "expertise",
    points: 150,
    progress: 60,
    completed: false,
    completedDate: null,
  },
];

// Weekly achievements
const weeklyAchievements = [
  {
    id: 101,
    name: "March Week 4 Challenge",
    description: "Answer 5 questions this week",
    icon: "zap",
    category: "weekly",
    points: 25,
    progress: 80,
    target: 5,
    current: 4,
    completed: false,
    expiresOn: "March 28, 2025",
  },
  {
    id: 102,
    name: "Algorithm Expert",
    description: "Answer 3 algorithm questions this week",
    icon: "file-code",
    category: "weekly",
    points: 30,
    progress: 67,
    target: 3,
    current: 2,
    completed: false,
    expiresOn: "March 28, 2025",
  },
  {
    id: 103,
    name: "Helpful Reviewer",
    description: "Comment on 10 questions or answers this week",
    icon: "message-square",
    category: "weekly",
    points: 20,
    progress: 40,
    target: 10,
    current: 4,
    completed: false,
    expiresOn: "March 28, 2025",
  },
];

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("all");

  // Filter achievements based on active tab
  const filteredAchievements =
    activeTab === "all"
      ? achievements
      : achievements.filter(
          (achievement) => achievement.category === activeTab
        );

  // Get achievement icon
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "calendar":
        return <Calendar className="h-5 w-5" />;
      case "message-square":
        return <MessageSquare className="h-5 w-5" />;
      case "file-code":
        return <FileCode className="h-5 w-5" />;
      case "code":
        return <Code className="h-5 w-5" />;
      case "help-circle":
        return <HelpCircle className="h-5 w-5" />;
      case "star":
        return <Star className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "thumbs-up":
        return <ThumbsUp className="h-5 w-5" />;
      case "trophy":
        return <Trophy className="h-5 w-5" />;
      case "zap":
        return <Zap className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

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
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/achievements"
              className="text-sm font-medium text-primary"
            >
              Achievements
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/ask">
              <Button size="sm">Ask Question</Button>
            </Link>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
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
            <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
            <p className="text-muted-foreground">
              Track your progress and earn badges by completing various
              challenges and activities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="md:col-span-2 space-y-6"
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>
                    Complete activities to earn points and badges
                  </CardDescription>
                  <Tabs
                    defaultValue="all"
                    className="w-full mt-2"
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="participation">
                        Participation
                      </TabsTrigger>
                      <TabsTrigger value="reputation">Reputation</TabsTrigger>
                      <TabsTrigger value="expertise">Expertise</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAchievements.map((achievement) => (
                      <HoverCard key={achievement.id}>
                        <HoverCardTrigger asChild>
                          <div
                            className={`border rounded-lg p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm ${
                              achievement.completed
                                ? "bg-muted/20"
                                : "bg-background"
                            }`}
                          >
                            <div
                              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                achievement.completed
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {getAchievementIcon(achievement.icon)}
                            </div>
                            <h3 className="font-medium">{achievement.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {achievement.description}
                            </p>
                            <div className="w-full mt-2">
                              <Progress
                                value={achievement.progress}
                                className="h-1.5"
                              />
                            </div>
                            <div className="flex items-center justify-between w-full mt-1">
                              <Badge
                                variant="outline"
                                className="gap-1 text-xs"
                              >
                                <Trophy className="h-3 w-3" />{" "}
                                {achievement.points} pts
                              </Badge>
                              {achievement.completed ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200 gap-1 text-xs">
                                  <CheckCircle2 className="h-3 w-3" /> Completed
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-xs"
                                >
                                  {achievement.progress}% complete
                                </Badge>
                              )}
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  achievement.completed
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {getAchievementIcon(achievement.icon)}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold">
                                  {achievement.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {achievement.points} points
                                </p>
                              </div>
                            </div>
                            <p className="text-sm">{achievement.description}</p>
                            <div className="pt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress
                                value={achievement.progress}
                                className="h-2"
                              />
                            </div>
                            {achievement.completed && (
                              <div className="flex items-center pt-2 text-xs text-muted-foreground">
                                <Calendar className="mr-2 h-3.5 w-3.5" />
                                <span>
                                  Completed on {achievement.completedDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="md:col-span-1 space-y-6"
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="font-medium">Total Achievements</span>
                      </div>
                      <span className="font-bold">
                        {achievements.filter((a) => a.completed).length}/
                        {achievements.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Points Earned</span>
                      </div>
                      <span className="font-bold">
                        {achievements
                          .filter((a) => a.completed)
                          .reduce((sum, a) => sum + a.points, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Badges Unlocked</span>
                      </div>
                      <span className="font-bold">
                        {currentUser.badges.length}
                      </span>
                    </div>

                    <div className="pt-2 border-t">
                      <h4 className="font-medium mb-2">Your Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.badges.map((badge, index) => (
                          <Badge
                            key={index}
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Weekly Challenges
                  </CardTitle>
                  <CardDescription>
                    Complete these before March 28, 2025
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            {getAchievementIcon(achievement.icon)}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">
                              {achievement.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              Progress: {achievement.current}/
                              {achievement.target}
                            </span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress
                            value={achievement.progress}
                            className="h-1.5"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Trophy className="h-3 w-3" /> {achievement.points}{" "}
                            pts
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Expires {achievement.expiresOn}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full gap-1">
                    <Zap className="h-4 w-4" />
                    View All Weekly Challenges
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
