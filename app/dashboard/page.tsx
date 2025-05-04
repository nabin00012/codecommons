"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/context/user-context"
import { BookOpen, FileText, MessageSquare, Users, BarChart3, Clock } from "lucide-react"

export default function DashboardPage() {
  const { user } = useUser()

  const stats = [
    {
      title: "Classrooms",
      value: "5",
      icon: BookOpen,
      description: "Active classrooms",
    },
    {
      title: "Assignments",
      value: "12",
      icon: FileText,
      description: "Total assignments",
    },
    {
      title: "Questions",
      value: "24",
      icon: MessageSquare,
      description: "Questions asked",
    },
    {
      title: "Students",
      value: "120",
      icon: Users,
      description: user?.role === "teacher" ? "Students taught" : "Classmates",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "assignment",
      title: "Data Structures Assignment 3",
      classroom: "Data Structures & Algorithms",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "question",
      title: "How to implement authentication in Next.js?",
      classroom: "Web Development",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "classroom",
      title: "Joined Machine Learning Basics",
      classroom: "Machine Learning Basics",
      time: "1 day ago",
    },
  ]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0] || "User"}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your {user?.role === "teacher" ? "classes" : "learning journey"} today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      {activity.type === "assignment" ? (
                        <FileText className="h-4 w-4" />
                      ) : activity.type === "question" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.classroom}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Overview
              </CardTitle>
              <CardDescription>Your progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Assignments Completed</p>
                    <p className="text-sm font-medium">8/12</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "66.7%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Questions Answered</p>
                    <p className="text-sm font-medium">15/24</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "62.5%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Overall Progress</p>
                    <p className="text-sm font-medium">75%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
