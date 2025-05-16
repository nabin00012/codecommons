"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  ChevronDown,
  ChevronUp,
  Award,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

// Demo questions data with answers
const demoQuestions = [
  {
    id: "1",
    title: "How to implement a Binary Search Tree in Java?",
    content:
      "I'm working on implementing a Binary Search Tree in Java for my data structures assignment. I understand the concept, but I'm having trouble with the insert operation. Can someone provide guidance on how to properly implement the insert method to maintain the BST property?",
    tags: ["Java", "Data Structures", "Algorithms"],
    tagColors: [
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900",
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900",
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
    ],
    upvotes: 28,
    answers: 3,
    views: 94,
    author: {
      name: "Rahul Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RS",
      role: "Student",
      department: "Computer Science",
      points: 145,
    },
    timeAgo: "2 days ago",
    bestAnswer: {
      id: 1,
      content:
        "The insertion method for a Binary Search Tree should maintain the BST property: all nodes in the left subtree have keys less than the node's key, and all nodes in the right subtree have keys greater than the node's key.\n\nHere's how you can implement the insert method:\n\n```java\npublic void insert(int key) {\n    root = insertRec(root, key);\n}\n\nprivate Node insertRec(Node root, int key) {\n    // If the tree is empty, return a new node\n    if (root == null) {\n        root = new Node(key);\n        return root;\n    }\n    \n    // Otherwise, recur down the tree\n    if (key < root.key)\n        root.left = insertRec(root.left, key);\n    else if (key > root.key)\n        root.right = insertRec(root.right, key);\n    \n    // Return the unchanged node pointer\n    return root;\n}\n```",
      author: {
        name: "Dr. Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "PS",
        role: "Professor",
        department: "Computer Science",
        points: 1250,
      },
      timeAgo: "1 day ago",
      isAccepted: true,
      upvotes: 15,
      pointsEarned: 25, // Points earned for accepted answer
    },
  },
  {
    id: "2",
    title: "React useEffect causing infinite loop with state updates",
    content:
      "I'm having an issue with my React component where useEffect is causing an infinite loop. I'm fetching data from an API and updating the state, but it seems to be re-rendering continuously. Here's my code snippet:\n\n```jsx\nuseEffect(() => {\n  const fetchData = async () => {\n    const response = await api.getData();\n    setData(response.data);\n  };\n  fetchData();\n}, []);\n```\n\nThe fetchData function updates the data state. How can I prevent this loop?",
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
      role: "Student",
      department: "Computer Science",
      points: 230,
    },
    timeAgo: "5 hours ago",
    bestAnswer: {
      id: 1,
      content:
        "The issue is likely that you're missing the dependency array in your useEffect hook or you have a dependency that's changing on every render.\n\nYour code looks correct with the empty dependency array `[]`, which should make the effect run only once when the component mounts. However, if `api.getData()` depends on some state or props that you're not including in the dependency array, that could cause issues.\n\nHere are some things to check:\n\n1. Make sure your API call isn't changing any state outside of the effect\n2. Check if `api` itself is being recreated on each render\n3. Verify that `response.data` isn't causing unnecessary re-renders\n\nIf you're still having issues, you could try using a ref to track if the effect has already run:\n\n```jsx\nconst isMounted = useRef(false);\n\nuseEffect(() => {\n  if (!isMounted.current) {\n    const fetchData = async () => {\n      const response = await api.getData();\n      setData(response.data);\n    };\n    fetchData();\n    isMounted.current = true;\n  }\n}, []);\n```",
      author: {
        name: "Vikram Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "VK",
        role: "Student",
        department: "Computer Science",
        points: 520,
      },
      timeAgo: "3 hours ago",
      isAccepted: true,
      upvotes: 18,
      pointsEarned: 25, // Points earned for accepted answer
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
      role: "Student",
      department: "Computer Science",
      points: 520,
    },
    timeAgo: "1 day ago",
    bestAnswer: {
      id: 1,
      content:
        "The naive recursive implementation of Fibonacci has exponential time complexity O(2^n), which makes it extremely slow for larger inputs. You can optimize it using memoization (top-down) or dynamic programming (bottom-up).\n\nHere's a memoized version using a dictionary to cache results:\n\n```python\ndef fibonacci_memoized(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci_memoized(n-1, memo) + fibonacci_memoized(n-2, memo)\n    return memo[n]\n```\n\nAnd here's a dynamic programming approach with O(n) time complexity:\n\n```python\ndef fibonacci_dp(n):\n    if n <= 1:\n        return n\n    fib = [0] * (n + 1)\n    fib[1] = 1\n    for i in range(2, n + 1):\n        fib[i] = fib[i-1] + fib[i-2]\n    return fib[n]\n```\n\nFor even better space efficiency, you can use just two variables:\n\n```python\ndef fibonacci_optimized(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n```\n\nThis last version has O(n) time complexity and O(1) space complexity.",
      author: {
        name: "Dr. Anil Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AK",
        role: "Professor",
        department: "Computer Science",
        points: 1850,
      },
      timeAgo: "20 hours ago",
      isAccepted: true,
      upvotes: 22,
      pointsEarned: 25, // Points earned for accepted answer
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
      role: "Student",
      department: "Computer Science",
      points: 78,
    },
    timeAgo: "1 week ago",
    bestAnswer: {
      id: 1,
      content:
        "In JavaScript, `==` and `===` are comparison operators, but they work differently:\n\n**`==` (Equality Operator)**\n- Compares values after converting them to a common type\n- Performs type coercion\n- For example, `1 == '1'` returns `true` because the string '1' is converted to a number\n\n**`===` (Strict Equality Operator)**\n- Compares both value and type without conversion\n- No type coercion\n- For example, `1 === '1'` returns `false` because they are different types\n\n**When to use each:**\n\n- Use `===` (strict equality) most of the time for more predictable code and to avoid unexpected type coercion bugs\n- Only use `==` when you specifically want type coercion, which is rare in modern JavaScript\n\nHere are some examples that demonstrate the difference:\n\n```javascript\n// == (Equality with type coercion)\n0 == false      // true, because false is coerced to 0\n0 == ''         // true, because '' is coerced to 0\nnull == undefined // true\n\n// === (Strict equality, no type coercion)\n0 === false     // false, different types\n0 === ''        // false, different types\nnull === undefined // false, different types\n```\n\nMost style guides and best practices recommend using `===` by default.",
      author: {
        name: "Neha Gupta",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "NG",
        role: "Teaching Assistant",
        department: "Computer Science",
        points: 950,
      },
      timeAgo: "6 days ago",
      isAccepted: true,
      upvotes: 38,
      pointsEarned: 25, // Points earned for accepted answer
    },
  },
  {
    id: "5",
    title: "How to implement authentication in Next.js?",
    content:
      "I'm building a Next.js application and need to implement user authentication. What's the best approach for implementing secure authentication in Next.js? Should I use JWT, NextAuth, or something else?",
    tags: ["Next.js", "Authentication"],
    tagColors: [
      "bg-black/10 text-black/70 border-black/20 dark:bg-white/10 dark:text-white/70 dark:border-white/20",
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900",
    ],
    upvotes: 31,
    answers: 7,
    views: 98,
    author: {
      name: "Nabin Chapagain",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "NC",
      role: "Student",
      department: "Computer Science",
      points: 185,
    },
    timeAgo: "3 days ago",
    bestAnswer: {
      id: 1,
      content:
        "For implementing authentication in Next.js, I recommend using NextAuth.js (now Auth.js). It's specifically designed for Next.js and provides several benefits:\n\n**Benefits of NextAuth.js:**\n- Built-in support for many authentication providers (Google, GitHub, etc.)\n- Easy to set up and maintain\n- Handles sessions, JWT, and CSRF protection\n- Works well with both the Pages Router and App Router\n\n**Basic implementation steps:**\n\n1. Install the package:\n```bash\nnpm install next-auth\n```\n\n2. Create an API route for authentication (with Pages Router):\n```javascript\n// pages/api/auth/[...nextauth].js\nimport NextAuth from 'next-auth'\nimport Providers from 'next-auth/providers'\n\nexport default NextAuth({\n  providers: [\n    // Choose your providers\n    Providers.GitHub({\n      clientId: process.env.GITHUB_ID,\n      clientSecret: process.env.GITHUB_SECRET\n    }),\n    // Add email/password provider\n    Providers.Credentials({\n      // Configuration for credentials\n    })\n  ],\n  // Additional configuration\n  session: {\n    jwt: true,\n  },\n  callbacks: {\n    // Custom callbacks\n  }\n})\n```\n\n3. Set up the provider in your app:\n```javascript\n// _app.js or layout.js (App Router)\nimport { SessionProvider } from 'next-auth/react'\n\nexport default function App({ Component, pageProps }) {\n  return (\n    <SessionProvider session={pageProps.session}>\n      <Component {...pageProps} />\n    </SessionProvider>\n  )\n}\n```\n\n4. Use authentication in your components:\n```javascript\nimport { useSession, signIn, signOut } from 'next-auth/react'\n\nexport default function Component() {\n  const { data: session } = useSession()\n  \n  if (session) {\n    return (\n      <>\n        Signed in as {session.user.email}\n        <button onClick={() => signOut()}>Sign out</button>\n      </>\n    )\n  }\n  return (\n    <>\n      Not signed in\n      <button onClick={() => signIn()}>Sign in</button>\n    </>\n  )\n}\n```\n\nFor protected routes, you can use middleware or check the session in your page components.\n\nAlternatives include:\n- Clerk.dev (more features but paid)\n- Supabase Auth (if you're using Supabase)\n- Firebase Authentication\n- Custom JWT implementation with jose or jsonwebtoken\n\nBut for most Next.js applications, NextAuth.js provides the best balance of features, security, and ease of implementation.",
      author: {
        name: "Arjun Reddy",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AR",
        role: "Senior Developer",
        department: "Computer Science",
        points: 1450,
      },
      timeAgo: "2 days ago",
      isAccepted: true,
      upvotes: 29,
      pointsEarned: 25, // Points earned for accepted answer
    },
  },
];

