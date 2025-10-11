"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
  Eye,
  Clock,
  CheckCircle2,
} from "lucide-react"

// Mock data for questions
const questions = [
  {
    id: "1",
    title: "How to implement a binary search tree in Java?",
    author: {
      name: "Rahul Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RS",
      role: "Student",
      department: "Computer Science",
      semester: "6th Sem",
    },
    timeAgo: "2 hours ago",
    date: "March 25, 2025",
    tags: ["Java", "Data Structures"],
    tagColors: ["bg-green-50 text-green-700 border-green-200", "bg-blue-50 text-blue-700 border-blue-200"],
    description:
      "I'm trying to implement a binary search tree in Java for my data structures assignment. I understand the concept but I'm having trouble with the insertion method.\n\nHere's what I have so far:\n\n```java\npublic class BinarySearchTree {\n    private Node root;\n    \n    private class Node {\n        private int key;\n        private Node left, right;\n        \n        public Node(int key) {\n            this.key = key;\n            left = right = null;\n        }\n    }\n    \n    public void insert(int key) {\n        // This is where I'm stuck\n        // How do I properly implement this method?\n    }\n}\n```\n\nCan someone provide some guidance on how to properly implement the insert operation? I'm particularly confused about how to handle the recursion and maintain the BST property.",
    answers: [
      {
        id: 1,
        author: {
          name: "Dr. Priya Sharma",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "PS",
          role: "Professor",
          department: "Computer Science",
        },
        timeAgo: "1 hour ago",
        date: "March 25, 2025",
        content:
          "The insertion method for a Binary Search Tree should maintain the BST property: all nodes in the left subtree have keys less than the node's key, and all nodes in the right subtree have keys greater than the node's key.\n\nHere's how you can implement the insert method:\n\n```java\npublic void insert(int key) {\n    root = insertRec(root, key);\n}\n\nprivate Node insertRec(Node root, int key) {\n    // If the tree is empty, return a new node\n    if (root == null) {\n        root = new Node(key);\n        return root;\n    }\n    \n    // Otherwise, recur down the tree\n    if (key < root.key)\n        root.left = insertRec(root.left, key);\n    else if (key > root.key)\n        root.right = insertRec(root.right, key);\n    \n    // Return the unchanged node pointer\n    return root;\n}\n```\n\nThis recursive approach first checks if the tree is empty. If it is, it creates a new node with the given key. Otherwise, it compares the key with the current node's key and recursively inserts it into the left or right subtree accordingly.\n\nThe method returns the modified node, which allows us to update the tree structure as we return from the recursive calls.",
        isAccepted: true,
        votes: 12,
      },
      {
        id: 2,
        author: {
          name: "Ananya Patel",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "AP",
          role: "Student",
          department: "Data Science",
          semester: "4th Sem",
        },
        timeAgo: "45 minutes ago",
        date: "March 25, 2025",
        content:
          "You can also implement the insertion iteratively if you prefer to avoid recursion:\n\n```java\npublic void insertIterative(int key) {\n    Node newNode = new Node(key);\n    \n    // If tree is empty\n    if (root == null) {\n        root = newNode;\n        return;\n    }\n    \n    Node current = root;\n    Node parent = null;\n    \n    while (true) {\n        parent = current;\n        \n        // Go to left subtree\n        if (key < current.key) {\n            current = current.left;\n            \n            // Insert to the left\n            if (current == null) {\n                parent.left = newNode;\n                return;\n            }\n        }\n        // Go to right subtree\n        else {\n            current = current.right;\n            \n            // Insert to the right\n            if (current == null) {\n                parent.right = newNode;\n                return;\n            }\n        }\n    }\n}\n```\n\nThis iterative approach might be easier to understand for some people. It keeps track of the current node and its parent as it traverses the tree, then attaches the new node to the appropriate place when it finds an empty spot.",
        isAccepted: false,
        votes: 8,
      },
      {
        id: 3,
        author: {
          name: "Vikram Kumar",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "VK",
          role: "Student",
          department: "AI & ML",
          semester: "6th Sem",
        },
        timeAgo: "30 minutes ago",
        date: "March 25, 2025",
        content:
          "One thing to keep in mind is that this implementation doesn't handle duplicate keys. Depending on your requirements, you might want to either:\n\n1. Disallow duplicates entirely\n2. Allow duplicates by consistently placing them on one side (e.g., right)\n3. Add a count field to each node to track duplicates\n\nHere's a modified version that handles duplicates by placing them on the right:\n\n```java\nprivate Node insertRec(Node root, int key) {\n    if (root == null) {\n        root = new Node(key);\n        return root;\n    }\n    \n    if (key < root.key)\n        root.left = insertRec(root.left, key);\n    else // Changed from 'else if (key > root.key)' to handle duplicates\n        root.right = insertRec(root.right, key);\n    \n    return root;\n}\n```\n\nAlso, don't forget to implement other essential BST operations like search, delete, and traversal methods to complete your assignment!",
        isAccepted: false,
        votes: 5,
      },
    ],
    views: 42,
    votes: 15,
  },
  {
    id: "5",
    title: "How to implement authentication in Next.js?",
    author: {
      name: "Nabin Chapagain",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "NC",
      role: "Student",
      department: "Computer Science",
      semester: "4th Sem",
    },
    timeAgo: "3 hours ago",
    date: "March 25, 2025",
    tags: ["Next.js", "Authentication"],
    tagColors: ["bg-cyan-50 text-cyan-700 border-cyan-200", "bg-indigo-50 text-indigo-700 border-indigo-200"],
    description:
      "I'm building a Next.js application and need to implement user authentication. What's the best approach for implementing secure authentication in Next.js? Should I use JWT, NextAuth, or something else?\n\nI'm particularly interested in:\n\n1. Which authentication solution is most suitable for a production Next.js app?\n2. How to handle protected routes?\n3. Best practices for storing and managing tokens\n4. How to implement login, logout, and registration flows\n\nAny code examples or resources would be greatly appreciated!",
    answers: [],
    views: 15,
    votes: 5,
  },
]

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  // Find the question based on the ID
  const question = questions.find((q) => q.id === questionId)

  // If question not found, show error
  if (!question) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Question not found</h1>
        <p className="text-muted-foreground mb-6">The question you're looking for doesn't exist.</p>
        <Link href="/dashboard/questions">
          <Button>Return to Questions</Button>
        </Link>
      </div>
    )
  }

  const [answerContent, setAnswerContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [bookmarked, setBookmarked] = useState(false)

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send the answer to the server
      // and update the UI with the new answer
      setAnswerContent("")
      setIsSubmitting(false)

      // Show success message or update UI
      alert("Your answer has been submitted successfully!")
    }, 1000)
  }

  // Handle voting
  const handleVote = (type: "up" | "down") => {
    setUserVote(userVote === type ? null : type)
  }

  // Handle bookmark
  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

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
            <Link href="/dashboard/questions" className="text-sm font-medium text-primary">
              Questions
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
              Leaderboard
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
          <Link
            href="/dashboard/questions"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Questions
          </Link>

          <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <span className="text-lg">✨</span>
              <span>
                <strong>Sample Question:</strong> This is demonstration data. Real questions and answers from our community will replace these examples soon!
              </span>
            </p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className={question.tagColors[index]}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-2xl font-bold">{question.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Asked {question.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{question.views} views</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${userVote === "up" ? "bg-green-100 text-green-700" : ""}`}
                      onClick={() => handleVote("up")}
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                    <span className="font-medium">{question.votes}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${userVote === "down" ? "bg-red-100 text-red-700" : ""}`}
                      onClick={() => handleVote("down")}
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full mt-2 ${bookmarked ? "bg-amber-100 text-amber-700" : ""}`}
                      onClick={handleBookmark}
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {question.description.split("\n").map((paragraph, index) => {
                        if (paragraph.startsWith("```") && paragraph.endsWith("```")) {
                          // Code block
                          const code = paragraph.slice(3, -3)
                          return (
                            <pre key={index} className="bg-muted p-3 rounded-md overflow-x-auto">
                              <code className="text-xs font-mono">{code}</code>
                            </pre>
                          )
                        } else if (paragraph.startsWith("```")) {
                          // Start of multi-line code block
                          const language = paragraph.slice(3)
                          return (
                            <div key={index} className="bg-muted p-3 rounded-md overflow-x-auto">
                              <div className="text-xs text-muted-foreground mb-2">{language}</div>
                            </div>
                          )
                        } else if (paragraph.endsWith("```")) {
                          // End of multi-line code block
                          const code = paragraph.slice(0, -3)
                          return (
                            <pre key={index} className="bg-muted p-3 rounded-md overflow-x-auto">
                              <code className="text-xs font-mono">{code}</code>
                            </pre>
                          )
                        } else {
                          // Regular paragraph
                          return <p key={index}>{paragraph}</p>
                        }
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={question.author.avatar} alt={question.author.name} />
                          <AvatarFallback>{question.author.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{question.author.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {question.author.role === "Student"
                              ? `${question.author.department}, ${question.author.semester}`
                              : question.author.department}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{question.date}</div>
                    </div>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Tabs defaultValue="votes">
                  <TabsList>
                    <TabsTrigger value="votes">Votes</TabsTrigger>
                    <TabsTrigger value="newest">Newest</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {question.answers.length > 0 ? (
              <div className="space-y-6">
                {question.answers.map((answer) => (
                  <Card
                    key={answer.id}
                    className={`border-primary/10 ${answer.isAccepted ? "bg-green-50/30 dark:bg-green-950/10" : ""}`}
                  >
                    <CardContent className="pt-6 pb-3">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <ThumbsUp className="h-5 w-5" />
                          </Button>
                          <span className="font-medium">{answer.votes}</span>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <ThumbsDown className="h-5 w-5" />
                          </Button>
                          {answer.isAccepted && (
                            <div className="mt-2 flex flex-col items-center">
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Accepted</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            {answer.content.split("\n").map((paragraph, index) => {
                              if (paragraph.startsWith("```") && paragraph.endsWith("```")) {
                                // Code block
                                const code = paragraph.slice(3, -3)
                                return (
                                  <pre key={index} className="bg-muted p-3 rounded-md overflow-x-auto">
                                    <code className="text-xs font-mono">{code}</code>
                                  </pre>
                                )
                              } else if (paragraph.startsWith("```")) {
                                // Start of multi-line code block
                                const language = paragraph.slice(3)
                                return (
                                  <div key={index} className="bg-muted p-3 rounded-md overflow-x-auto">
                                    <div className="text-xs text-muted-foreground mb-2">{language}</div>
                                  </div>
                                )
                              } else if (paragraph.endsWith("```")) {
                                // End of multi-line code block
                                const code = paragraph.slice(0, -3)
                                return (
                                  <pre key={index} className="bg-muted p-3 rounded-md overflow-x-auto">
                                    <code className="text-xs font-mono">{code}</code>
                                  </pre>
                                )
                              } else {
                                // Regular paragraph
                                return <p key={index}>{paragraph}</p>
                              }
                            })}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                                <AvatarFallback>{answer.author.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{answer.author.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {answer.author.role === "Student"
                                    ? `${answer.author.department}, ${answer.author.semester}`
                                    : answer.author.department}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">{answer.date}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-primary/10">
                <CardContent className="py-6 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to answer this question!</p>
                </CardContent>
              </Card>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <h2 className="text-xl font-bold">Your Answer</h2>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your answer here... You can use markdown for formatting."
                  className="min-h-[200px]"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                />
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>Markdown supported</span>
                </div>
                <Button className="gap-1" onClick={handleSubmitAnswer} disabled={isSubmitting || !answerContent.trim()}>
                  {isSubmitting ? "Submitting..." : "Post Answer"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
