"use client";

import type React from "react";
import { useParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Trophy,
  MessageSquare,
  ThumbsUp,
  Award,
  Star,
  Mail,
  Calendar,
  MapPin,
  BookOpen,
  User,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  FileCode,
  HelpCircle,
  Clock,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Import the ProjectShowcase component and mock projects data
import { ProjectShowcase } from "@/components/project-showcase";
import { mockProjects } from "@/data/mock-projects";

// Import the CosmicCardEffect component
import { CosmicCardEffect } from "@/components/cosmic-card-effect";

// Mock data for contributors (same as in leaderboard page)
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
    email: "rahul.singh@jainuniversity.ac.in",
    location: "Bangalore, India",
    bio: "Computer Science student passionate about algorithms and machine learning. I love solving complex problems and helping others learn.",
    github: "github.com/rahulsingh",
    linkedin: "linkedin.com/in/rahulsingh",
    twitter: "twitter.com/rahulsingh",
    recentActivities: [
      {
        type: "answer",
        title: "How to implement a binary search tree in Java?",
        date: "2 days ago",
        points: 15,
      },
      {
        type: "question",
        title: "Best practices for Python error handling?",
        date: "1 week ago",
        points: 5,
      },
      {
        type: "answer",
        title: "Optimizing database queries in Node.js",
        date: "1 week ago",
        points: 10,
      },
      {
        type: "answer",
        title: "Understanding React useEffect dependencies",
        date: "2 weeks ago",
        points: 20,
      },
      {
        type: "question",
        title: "Implementing JWT authentication in Express",
        date: "3 weeks ago",
        points: 5,
      },
    ],
    achievements: [
      {
        name: "100 Day Streak",
        description: "Contributed for 100 consecutive days",
        date: "March 15, 2025",
        icon: "calendar",
      },
      {
        name: "Solution Guru",
        description: "Provided 50+ solutions",
        date: "February 28, 2025",
        icon: "message-square",
      },
      {
        name: "Python Master",
        description: "Answered 25+ Python questions",
        date: "January 20, 2025",
        icon: "code",
      },
      {
        name: "First Answer",
        description: "Posted first answer",
        date: "August 15, 2023",
        icon: "message-square",
      },
      {
        name: "First Question",
        description: "Posted first question",
        date: "August 10, 2023",
        icon: "help-circle",
      },
    ],
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
    email: "ananya.patel@jainuniversity.ac.in",
    location: "Bangalore, India",
    bio: "Data Science student with a passion for statistical analysis and machine learning. I enjoy working with large datasets and finding patterns.",
    github: "github.com/ananyapatel",
    linkedin: "linkedin.com/in/ananyapatel",
    twitter: "twitter.com/ananyapatel",
    recentActivities: [
      {
        type: "answer",
        title: "How to optimize R code for large datasets?",
        date: "3 days ago",
        points: 15,
      },
      {
        type: "question",
        title: "Best practices for data visualization in Python?",
        date: "1 week ago",
        points: 5,
      },
      {
        type: "answer",
        title: "SQL query optimization techniques",
        date: "2 weeks ago",
        points: 10,
      },
      {
        type: "answer",
        title: "Understanding statistical significance in data analysis",
        date: "3 weeks ago",
        points: 20,
      },
      {
        type: "question",
        title: "Implementing neural networks in R",
        date: "1 month ago",
        points: 5,
      },
    ],
    achievements: [
      {
        name: "Data Wizard",
        description: "Answered 25+ data science questions",
        date: "March 10, 2025",
        icon: "database",
      },
      {
        name: "Rising Star",
        description: "Earned 500+ points in first 3 months",
        date: "January 15, 2025",
        icon: "star",
      },
      {
        name: "First Answer",
        description: "Posted first answer",
        date: "October 20, 2023",
        icon: "message-square",
      },
      {
        name: "First Question",
        description: "Posted first question",
        date: "October 15, 2023",
        icon: "help-circle",
      },
    ],
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
    email: "nabin.chapagain@jainuniversity.ac.in",
    location: "Bangalore, India",
    bio: "Computer Science student specializing in web development. I'm passionate about creating intuitive user interfaces and helping others learn web technologies.",
    github: "github.com/nabinchapagain",
    linkedin: "linkedin.com/in/nabinchapagain",
    twitter: "twitter.com/nabinchapagain",
    recentActivities: [
      {
        type: "answer",
        title: "How to implement authentication in Next.js?",
        date: "1 day ago",
        points: 20,
      },
      {
        type: "question",
        title: "Best practices for React state management?",
        date: "5 days ago",
        points: 5,
      },
      {
        type: "answer",
        title: "CSS Grid vs Flexbox - When to use which?",
        date: "1 week ago",
        points: 15,
      },
      {
        type: "answer",
        title: "Understanding React hooks",
        date: "2 weeks ago",
        points: 10,
      },
      {
        type: "question",
        title: "Optimizing Next.js applications",
        date: "3 weeks ago",
        points: 5,
      },
    ],
    achievements: [
      {
        name: "Web Wizard",
        description: "Answered 25+ web development questions",
        date: "March 5, 2025",
        icon: "code",
      },
      {
        name: "Helpful Guide",
        description: "Received 50+ upvotes on answers",
        date: "February 10, 2025",
        icon: "thumbs-up",
      },
      {
        name: "First Answer",
        description: "Posted first answer",
        date: "September 25, 2023",
        icon: "message-square",
      },
      {
        name: "First Question",
        description: "Posted first question",
        date: "September 20, 2023",
        icon: "help-circle",
      },
    ],
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
    email: "priya.sharma@jainuniversity.ac.in",
    location: "Bangalore, India",
    bio: "Professor of Computer Science with 10+ years of experience. My research focuses on algorithms, data structures, and computational complexity. I enjoy mentoring students and helping them develop their problem-solving skills.",
    github: "github.com/drpriyasharma",
    linkedin: "linkedin.com/in/drpriyasharma",
    twitter: "twitter.com/drpriyasharma",
    recentActivities: [
      {
        type: "answer",
        title: "Advanced algorithms for graph traversal",
        date: "2 days ago",
        points: 25,
      },
      {
        type: "answer",
        title: "Understanding time complexity in recursive algorithms",
        date: "1 week ago",
        points: 20,
      },
      {
        type: "question",
        title: "Research directions in computational complexity",
        date: "2 weeks ago",
        points: 5,
      },
      {
        type: "answer",
        title: "Optimizing dynamic programming solutions",
        date: "3 weeks ago",
        points: 15,
      },
      {
        type: "answer",
        title: "Best practices for teaching data structures",
        date: "1 month ago",
        points: 10,
      },
    ],
    achievements: [
      {
        name: "Faculty Star",
        description: "Top-ranked professor on the platform",
        date: "March 1, 2025",
        icon: "award",
      },
      {
        name: "Mentor",
        description: "Helped 100+ students with their questions",
        date: "January 15, 2025",
        icon: "users",
      },
      {
        name: "Algorithm Expert",
        description: "Answered 20+ algorithm questions",
        date: "November 10, 2024",
        icon: "code",
      },
      {
        name: "First Answer",
        description: "Posted first answer",
        date: "June 15, 2023",
        icon: "message-square",
      },
    ],
  },
];

