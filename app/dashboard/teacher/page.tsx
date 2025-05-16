"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/lib/context/user-context";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Bell,
} from "lucide-react";

export default function TeacherDashboardPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const stats = [
    {
      title: "Total Students",
      value: "124",
      icon: Users,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Active Courses",
      value: "4",
      icon: BookOpen,
      color: "text-green-500 bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Assignments",
      value: "12",
      icon: Calendar,
      color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Avg. Score",
      value: "78%",
      icon: BarChart,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  const recentAssignments = [
    {
      id: 1,
      title: "Data Structures Quiz",
      dueDate: "Apr 15, 2025",
      submissions: 28,
      totalStudents: 32,
    },
    {
      id: 2,
      title: "Algorithm Analysis",
      dueDate: "Apr 18, 2025",
      submissions: 15,
      totalStudents: 32,
    },
    {
      id: 3,
      title: "Database Design Project",
      dueDate: "Apr 25, 2025",
      submissions: 8,
      totalStudents: 32,
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      time: "10:00 AM - 11:30 AM",
      date: "Today",
      location: "Room 302",
      students: 32,
    },
    {
      id: 2,
      title: "Database Management Systems",
      time: "1:00 PM - 2:30 PM",
      date: "Today",
      location: "Room 201",
      students: 28,
    },
    {
      id: 3,
      title: "Web Development",
      time: "9:30 AM - 11:00 AM",
      date: "Tomorrow",
      location: "Lab 101",
      students: 24,
    },
  ];

  const recentQuestions = [
    {
      id: 1,
      title: "How to implement a binary search tree in Java?",
      student: "Rahul Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "2 hours ago",
      answers: 3,
    },
    {
      id: 2,
      title: "Trouble with React useEffect dependencies",
      student: "Ananya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "5 hours ago",
      answers: 1,
    },
    {
      id: 3,
      title: "How to implement authentication in Next.js?",
      student: "Nabin Chapagain",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "1 day ago",
      answers: 0,
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "question",
      message: "Rahul Singh asked a new question",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "assignment",
      message: "15 new submissions for Algorithm Analysis",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "message",
      message: "Ananya Patel sent you a message",
      time: "1 day ago",
      read: true,
    },
  ];

  const topStudents = [
    {
      name: "Rahul Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1245,
      solutions: 42,
      progress: 92,
    },
    {
      name: "Ananya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 980,
      solutions: 35,
      progress: 85,
    },
    {
      name: "Nabin Chapagain",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 875,
      solutions: 29,
      progress: 78,
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 cosmic-text">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "Professor"}! Here's what's happening
            in your classes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Button>
          <Link href="/dashboard/teacher/classrooms">
            <Button className="gap-2 cosmic-button">
              <PlusCircle className="h-4 w-4" />
              Create Class
            </Button>
          </Link>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cosmic-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="cosmic-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Classes
                </CardTitle>
                <CardDescription>
                  Your schedule for today and tomorrow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{cls.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {cls.date}, {cls.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{cls.students} students</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {cls.location}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Assignments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="cosmic-card h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Recent Assignments
                  </CardTitle>
                  <CardDescription>Track submission progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAssignments.map((assignment) => (
                      <div key={assignment.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due {assignment.dueDate}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {assignment.submissions}/
                              {assignment.totalStudents} submissions
                            </span>
                            <span className="text-muted-foreground">
                              {Math.round(
                                (assignment.submissions /
                                  assignment.totalStudents) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              (assignment.submissions /
                                assignment.totalStudents) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/dashboard/teacher/assignments">
                      <Button variant="outline" size="sm">
                        View All Assignments
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card className="cosmic-card h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Recent Questions
                  </CardTitle>
                  <CardDescription>
                    Questions from your students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={question.avatar || "/placeholder.svg"}
                            alt={question.student}
                          />
                          <AvatarFallback>{question.student[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <p className="font-medium line-clamp-1">
                            {question.title}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {question.student}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {question.time}
                              </span>
                              {Array.isArray(question.answers)
                                ? question.answers.length
                                : 0}{" "}
                              {Array.isArray(question.answers) &&
                              question.answers.length === 1
                                ? "answer"
                                : "answers"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/dashboard/questions">
                      <Button variant="outline" size="sm">
                        View All Questions
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Assignments</h2>
            <Link href="/dashboard/teacher/assignments">
              <Button className="gap-2 cosmic-button">
                <PlusCircle className="h-4 w-4" />
                Create Assignment
              </Button>
            </Link>
          </div>

          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>
                Track and manage your assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Due {assignment.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="font-medium">
                            {Math.round(
                              (assignment.submissions /
                                assignment.totalStudents) *
                                100
                            )}
                            %
                          </span>{" "}
                          completed
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {assignment.submissions}/{assignment.totalStudents}{" "}
                          submissions
                        </span>
                      </div>
                      <Progress
                        value={
                          (assignment.submissions / assignment.totalStudents) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">
                  Assignments completed this semester
                </p>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4</div>
                <p className="text-sm text-muted-foreground">
                  Assignments currently active
                </p>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Low Submission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <p className="text-sm text-muted-foreground">
                  Assignments with &lt;50% submission rate
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Students</h2>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              View All Students
            </Button>
          </div>

          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>
                Students with the highest engagement and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topStudents.map((student, index) => (
                  <div
                    key={index}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={student.avatar || "/placeholder.svg"}
                            alt={student.name}
                          />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.points} points • {student.solutions}{" "}
                            solutions
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        {student.progress}% completion
                      </Badge>
                    </div>
                    <Progress value={student.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Class Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span>Computer Science</span>
                      <span>48 students</span>
                    </div>
                    <Progress value={48} max={124} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span>Data Science</span>
                      <span>32 students</span>
                    </div>
                    <Progress value={32} max={124} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span>AI & ML</span>
                      <span>28 students</span>
                    </div>
                    <Progress value={28} max={124} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span>Web Development</span>
                      <span>16 students</span>
                    </div>
                    <Progress value={16} max={124} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cosmic-card md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      student: "Rahul Singh",
                      avatar: "/placeholder.svg?height=40&width=40",
                      action: "submitted",
                      item: "Data Structures Quiz",
                      time: "2 hours ago",
                    },
                    {
                      student: "Ananya Patel",
                      avatar: "/placeholder.svg?height=40&width=40",
                      action: "asked",
                      item: "a question about React hooks",
                      time: "5 hours ago",
                    },
                    {
                      student: "Vikram Kumar",
                      avatar: "/placeholder.svg?height=40&width=40",
                      action: "answered",
                      item: "a question about Python recursion",
                      time: "1 day ago",
                    },
                    {
                      student: "Nabin Chapagain",
                      avatar: "/placeholder.svg?height=40&width=40",
                      action: "submitted",
                      item: "Algorithm Analysis assignment",
                      time: "1 day ago",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={activity.avatar || "/placeholder.svg"}
                          alt={activity.student}
                        />
                        <AvatarFallback>{activity.student[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <p>
                          <span className="font-medium">
                            {activity.student}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {activity.action}
                          </span>{" "}
                          <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Questions</h2>
            <Link href="/dashboard/questions">
              <Button variant="outline">View All Questions</Button>
            </Link>
          </div>

          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle>Recent Questions</CardTitle>
              <CardDescription>
                Questions from your students that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={question.avatar || "/placeholder.svg"}
                          alt={question.student}
                        />
                        <AvatarFallback>{question.student[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-medium">{question.title}</h3>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Asked by {question.student}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {question.time}
                            </span>
                          </div>
                          {Array.isArray(question.answers)
                            ? question.answers.length
                            : 0}{" "}
                          {Array.isArray(question.answers) &&
                          question.answers.length === 1
                            ? "answer"
                            : "answers"}
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            View Question
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Question Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      category: "Java",
                      count: 15,
                      color: "bg-blue-100 dark:bg-blue-900/30",
                    },
                    {
                      category: "Python",
                      count: 12,
                      color: "bg-yellow-100 dark:bg-yellow-900/30",
                    },
                    {
                      category: "JavaScript",
                      count: 10,
                      color: "bg-amber-100 dark:bg-amber-900/30",
                    },
                    {
                      category: "React",
                      count: 8,
                      color: "bg-cyan-100 dark:bg-cyan-900/30",
                    },
                    {
                      category: "Data Structures",
                      count: 7,
                      color: "bg-green-100 dark:bg-green-900/30",
                    },
                  ].map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${item.color}`}
                        ></div>
                        <span>{item.category}</span>
                      </div>
                      <Badge variant="outline">{item.count} questions</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Question Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Total Questions
                    </p>
                    <p className="text-3xl font-bold">52</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Answered</p>
                    <p className="text-3xl font-bold">48</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Unanswered</p>
                    <p className="text-3xl font-bold">4</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Avg. Response Time
                    </p>
                    <p className="text-3xl font-bold">5h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Projects</h2>
            <Link href="/dashboard/teacher/projects">
              <Button className="gap-2 cosmic-button">
                <PlusCircle className="h-4 w-4" />
                Create Project
              </Button>
            </Link>
          </div>

          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Track and manage your class projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    title: "AI-Powered Code Assistant",
                    status: "in-progress",
                    progress: 65,
                    dueDate: "May 15, 2025",
                    course: "Machine Learning Basics",
                  },
                  {
                    title: "Distributed Learning Platform",
                    status: "completed",
                    progress: 100,
                    dueDate: "March 10, 2025",
                    course: "Web Development",
                  },
                  {
                    title: "Algorithm Visualization Tool",
                    status: "overdue",
                    progress: 40,
                    dueDate: "April 1, 2025",
                    course: "Data Structures & Algorithms",
                  },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Due {project.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={
                            project.status === "completed"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
                              : project.status === "overdue"
                              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900"
                          }
                        >
                          {project.status === "completed"
                            ? "Completed"
                            : project.status === "overdue"
                            ? "Overdue"
                            : "In Progress"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{project.course}</span>
                        <span>{project.progress}% complete</span>
                      </div>
                      <Progress
                        value={project.progress}
                        className={
                          project.status === "completed"
                            ? "h-2 bg-green-500"
                            : project.status === "overdue"
                            ? "h-2 bg-red-500"
                            : "h-2"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
