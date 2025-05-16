"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  MessageSquare,
  Eye,
  CheckCircle2,
  HelpCircle,
  Award,
  Star,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for demo questions
const demoQuestions = [
  {
    id: "1",
    title: "How to implement a binary search tree in Java?",
    content:
      "I'm trying to implement a binary search tree in Java for my data structures assignment. I understand the concept but I'm having trouble with the insertion method. Can someone explain the recursive approach?",
    tags: ["Java", "Data Structures", "Algorithms"],
    tagColors: [
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900",
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
    ],
    upvotes: 15,
    answers: 3,
    views: 42,
    author: {
      name: "Rahul Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RS",
      points: 875,
      department: "Computer Science",
      semester: "6th Sem",
    },
    timeAgo: "2 hours ago",
    bestAnswer: {
      id: "a1",
      content:
        "The insertion method for a Binary Search Tree should maintain the BST property: all nodes in the left subtree have keys less than the node's key, and all nodes in the right subtree have keys greater than the node's key.\n\nHere's how you can implement the insert method:\n\n```java\npublic void insert(int key) {\n    root = insertRec(root, key);\n}\n\nprivate Node insertRec(Node root, int key) {\n    // If the tree is empty, return a new node\n    if (root == null) {\n        root = new Node(key);\n        return root;\n    }\n    \n    // Otherwise, recur down the tree\n    if (key < root.key)\n        root.left = insertRec(root.left, key);\n    else if (key > root.key)\n        root.right = insertRec(root.right, key);\n    \n    // Return the unchanged node pointer\n    return root;\n}\n```\n\nThis recursive approach first checks if the tree is empty. If it is, it creates a new node with the given key. Otherwise, it compares the key with the current node's key and recursively inserts it into the left or right subtree accordingly.",
      author: {
        name: "Dr. Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "PS",
        points: 3240,
        role: "Professor",
        department: "Computer Science",
      },
      upvotes: 12,
      isAccepted: true,
      timeAgo: "1 hour ago",
      pointsEarned: 25, // 10 for answer + 15 for accepted answer
    },
    pointsAllocated: {
      question: 5,
      answer: 10,
      acceptedAnswer: 15,
      upvote: 2,
    },
  },
  {
    id: "2",
    title: "Trouble with React useEffect dependencies",
    content:
      "I'm getting an infinite loop in my React component when using useEffect. I think it's related to the dependency array, but I'm not sure how to fix it. Here's my code snippet:\n\n```jsx\nuseEffect(() => {\n  fetchData();\n}, [data]);\n```\n\nThe fetchData function updates the data state. How can I prevent this loop?",
    tags: ["React", "JavaScript", "Hooks"],
    tagColors: [
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900",
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900",
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
    ],
    upvotes: 23,
    answers: 8,
    views: 76,
    author: {
      name: "Ananya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AP",
      points: 980,
      department: "Data Science",
      semester: "4th Sem",
    },
    timeAgo: "5 hours ago",
    bestAnswer: {
      id: "a2",
      content:
        "You're experiencing an infinite loop because your effect depends on `data`, but the effect also (indirectly) updates `data` through the `fetchData` function. When `data` changes, the effect runs again, which updates `data` again, and so on.\n\nTo fix this, you have a few options:\n\n1. Move the dependency outside the component or use useRef:\n\n```jsx\nconst dataFetchedRef = useRef(false);\n\nuseEffect(() => {\n  if (dataFetchedRef.current) return;\n  dataFetchedRef.current = true;\n  fetchData();\n}, []);\n```\n\n2. Use a different dependency that doesn't change when fetchData is called:\n\n```jsx\nuseEffect(() => {\n  fetchData();\n}, [shouldFetch]); // Only re-run when shouldFetch changes\n```\n\n3. If you need to fetch when data changes, make sure fetchData doesn't update the same data state:\n\n```jsx\nuseEffect(() => {\n  // Make sure this doesn't update 'data' state\n  fetchAdditionalData(data);\n}, [data]);\n```\n\nThe key is to break the circular dependency between your effect and the state it updates.",
      author: {
        name: "Vikram Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "VK",
        points: 1450,
        department: "AI & ML",
        semester: "6th Sem",
      },
      upvotes: 18,
      isAccepted: true,
      timeAgo: "3 hours ago",
      pointsEarned: 25, // 10 for answer + 15 for accepted answer
    },
    pointsAllocated: {
      question: 5,
      answer: 10,
      acceptedAnswer: 15,
      upvote: 2,
    },
  },
  {
    id: "3",
    title: "Python recursion for Fibonacci sequence optimization",
    content:
      "I'm implementing a recursive function to generate Fibonacci numbers in Python, but it's very slow for larger inputs. Is there a way to optimize this with memoization or dynamic programming?",
    tags: ["Python", "Recursion", "Algorithms"],
    tagColors: [
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
    ],
    upvotes: 19,
    answers: 5,
    views: 64,
    author: {
      name: "Vikram Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "VK",
      points: 720,
      department: "AI & ML",
      semester: "6th Sem",
    },
    timeAgo: "1 day ago",
    bestAnswer: {
      id: "a3",
      content:
        "The standard recursive Fibonacci implementation has exponential time complexity O(2^n), which is why it's slow for larger inputs. Here are two optimized approaches:\n\n1. **Memoization (Top-Down Dynamic Programming)**:\n\n```python\ndef fibonacci(n, memo={}):  # Using a dictionary for memoization\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n    return memo[n]\n```\n\n2. **Tabulation (Bottom-Up Dynamic Programming)**:\n\n```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    \n    # Initialize array to store Fibonacci numbers\n    fib = [0] * (n + 1)\n    fib[1] = 1\n    \n    # Fill the array bottom-up\n    for i in range(2, n + 1):\n        fib[i] = fib[i-1] + fib[i-2]\n    \n    return fib[n]\n```\n\nBoth approaches reduce the time complexity to O(n), but the bottom-up approach is slightly more efficient in terms of space complexity since it doesn't use recursion stack space.",
      author: {
        name: "Sanjay Mehta",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SM",
        points: 685,
        department: "Web Development",
        semester: "4th Sem",
      },
      upvotes: 14,
      isAccepted: true,
      timeAgo: "12 hours ago",
      pointsEarned: 25, // 10 for answer + 15 for accepted answer
    },
    pointsAllocated: {
      question: 5,
      answer: 10,
      acceptedAnswer: 15,
      upvote: 2,
    },
  },
  {
    id: "4",
    title: "What's the difference between == and === in JavaScript?",
    content:
      "I'm confused about when to use == versus === in JavaScript. What's the difference between them and when should I use each one?",
    tags: ["JavaScript", "Web Development"],
    tagColors: [
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900",
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900",
    ],
    upvotes: 42,
    answers: 12,
    views: 156,
    author: {
      name: "Sanjay Mehta",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
      points: 685,
      department: "Web Development",
      semester: "4th Sem",
    },
    timeAgo: "1 week ago",
    bestAnswer: {
      id: "a4",
      content:
        "The difference between `==` and `===` in JavaScript is about type coercion:\n\n**`==` (Double Equals / Loose Equality)**\n- Performs type coercion before comparison\n- Converts operands to the same type, then compares\n- Example: `'5' == 5` returns `true` because the string '5' is converted to the number 5\n\n**`===` (Triple Equals / Strict Equality)**\n- Does NOT perform type coercion\n- Returns true only if both value AND type are the same\n- Example: `'5' === 5` returns `false` because the types are different\n\n**When to use each:**\n\n- Use `===` (strict equality) most of the time for predictable, safer comparisons\n- Only use `==` when you specifically want type coercion\n\n**Examples:**\n```javascript\n// Loose equality (==) examples\n0 == ''      // true (both coerce to 0)\n0 == '0'     // true\nnull == undefined  // true\n\n// Strict equality (===) examples\n0 === ''     // false (different types)\n0 === '0'    // false\nnull === undefined  // false\n```\n\nMost style guides and linters recommend using `===` by default to avoid unexpected behavior from type coercion.",
      author: {
        name: "Ananya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AP",
        points: 980,
        department: "Data Science",
        semester: "4th Sem",
      },
      upvotes: 38,
      isAccepted: true,
      timeAgo: "6 days ago",
      pointsEarned: 25, // 10 for answer + 15 for accepted answer
    },
    pointsAllocated: {
      question: 5,
      answer: 10,
      acceptedAnswer: 15,
      upvote: 2,
    },
  },
  {
    id: "5",
    title: "How to implement authentication in Next.js?",
    content:
      "I'm building a Next.js application and need to implement user authentication. What's the best approach for implementing secure authentication in Next.js? Should I use JWT, NextAuth, or something else?",
    tags: ["Next.js", "Authentication", "Web Development"],
    tagColors: [
      "bg-black/10 text-black/70 border-black/20 dark:bg-white/10 dark:text-white/70 dark:border-white/20",
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900",
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900",
    ],
    upvotes: 31,
    answers: 7,
    views: 98,
    author: {
      name: "Nabin Chapagain",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "NC",
      points: 875,
      department: "Computer Science",
      semester: "4th Sem",
    },
    timeAgo: "3 days ago",
    bestAnswer: {
      id: "a5",
      content:
        "For implementing authentication in Next.js, I recommend using NextAuth.js (now Auth.js). It's specifically designed for Next.js and provides several benefits:\n\n**Why NextAuth.js:**\n- Built-in support for many OAuth providers (Google, GitHub, etc.)\n- Easy session management\n- JWT and database session support\n- Secure by default\n- Works well with both client and server components\n\n**Basic Implementation:**\n\n1. Install the package:\n```bash\nnpm install next-auth\n```\n\n2. Create an API route at `app/api/auth/[...nextauth]/route.ts`:\n```typescript\nimport NextAuth from 'next-auth';\nimport CredentialsProvider from 'next-auth/providers/credentials';\n\nconst handler = NextAuth({\n  providers: [\n    CredentialsProvider({\n      name: 'Credentials',\n      credentials: {\n        email: { label: \"Email\", type: \"email\" },\n        password: { label: \"Password\", type: \"password\" }\n      },\n      async authorize(credentials) {\n        // Add your authentication logic here\n        // Return user object if valid, null if invalid\n        const user = { id: '1', name: 'User', email: credentials?.email }\n        return user\n      }\n    }),\n    // Add other providers as needed (Google, GitHub, etc.)\n  ],\n  // Configure session, callbacks, etc.\n});\n\nexport { handler as GET, handler as POST };\n```\n\n3. Create a client-side provider in your layout:\n```tsx\n'use client';\n\nimport { SessionProvider } from 'next-auth/react';\n\nexport function AuthProvider({ children }) {\n  return <SessionProvider>{children}</SessionProvider>;\n}\n```\n\n4. Use the session in your components:\n```tsx\n'use client';\n\nimport { useSession, signIn, signOut } from 'next-auth/react';\n\nexport default function Component() {\n  const { data: session } = useSession();\n  \n  if (session) {\n    return (\n      <>\n        Signed in as {session.user.email}\n        <button onClick={() => signOut()}>Sign out</button>\n      </>\n    );\n  }\n  return (\n    <>\n      Not signed in\n      <button onClick={() => signIn()}>Sign in</button>\n    </>\n  );\n}\n```\n\nFor protected routes, you can create middleware or use server components to check authentication status.",
      author: {
        name: "Rahul Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "RS",
        points: 1245,
        department: "Computer Science",
        semester: "6th Sem",
      },
      upvotes: 27,
      isAccepted: true,
      timeAgo: "2 days ago",
      pointsEarned: 25, // 10 for answer + 15 for accepted answer
    },
    pointsAllocated: {
      question: 5,
      answer: 10,
      acceptedAnswer: 15,
      upvote: 2,
    },
  },
];