// Mock data for contribution history
const contributionHistory = [
  { month: "Mar 2025", points: 235, questions: 4, answers: 8, comments: 15 },
  { month: "Feb 2025", points: 210, questions: 3, answers: 7, comments: 12 },
  { month: "Jan 2025", points: 180, questions: 2, answers: 6, comments: 10 },
  { month: "Dec 2024", points: 150, questions: 3, answers: 5, comments: 8 },
  { month: "Nov 2024", points: 120, questions: 2, answers: 4, comments: 7 },
  { month: "Oct 2024", points: 100, questions: 2, answers: 3, comments: 6 },
];

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  // Find the user profile based on the username
  const userProfile = contributors.find((user) => user.username === username);

  // If user not found, show error
  if (!userProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="text-muted-foreground mb-6">
          The user profile you're looking for doesn't exist.
        </p>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Add this line to enable the cosmic card effect
  CosmicCardEffect();

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

  // Get icon for achievement
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "calendar":
        return <Calendar className="h-4 w-4" />;
      case "message-square":
        return <MessageSquare className="h-4 w-4" />;
      case "code":
        return <FileCode className="h-4 w-4" />;
      case "help-circle":
        return <HelpCircle className="h-4 w-4" />;
      case "star":
        return <Star className="h-4 w-4" />;
      case "award":
        return <Award className="h-4 w-4" />;
      case "users":
        return <User className="h-4 w-4" />;
      case "thumbs-up":
        return <ThumbsUp className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
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
              href="/challenges"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Challenges
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/ask">
              <Button size="sm">Ask Question</Button>
            </Link>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="@user"
              />
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <Link
            href="/leaderboard"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Leaderboard
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="border-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-2">
                      <Avatar className="h-24 w-24 border-2 border-primary/20">
                        <AvatarImage
                          src={userProfile.avatar || "/placeholder.svg"}
                          alt={userProfile.name}
                        />
                        <AvatarFallback>
                          {userProfile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 border border-border">
                        <Badge className="rounded-full h-7 w-7 flex items-center justify-center p-0 text-xs font-bold">
                          #{userProfile.rank}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">
                      {userProfile.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={
                          userProfile.role === "Professor"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {userProfile.role}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {userProfile.badges.map((badge, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={getBadgeColor(badge)}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="w-full border-t mt-4 pt-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {userProfile.points}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Points
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {userProfile.solutions}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Solutions
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {userProfile.questions}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Questions
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-center">{userProfile.bio}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.location}</span>
                      </div>
                      {userProfile.role === "Student" && (
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {userProfile.department}, {userProfile.semester}
                          </span>
                        </div>
                      )}
                      {userProfile.role === "Professor" && (
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{userProfile.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined {userProfile.joinedDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 pt-2">
                      <Link
                        href={`https://${userProfile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link
                        href={`https://${userProfile.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link
                        href={`https://${userProfile.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Top Languages
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {userProfile.topLanguages.map((language, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{language.name}</span>
                          <span className="text-muted-foreground">
                            {language.percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              index === 0
                                ? "bg-primary"
                                : index === 1
                                ? "bg-blue-400"
                                : "bg-green-400"
                            }`}
                            style={{ width: `${language.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {userProfile.achievements.map((achievement, index) => (
                      <HoverCard key={index}>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {getAchievementIcon(achievement.icon)}
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {achievement.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {achievement.date}
                                </div>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">
                                {achievement.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              <div className="flex items-center pt-2">
                                <Calendar className="mr-2 h-4 w-4 opacity-70" />
                                <span className="text-xs text-muted-foreground">
                                  Earned on {achievement.date}
                                </span>
                              </div>
                            </div>
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
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="contributions">Contributions</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                      <CardDescription>
                        Latest contributions from {userProfile.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProfile.recentActivities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                          >
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                activity.type === "answer"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {activity.type === "answer" ? (
                                <MessageSquare className="h-4 w-4" />
                              ) : (
                                <HelpCircle className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-sm">
                                  {activity.type === "answer"
                                    ? "Answered:"
                                    : "Asked:"}{" "}
                                  {activity.title}
                                </div>
                                <Badge variant="outline" className="gap-1">
                                  <ThumbsUp className="h-3 w-3" /> +
                                  {activity.points}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {activity.date}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="outline" className="w-full">
                        View All Activity
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="contributions" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Contribution History
                      </CardTitle>
                      <CardDescription>
                        Monthly contribution statistics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-6">
                          {contributionHistory.map((month, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center gap-1 flex-1"
                            >
                              <div
                                className="w-full bg-muted/50 rounded-t-md"
                                style={{
                                  height: `${(month.points / 250) * 100}%`,
                                }}
                              >
                                <div className="w-full h-full bg-primary/20 hover:bg-primary/30 transition-colors rounded-t-md relative group">
                                  <div className="absolute inset-x-0 -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                    <div className="text-xs font-medium bg-background border rounded px-2 py-1 shadow-sm inline-block">
                                      {month.points} points
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {month.month}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              Total Questions
                            </div>
                            <div className="text-2xl font-bold">
                              {userProfile.questions}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              Total Answers
                            </div>
                            <div className="text-2xl font-bold">
                              {userProfile.solutions}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              Total Comments
                            </div>
                            <div className="text-2xl font-bold">
                              {userProfile.comments}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Monthly Breakdown
                      </CardTitle>
                      <CardDescription>
                        Detailed monthly contribution data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Month
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Points
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Questions
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Answers
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Comments
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {contributionHistory.map((month, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-muted/50 transition-colors"
                              >
                                <td className="px-4 py-3 text-sm font-medium">
                                  {month.month}
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  {month.points}
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  {month.questions}
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  {month.answers}
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  {month.comments}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats" className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Weekly Points</CardTitle>
                        <CardDescription>
                          Points earned in March 2025
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-end justify-between gap-4 pt-6">
                          {userProfile.weeklyPoints.map((points, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center gap-1 flex-1"
                            >
                              <div
                                className={`w-full rounded-t-md ${
                                  index === 3 ? "bg-primary" : "bg-primary/30"
                                }`}
                                style={{ height: `${(points / 500) * 100}%` }}
                              />
                              <span className="text-xs text-muted-foreground">
                                Week {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Contribution Breakdown
                        </CardTitle>
                        <CardDescription>
                          Types of contributions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-[200px]">
                          <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="space-y-2 text-center">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <MessageSquare className="h-6 w-6 text-primary" />
                              </div>
                              <div className="text-xl font-bold">
                                {userProfile.solutions}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Solutions
                              </div>
                            </div>
                            <div className="space-y-2 text-center">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <HelpCircle className="h-6 w-6 text-blue-700" />
                              </div>
                              <div className="text-xl font-bold">
                                {userProfile.questions}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Questions
                              </div>
                            </div>
                            <div className="space-y-2 text-center">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                                <ThumbsUp className="h-6 w-6 text-amber-700" />
                              </div>
                              <div className="text-xl font-bold">
                                {userProfile.points}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Points
                              </div>
                            </div>
                            <div className="space-y-2 text-center">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <MessageSquare className="h-6 w-6 text-green-700" />
                              </div>
                              <div className="text-xl font-bold">
                                {userProfile.comments}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Comments
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Ranking History</CardTitle>
                      <CardDescription>
                        Position on the leaderboard over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Trophy className="h-12 w-12 mx-auto mb-2 text-amber-500" />
                          <p>
                            Currently ranked{" "}
                            <span className="font-bold text-foreground">
                              #{userProfile.rank}
                            </span>{" "}
                            on the leaderboard
                          </p>
                          <p className="text-sm mt-1">
                            {userProfile.rank < userProfile.previousRank
                              ? `Moved up ${
                                  userProfile.previousRank - userProfile.rank
                                } position(s) this week`
                              : userProfile.rank > userProfile.previousRank
                              ? `Moved down ${
                                  userProfile.rank - userProfile.previousRank
                                } position(s) this week`
                              : "Maintained position this week"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6"
            >
              <ProjectShowcase
                username={userProfile.username}
                projects={mockProjects[userProfile.username] || []}
              />
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
