"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { School, Plus, Users, ArrowRight, Search } from "lucide-react"
import { useUser } from "@/lib/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import { CodeIcon } from "@/components/code-icon"

// Mock data for classrooms
const classrooms = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    subject: "Computer Science",
    semester: "Spring 2025",
    members: 32,
    teacher: { name: "Dr. Priya Sharma", avatar: "/placeholder.svg?height=40&width=40", initials: "PS" },
    students: [
      { name: "Rahul Singh", avatar: "/placeholder.svg?height=40&width=40", initials: "RS" },
      { name: "Ananya Patel", avatar: "/placeholder.svg?height=40&width=40", initials: "AP" },
      { name: "Vikram Kumar", avatar: "/placeholder.svg?height=40&width=40", initials: "VK" },
      { name: "Meera Desai", avatar: "/placeholder.svg?height=40&width=40", initials: "MD" },
    ],
    tags: ["DSA", "Algorithms", "Java"],
    color: "from-blue-500/20 to-cyan-500/20 border-blue-200/30 dark:border-blue-800/30",
    progress: 65,
  },
  {
    id: 2,
    name: "Machine Learning Fundamentals",
    subject: "Artificial Intelligence",
    semester: "Spring 2025",
    members: 28,
    teacher: { name: "Prof. Rajesh Kumar", avatar: "/placeholder.svg?height=40&width=40", initials: "RK" },
    students: [
      { name: "Sanjay Mehta", avatar: "/placeholder.svg?height=40&width=40", initials: "SM" },
      { name: "Nabin Chapagain", avatar: "/placeholder.svg?height=40&width=40", initials: "NC" },
      { name: "Arjun Reddy", avatar: "/placeholder.svg?height=40&width=40", initials: "AR" },
    ],
    tags: ["AI", "ML", "Python"],
    color: "from-purple-500/20 to-pink-500/20 border-purple-200/30 dark:border-purple-800/30",
    progress: 42,
  },
  {
    id: 3,
    name: "Web Development with React",
    subject: "Web Technologies",
    semester: "Spring 2025",
    members: 35,
    teacher: { name: "Dr. Amit Verma", avatar: "/placeholder.svg?height=40&width=40", initials: "AV" },
    students: [
      { name: "Karthik Nair", avatar: "/placeholder.svg?height=40&width=40", initials: "KN" },
      { name: "Rahul Singh", avatar: "/placeholder.svg?height=40&width=40", initials: "RS" },
      { name: "Ananya Patel", avatar: "/placeholder.svg?height=40&width=40", initials: "AP" },
      { name: "Nabin Chapagain", avatar: "/placeholder.svg?height=40&width=40", initials: "NC" },
    ],
    tags: ["WebDev", "React", "JavaScript"],
    color: "from-amber-500/20 to-orange-500/20 border-amber-200/30 dark:border-amber-800/30",
    progress: 78,
  },
  {
    id: 4,
    name: "Database Management Systems",
    subject: "Computer Science",
    semester: "Spring 2025",
    members: 30,
    teacher: { name: "Prof. Sunita Patel", avatar: "/placeholder.svg?height=40&width=40", initials: "SP" },
    students: [
      { name: "Vikram Kumar", avatar: "/placeholder.svg?height=40&width=40", initials: "VK" },
      { name: "Meera Desai", avatar: "/placeholder.svg?height=40&width=40", initials: "MD" },
      { name: "Sanjay Mehta", avatar: "/placeholder.svg?height=40&width=40", initials: "SM" },
    ],
    tags: ["Database", "SQL", "DBMS"],
    color: "from-green-500/20 to-emerald-500/20 border-green-200/30 dark:border-green-800/30",
    progress: 55,
  },
  {
    id: 5,
    name: "Mobile App Development",
    subject: "Software Engineering",
    semester: "Spring 2025",
    members: 25,
    teacher: { name: "Dr. Neha Gupta", avatar: "/placeholder.svg?height=40&width=40", initials: "NG" },
    students: [
      { name: "Arjun Reddy", avatar: "/placeholder.svg?height=40&width=40", initials: "AR" },
      { name: "Karthik Nair", avatar: "/placeholder.svg?height=40&width=40", initials: "KN" },
      { name: "Rahul Singh", avatar: "/placeholder.svg?height=40&width=40", initials: "RS" },
    ],
    tags: ["Mobile", "Android", "iOS"],
    color: "from-red-500/20 to-rose-500/20 border-red-200/30 dark:border-red-800/30",
    progress: 32,
  },
]