export function DemoQuestions() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {demoQuestions.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            scale: 1.01,
            transition: { duration: 0.2 },
          }}
          onHoverStart={() => setHoveredCard(question.id)}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card
            className={`border-primary/10 overflow-hidden transition-shadow duration-200 ${
              hoveredCard === question.id
                ? "shadow-md dark:shadow-primary/5"
                : ""
            } cosmic-card`}
          >
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                {question.tags.map((tag, i) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={question.tagColors[i]}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                {question.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {question.content.split("\n")[0]}
              </p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t">
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={question.author.avatar || "/placeholder.svg"}
                              alt={question.author.name}
                            />
                            <AvatarFallback>
                              {question.author.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium">
                              {question.author.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-500" />
                              <span className="text-xs text-muted-foreground">
                                {question.author.points} points
                              </span>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <div className="text-xs">
                          <p className="font-medium">{question.author.name}</p>
                          <p>
                            {question.author.department},{" "}
                            {question.author.semester}
                          </p>
                          <p className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-amber-500" />
                            <span>
                              {question.author.points} reputation points
                            </span>
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="text-xs text-muted-foreground">
                    {question.timeAgo}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {question.upvotes}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">
                          Upvotes: Each upvote earns the author{" "}
                          {question.pointsAllocated.upvote} points
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {Array.isArray(question.answers)
                            ? question.answers.length
                            : 0}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">
                          Answers:{" "}
                          {Array.isArray(question.answers)
                            ? question.answers.length
                            : 0}{" "}
                          responses to this question
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {question.views}
                  </span>
                </div>
              </div>
            </CardContent>

            <div className="px-5 py-3 bg-muted/30 border-t flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">
                        Question Points: {question.pointsAllocated.question}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="text-xs space-y-1">
                      <p>Point Allocation System:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>
                          Asking a question: {question.pointsAllocated.question}{" "}
                          points
                        </li>
                        <li>
                          Posting an answer: {question.pointsAllocated.answer}{" "}
                          points
                        </li>
                        <li>
                          Getting answer accepted:{" "}
                          {question.pointsAllocated.acceptedAnswer} points
                        </li>
                        <li>
                          Receiving an upvote: {question.pointsAllocated.upvote}{" "}
                          points
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => toggleExpand(question.id)}
              >
                {expandedQuestion === question.id
                  ? "Hide Answer"
                  : "Show Best Answer"}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>

            {expandedQuestion === question.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            question.bestAnswer.author.avatar ||
                            "/placeholder.svg"
                          }
                          alt={question.bestAnswer.author.name}
                        />
                        <AvatarFallback>
                          {question.bestAnswer.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {question.bestAnswer.author.name}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-amber-500" />
                                  <span className="text-xs text-muted-foreground">
                                    {question.bestAnswer.author.points}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p className="text-xs">
                                  {question.bestAnswer.author.points} reputation
                                  points
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {question.bestAnswer.author.role
                            ? question.bestAnswer.author.role +
                              ", " +
                              question.bestAnswer.author.department
                            : question.bestAnswer.author.department +
                              ", " +
                              question.bestAnswer.author.semester}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {question.bestAnswer.timeAgo}
                      </span>
                      {question.bestAnswer.isAccepted && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">
                                  Accepted
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">
                                This answer was accepted by the question author.
                                <br />
                                Earned {
                                  question.pointsAllocated.acceptedAnswer
                                }{" "}
                                additional points.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none dark:prose-invert mb-4">
                    {question.bestAnswer.content
                      .split("\n")
                      .map((paragraph, idx) => {
                        if (
                          paragraph.startsWith("```") &&
                          paragraph.endsWith("```")
                        ) {
                          // Code block
                          const code = paragraph.slice(3, -3);
                          return (
                            <pre
                              key={idx}
                              className="bg-muted p-3 rounded-md overflow-x-auto"
                            >
                              <code className="text-xs font-mono">{code}</code>
                            </pre>
                          );
                        } else if (paragraph.startsWith("```")) {
                          // Start of multi-line code block
                          const language = paragraph.slice(3);
                          return (
                            <div
                              key={idx}
                              className="bg-muted p-3 rounded-md overflow-x-auto"
                            >
                              <div className="text-xs text-muted-foreground mb-2">
                                {language}
                              </div>
                            </div>
                          );
                        } else if (paragraph.endsWith("```")) {
                          // End of multi-line code block
                          const code = paragraph.slice(0, -3);
                          return (
                            <pre
                              key={idx}
                              className="bg-muted p-3 rounded-md overflow-x-auto"
                            >
                              <code className="text-xs font-mono">{code}</code>
                            </pre>
                          );
                        } else {
                          // Regular paragraph
                          return <p key={idx}>{paragraph}</p>;
                        }
                      })}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5">
                              <ThumbsUp className="h-4 w-4 text-primary" />
                              <span className="text-sm">
                                {question.bestAnswer.upvotes}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">
                              {question.bestAnswer.upvotes} upvotes ×{" "}
                              {question.pointsAllocated.upvote} points ={" "}
                              {question.bestAnswer.upvotes *
                                question.pointsAllocated.upvote}{" "}
                              points earned
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span>
                              Points earned: {question.bestAnswer.pointsEarned}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <div className="text-xs space-y-1">
                            <p>Points breakdown:</p>
                            <ul className="list-disc pl-4 space-y-0.5">
                              <li>
                                Base answer: {question.pointsAllocated.answer}{" "}
                                points
                              </li>
                              <li>
                                Accepted answer:{" "}
                                {question.pointsAllocated.acceptedAnswer} points
                              </li>
                              <li>
                                Upvotes: {question.bestAnswer.upvotes} ×{" "}
                                {question.pointsAllocated.upvote} ={" "}
                                {question.bestAnswer.upvotes *
                                  question.pointsAllocated.upvote}{" "}
                                points
                              </li>
                              <li>
                                Total:{" "}
                                {question.bestAnswer.pointsEarned +
                                  question.bestAnswer.upvotes *
                                    question.pointsAllocated.upvote}{" "}
                                points
                              </li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
