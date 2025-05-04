"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/context/user-context"
import {
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Download,
  Calendar,
  Upload,
  Settings,
  Share2,
  Bell,
  BellOff,
} from "lucide-react"
import Link from "next/link"

// Mock classroom data
const classrooms = [
  {
    id: "1",
    name: "Data Structures & Algorithms",
    code: "CS301",
    description:
      "Learn about fundamental data structures like arrays, linked lists, trees, and graphs, as well as algorithms for searching, sorting, and graph traversal.",
    instructor: {
      name: "Dr. Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Computer Science",
    },
    semester: "3rd Semester",
    students: 25,
    materials: [
      {
        id: "m1",
        title: "Introduction to Data Structures",
        type: "pdf",
        size: "2.4 MB",
        uploadedOn: "April 2, 2024",
      },
      {
        id: "m2",
        title: "Array and Linked List Implementation",
        type: "pdf",
        size: "3.1 MB",
        uploadedOn: "April 5, 2024",
      },
      {
        id: "m3",
        title: "Tree Traversal Algorithms",
        type: "pdf",
        size: "1.8 MB",
        uploadedOn: "April 10, 2024",
      },
      {
        id: "m4",
        title: "Graph Algorithms - Lecture Notes",
        type: "pdf",
        size: "4.2 MB",
        uploadedOn: "April 12, 2024",
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "Assignment 1: Array Implementation",
        dueDate: "April 15, 2024",
        points: 100,
        status: "pending",
      },
      {
        id: "a2",
        title: "Assignment 2: Linked List Operations",
        dueDate: "April 22, 2024",
        points: 150,
        status: "pending",
      },
    ],
    questions: [
      {
        id: "q1",
        title: "Trouble with binary tree traversal",
        author: {
          name: "Rahul Singh",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        timeAgo: "2 days ago",
        replies: 3,
      },
      {
        id: "q2",
        title: "How to implement a priority queue efficiently?",
        author: {
          name: "Ananya Patel",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        timeAgo: "1 day ago",
        replies: 2,
      },
      {
        id: "q3",
        title: "Difference between DFS and BFS traversal",
        author: {
          name: "Vikram Kumar",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        timeAgo: "5 hours ago",
        replies: 1,
      },
    ],
    students: [
      {
        id: "s1",
        name: "Rahul Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        department: "Computer Science",
        semester: "3rd Semester",
      },
      {
        id: "s2",
        name: "Ananya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        department: "Data Science",
        semester: "3rd Semester",
      },
      {
        id: "s3",
        name: "Vikram Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        department: "AI & ML",
        semester: "3rd Semester",
      },
      // More students...
    ],
  },
  // More classrooms...
]

export default function ClassroomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const [isSubscribed, setIsSubscribed] = useState(true)

  const classroomId = params.id as string
  const classroom = classrooms.find((c) => c.id === classroomId)

  if (!classroom) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Classroom not found</h1>
        <p className="text-muted-foreground mb-6">The classroom you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/classrooms")}>Back to Classrooms</Button>
      </div>
    )
  }

  const isTeacher = user?.role === "teacher"

  const handleDownload = (materialId: string) => {
    toast({
      title: "Downloading material",
      description: "Your download will begin shortly.",
    })
  }

  const handleSubscriptionToggle = () => {
    setIsSubscribed(!isSubscribed)
    toast({
      title: isSubscribed ? "Notifications turned off" : "Notifications turned on",
      description: isSubscribed
        ? "You will no longer receive notifications for this classroom."
        : "You will now receive notifications for this classroom.",
    })
  }

  const handleShare = () => {
    // In a real app, this would copy a link to the clipboard
    toast({
      title: "Classroom link copied",
      description: "Share this link with others to invite them to the classroom.",
    })
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {classroom.code}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {classroom.semester}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{classroom.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={classroom.instructor.avatar} alt={classroom.instructor.name} />
                <AvatarFallback>{classroom.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {classroom.instructor.name} • {classroom.instructor.department}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleSubscriptionToggle}>
              {isSubscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            {isTeacher && (
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">{classroom.description}</p>
      </motion.div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Materials</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Q&A</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Students</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Course Materials</h2>
            {isTeacher && (
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Material
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {classroom.materials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{material.type.toUpperCase()}</span>
                          <span>{material.size}</span>
                          <span>Uploaded on {material.uploadedOn}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(material.id)}
                      className="text-primary"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Assignments</h2>
            {isTeacher && (
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Create Assignment
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {classroom.assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/dashboard/classrooms/${classroomId}/assignments/${assignment.id}`}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">{assignment.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due {assignment.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium">{assignment.points} points</div>
                          {isTeacher ? (
                            <Button variant="outline" size="sm">
                              View Submissions
                            </Button>
                          ) : (
                            <Button className="gap-2" size="sm">
                              <Upload className="h-4 w-4" />
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Questions & Answers</h2>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask Question
            </Button>
          </div>

          <div className="grid gap-4">
            {classroom.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/dashboard/classrooms/${classroomId}/qa/${question.id}`}>
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{question.title}</h3>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={question.author.avatar} alt={question.author.name} />
                              <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{question.author.name}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{question.timeAgo}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{question.replies} replies</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Students ({classroom.students.length})</h2>
            {isTeacher && (
              <Button className="gap-2">
                <Users className="h-4 w-4" />
                Invite Students
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {classroom.students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.department} • {student.semester}
                        </p>
                      </div>
                    </div>
                    {isTeacher && (
                      <Button variant="ghost" size="sm">
                        View Progress
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