export default function ClassroomsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [isTeacher, setIsTeacher] = useState(user?.role === "teacher")
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    subject: "",
    semester: "",
    description: "",
    tags: "",
  })
  const [userClassrooms, setUserClassrooms] = useState(classrooms)

  // Update isTeacher when user role changes
  useState(() => {
    setIsTeacher(user?.role === "teacher")
  })

  // Filter classrooms based on search query
  const filteredClassrooms = userClassrooms.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get emoji based on gender (simplified)
  const getEmoji = () => {
    return user?.role === "teacher" ? "👩‍🏫" : "👨‍💻"
  }

  // Handle classroom creation
  const handleCreateClassroom = () => {
    // Create a new classroom with form data
    const newClassroomData = {
      id: userClassrooms.length + 1,
      name: newClassroom.name,
      subject: newClassroom.subject,
      semester: newClassroom.semester,
      members: 1,
      teacher: {
        name: user?.name || "Dr. Priya Sharma",
        avatar: user?.avatar || "/placeholder.svg?height=40&width=40",
        initials:
          user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "PS",
      },
      students: [],
      tags: newClassroom.tags.split(",").map((tag) => tag.trim()),
      color: "from-blue-500/20 to-cyan-500/20 border-blue-200/30 dark:border-blue-800/30",
      progress: 0,
    }

    // Add the new classroom to the list
    setUserClassrooms([newClassroomData, ...userClassrooms])

    // Close the dialog and show success toast
    setIsCreateDialogOpen(false)
    toast({
      title: "Classroom Created",
      description: `${newClassroom.name} has been created successfully.`,
      variant: "success",
    })

    // Reset form
    setNewClassroom({
      name: "",
      subject: "",
      semester: "",
      description: "",
      tags: "",
    })
  }

  // Handle joining a classroom
  const handleJoinClassroom = () => {
    // Validate join code (simple validation for demo)
    if (joinCode.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid classroom code.",
        variant: "destructive",
      })
      return
    }

    // Find a random classroom to join (for demo purposes)
    const randomIndex = Math.floor(Math.random() * classrooms.length)
    const classroomToJoin = classrooms[randomIndex]

    // Check if already joined
    if (!userClassrooms.some((c) => c.id === classroomToJoin.id)) {
      setUserClassrooms([classroomToJoin, ...userClassrooms])
    }

    // Close dialog and show success toast
    setIsJoinDialogOpen(false)
    toast({
      title: "Classroom Joined",
      description: `You have successfully joined ${classroomToJoin.name}.`,
      variant: "success",
    })

    // Reset join code
    setJoinCode("")
  }

  // Navigate to classroom detail page
  const goToClassroom = (classroomId: number) => {
    router.push(`/dashboard/classrooms/${classroomId}`)
  }

  return (
    <div className="container py-8 max-w-7xl">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-6 backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.name}! {getEmoji()}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isTeacher
                ? "Manage your classrooms and connect with your students."
                : "Access your classrooms and continue your learning journey."}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classrooms..."
                className="pl-9 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isTeacher ? (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary/90 hover:bg-primary">
                    <Plus className="h-4 w-4" />
                    <span>Create Classroom</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New Classroom</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new classroom for your students.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Classroom Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Advanced Web Development"
                        value={newClassroom.name}
                        onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="e.g., Computer Science"
                          value={newClassroom.subject}
                          onChange={(e) => setNewClassroom({ ...newClassroom, subject: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="semester">Semester/Year</Label>
                        <Input
                          id="semester"
                          placeholder="e.g., Spring 2025"
                          value={newClassroom.semester}
                          onChange={(e) => setNewClassroom({ ...newClassroom, semester: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what students will learn in this classroom..."
                        value={newClassroom.description}
                        onChange={(e) => setNewClassroom({ ...newClassroom, description: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., WebDev, JavaScript, React"
                        value={newClassroom.tags}
                        onChange={(e) => setNewClassroom({ ...newClassroom, tags: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleCreateClassroom} className="gap-2">
                      <School className="h-4 w-4" />
                      Create Classroom
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button className="gap-2 bg-primary/90 hover:bg-primary" onClick={() => setIsJoinDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>Join via Code</span>
              </Button>
            )}

            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Join a Classroom</DialogTitle>
                  <DialogDescription>Enter the classroom code provided by your teacher.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="code">Classroom Code</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <CodeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="code"
                          className="pl-9 font-mono tracking-wider"
                          placeholder="XXXX-XXXX-XXXX"
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleJoinClassroom} className="gap-2">
                    <School className="h-4 w-4" />
                    Join Classroom
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Classrooms</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredClassrooms.length > 0 ? (
            filteredClassrooms.map((classroom, index) => (
              <motion.div
                key={classroom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`overflow-hidden border h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${classroom.color}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">{classroom.name}</CardTitle>
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-background h-8 w-8">
                          <AvatarImage src={classroom.teacher.avatar} alt={classroom.teacher.name} />
                          <AvatarFallback>{classroom.teacher.initials}</AvatarFallback>
                        </Avatar>
                        {classroom.students.slice(0, 3).map((student, i) => (
                          <Avatar key={i} className="border-2 border-background h-8 w-8">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                        {classroom.members > 4 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium border-2 border-background">
                            +{classroom.members - 4}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {classroom.subject} • {classroom.semester}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {classroom.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-background/50 backdrop-blur-sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Course progress</span>
                        <span>{classroom.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-background/30 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${classroom.progress}%` }} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-background/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{classroom.members} members</span>
                      </div>
                      <Button
                        className="gap-1 relative overflow-hidden group"
                        size="sm"
                        onClick={() => goToClassroom(classroom.id)}
                      >
                        <span>Go to Classroom</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-12 text-center"
            >
              <School className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No classrooms found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {searchQuery
                  ? "Try adjusting your search query to find your classrooms."
                  : isTeacher
                    ? "Create your first classroom to get started."
                    : "Join a classroom using a code from your teacher."}
              </p>
              {isTeacher ? (
                <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  <span>Create Classroom</span>
                </Button>
              ) : (
                <Button className="gap-2" onClick={() => setIsJoinDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  <span>Join via Code</span>
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
