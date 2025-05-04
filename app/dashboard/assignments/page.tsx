"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, FileText, Filter, Search } from "lucide-react"

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for assignments
  const assignments = [
    {
      id: "1",
      title: "Data Structures Quiz",
      course: "Data Structures & Algorithms",
      dueDate: "Apr 15, 2025",
      status: "completed",
      score: 92,
      totalPoints: 100,
      description: "Quiz covering binary trees, heaps, and graph algorithms.",
      submittedDate: "Apr 10, 2025",
    },
    {
      id: "2",
      title: "Algorithm Analysis",
      course: "Data Structures & Algorithms",
      dueDate: "Apr 18, 2025",
      status: "in-progress",
      progress: 60,
      description: "Analyze the time and space complexity of various sorting algorithms.",
    },
    {
      id: "3",
      title: "Database Design Project",
      course: "Database Management Systems",
      dueDate: "Apr 25, 2025",
      status: "not-started",
      description: "Design and implement a database schema for an e-commerce platform.",
    },
    {
      id: "4",
      title: "Web Development Assignment",
      course: "Web Technologies",
      dueDate: "Apr 20, 2025",
      status: "in-progress",
      progress: 30,
      description: "Create a responsive website using HTML, CSS, and JavaScript.",
    },
    {
      id: "5",
      title: "Python Programming Challenge",
      course: "Programming Fundamentals",
      dueDate: "Apr 12, 2025",
      status: "completed",
      score: 85,
      totalPoints: 100,
      description: "Solve a set of programming challenges using Python.",
      submittedDate: "Apr 8, 2025",
    },
    {
      id: "6",
      title: "Machine Learning Project",
      course: "Introduction to AI",
      dueDate: "May 5, 2025",
      status: "not-started",
      description: "Implement a machine learning model to classify images.",
    },
  ]

  const filteredAssignments = assignments.filter((assignment) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return assignment.status === "completed"
    if (activeTab === "in-progress") return assignment.status === "in-progress"
    if (activeTab === "not-started") return assignment.status === "not-started"
    return true
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 cosmic-text">Assignments</h1>
          <p className="text-muted-foreground">Track your progress and manage your assignments</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search assignments..."
              className="pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[200px] md:w-[300px]"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cosmic-card h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course}</CardDescription>
                      </div>
                      <AssignmentStatusBadge status={assignment.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due {assignment.dueDate}</span>
                    </div>

                    {assignment.status === "completed" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Score</span>
                          <span className="font-medium">
                            {assignment.score}/{assignment.totalPoints}
                          </span>
                        </div>
                        <Progress value={(assignment.score! / assignment.totalPoints!) * 100} className="h-2" />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Submitted {assignment.submittedDate}</span>
                        </div>
                      </div>
                    )}

                    {assignment.status === "in-progress" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{assignment.progress}%</span>
                        </div>
                        <Progress value={assignment.progress} className="h-2" />
                      </div>
                    )}

                    <div className="pt-2">
                      <Link href={`/dashboard/assignments/${assignment.id}`}>
                        <Button className="w-full gap-2">
                          <FileText className="h-4 w-4" />
                          {assignment.status === "completed"
                            ? "View Submission"
                            : assignment.status === "in-progress"
                              ? "Continue Working"
                              : "Start Assignment"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No assignments found</h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === "completed"
                  ? "You haven't completed any assignments yet."
                  : activeTab === "in-progress"
                    ? "You don't have any assignments in progress."
                    : activeTab === "not-started"
                      ? "You don't have any new assignments to start."
                      : "No assignments match your search criteria."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AssignmentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Completed</Badge>
    case "in-progress":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">In Progress</Badge>
    case "not-started":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">Not Started</Badge>
    default:
      return null
  }
}