export function EnhancedDemoQuestions() {
  return (
    <div className="space-y-6">
      {demoQuestions.map((question) => (
        <Card key={question.id} className="overflow-hidden">
          <CardContent className="p-6">
            {/* Question header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {question.tags.map((tag, index) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={question.tagColors[index]}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {Array.isArray(question.answers)
                          ? question.answers.length
                          : 0}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of answers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {question.views}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of views</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Question content */}
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="whitespace-pre-wrap">{question.content}</p>
            </div>

            {/* Question footer */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={question.author.avatar}
                      alt={question.author.name}
                    />
                    <AvatarFallback>{question.author.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-foreground">
                      {question.author.name}
                    </span>
                    <span className="ml-1">• {question.author.role}</span>
                  </div>
                </div>
                <span>• {question.timeAgo}</span>
              </div>
            </div>
          </CardContent>

          {/* All Answers Section */}
          <CardFooter className="bg-muted/50 p-6 border-t">
            <div className="w-full space-y-6">
              {/* Best Answer */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Best Answer</span>
                  <Badge variant="secondary" className="ml-2">
                    +{question.bestAnswer.pointsEarned} points
                  </Badge>
                </div>
                <div className="prose dark:prose-invert max-w-none mb-4">
                  <p className="whitespace-pre-wrap">
                    {question.bestAnswer.content}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={question.bestAnswer.author.avatar}
                        alt={question.bestAnswer.author.name}
                      />
                      <AvatarFallback>
                        {question.bestAnswer.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-foreground">
                        {question.bestAnswer.author.name}
                      </span>
                      <span className="ml-1">
                        • {question.bestAnswer.author.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{question.bestAnswer.timeAgo}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {question.bestAnswer.upvotes}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Answers */}
              {Array.isArray(question.answers) &&
                question.answers.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Other Answers</h4>
                    {question.answers.map((answer, index) => (
                      <div
                        key={index}
                        className="bg-background p-4 rounded-lg border"
                      >
                        <div className="prose dark:prose-invert max-w-none mb-4">
                          <p className="whitespace-pre-wrap">{answer.answer}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={answer.user.avatar}
                                alt={answer.user.name}
                              />
                              <AvatarFallback>
                                {answer.user.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium text-foreground">
                                {answer.user.name}
                              </span>
                              <span className="ml-1">• {answer.user.role}</span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(answer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
