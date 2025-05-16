"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Code,
  Search,
  Filter,
  ArrowRight,
  Plus,
  MessageSquare,
  Eye,
} from "lucide-react";

// Mock data for questions
const initialQuestions = [
  {
    id: 1,
    title: "How to implement a binary search tree in Java?",
    author: {
      name: "Rahul Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RS",
    },
    timeAgo: "2 hours ago",
    tags: ["Java", "Data Structures"],
    tagColors: [
      "bg-green-50 text-green-700 border-green-200",
      "bg-blue-50 text-blue-700 border-blue-200",
    ],
    description:
      "I'm trying to implement a binary search tree in Java for my data structures assignment. I understand the concept but I'm having trouble with the insertion method. Can someone provide some guidance on how to properly implement the insert operation?",
    answers: 3,
    views: 12,
  },
  {
    id: 2,
    title: "Trouble with React useEffect dependencies",
    author: {
      name: "Ananya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AP",
    },
    timeAgo: "5 hours ago",
    tags: ["React", "JavaScript"],
    tagColors: [
      "bg-cyan-50 text-cyan-700 border-cyan-200",
      "bg-yellow-50 text-yellow-700 border-yellow-200",
    ],
    description:
      "I'm getting an infinite loop in my React component when using useEffect. I think it's related to the dependency array, but I'm not sure how to fix it. My component keeps re-rendering.",
    answers: 1,
    views: 8,
  },
  {
    id: 3,
    title: "Python recursion for Fibonacci sequence",
    author: {
      name: "Vikram Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "VK",
    },
    timeAgo: "1 day ago",
    tags: ["Python", "Recursion"],
    tagColors: [
      "bg-blue-50 text-blue-700 border-blue-200",
      "bg-purple-50 text-purple-700 border-purple-200",
    ],
    description:
      "I'm implementing a recursive function to generate Fibonacci numbers in Python, but it's very slow for larger inputs. Is there a way to optimize this without changing to an iterative approach?",
    answers: 5,
    views: 24,
  },
  {
    id: 4,
    title: "What's the difference between == and === in JavaScript?",
    author: {
      name: "Sanjay Mehta",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    timeAgo: "1 week ago",
    tags: ["JavaScript"],
    tagColors: ["bg-yellow-50 text-yellow-700 border-yellow-200"],
    description:
      "I'm confused about when to use == versus === in JavaScript. What's the difference between them?",
    answers: 12,
    views: 156,
  },
  {
    id: 5,
    title: "How to implement authentication in Next.js?",
    author: {
      name: "Nabin Chapagain",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "NC",
    },
    timeAgo: "3 hours ago",
    tags: ["Next.js", "Authentication"],
    tagColors: [
      "bg-cyan-50 text-cyan-700 border-cyan-200",
      "bg-indigo-50 text-indigo-700 border-indigo-200",
    ],
    description:
      "I'm building a Next.js application and need to implement user authentication. What's the best approach for implementing secure authentication in Next.js? Should I use JWT, NextAuth, or something else?",
    answers: 0,
    views: 5,
  },
];

// Additional questions for load more functionality
const additionalQuestions = [
  {
    id: 6,
    title: "Best practices for CSS Grid layouts",
    author: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "PS",
    },
    timeAgo: "2 days ago",
    tags: ["CSS", "Web Design"],
    tagColors: [
      "bg-pink-50 text-pink-700 border-pink-200",
      "bg-purple-50 text-purple-700 border-purple-200",
    ],
    description:
      "I'm working on a responsive layout using CSS Grid. What are some best practices for creating maintainable and responsive grid layouts? Are there any common pitfalls I should avoid?",
    answers: 4,
    views: 32,
  },
  {
    id: 7,
    title: "Understanding Big O notation in algorithms",
    author: {
      name: "Arjun Reddy",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AR",
    },
    timeAgo: "3 days ago",
    tags: ["Algorithms", "Computer Science"],
    tagColors: [
      "bg-blue-50 text-blue-700 border-blue-200",
      "bg-indigo-50 text-indigo-700 border-indigo-200",
    ],
    description:
      "I'm struggling to understand Big O notation and how to analyze the time complexity of algorithms. Could someone explain the concept with some practical examples?",
    answers: 7,
    views: 45,
  },
  {
    id: 8,
    title: "How to optimize database queries in MongoDB?",
    author: {
      name: "Karthik Nair",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "KN",
    },
    timeAgo: "4 days ago",
    tags: ["MongoDB", "Database", "Performance"],
    tagColors: [
      "bg-green-50 text-green-700 border-green-200",
      "bg-blue-50 text-blue-700 border-blue-200",
      "bg-orange-50 text-orange-700 border-orange-200",
    ],
    description:
      "I'm working with MongoDB and noticing slow query performance as my dataset grows. What are some effective strategies for optimizing database queries in MongoDB?",
    answers: 3,
    views: 28,
  },
  {
    id: 9,
    title: "Implementing JWT authentication in Express.js",
    author: {
      name: "Meera Desai",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MD",
    },
    timeAgo: "5 days ago",
    tags: ["Express.js", "Authentication", "JWT"],
    tagColors: [
      "bg-green-50 text-green-700 border-green-200",
      "bg-indigo-50 text-indigo-700 border-indigo-200",
      "bg-yellow-50 text-yellow-700 border-yellow-200",
    ],
    description:
      "I need to implement secure JWT authentication in my Express.js application. What's the best approach for implementing JWT, handling token refresh, and securing routes?",
    answers: 6,
    views: 42,
  },
  {
    id: 10,
    title: "Understanding React Server Components",
    author: {
      name: "Rahul Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RS",
    },
    timeAgo: "1 week ago",
    tags: ["React", "Next.js", "Server Components"],
    tagColors: [
      "bg-cyan-50 text-cyan-700 border-cyan-200",
      "bg-cyan-50 text-cyan-700 border-cyan-200",
      "bg-blue-50 text-blue-700 border-blue-200",
    ],
    description:
      "I'm trying to understand React Server Components in Next.js. What are the benefits, and how do they differ from traditional client components? When should I use each?",
    answers: 8,
    views: 67,
  },
];

// Available tags for filtering
const availableTags = [
  "All",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
  "Algorithms",
  "Data Structures",
  "Next.js",
  "Authentication",
  "CSS",
  "MongoDB",
  "Express.js",
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [activeTab, setActiveTab] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter questions based on search query and active tag
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      activeTag === "All" ||
      question.tags.some(
        (tag) => tag.toLowerCase() === activeTag.toLowerCase()
      );

    return matchesSearch && matchesTag;
  });

  // Sort questions based on active tab
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (activeTab === "recent") {
      // Sort by recency (already in order in our mock data)
      return a.id < b.id ? 1 : -1;
    } else if (activeTab === "popular") {
      // Sort by views
      return b.views - a.views;
    } else if (activeTab === "unanswered") {
      // Sort by number of answers (ascending)
      return a.answers - b.answers;
    }
    return 0;
  });

  // Handle load more
  const handleLoadMore = () => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (page === 1) {
        setQuestions([...questions, ...additionalQuestions.slice(0, 5)]);
        setPage(2);
      } else {
        setQuestions([...questions, ...additionalQuestions.slice(5)]);
        setHasMore(false);
      }
      setLoading(false);
    }, 1000);
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
              href="/dashboard/questions"
              className="text-sm font-medium text-primary"
            >
              Questions
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Leaderboard
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
            <p className="text-muted-foreground">
              Browse, search, and filter questions from the CodeCommons
              community
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
                <Link href="/dashboard/ask">
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" /> Ask Question
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {availableTags.map((tag, index) => (
                  <Badge
                    key={index}
                    className={`px-3 py-1 cursor-pointer ${
                      activeTag === tag
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-transparent text-foreground hover:bg-muted"
                    } transition-colors`}
                    variant={activeTag === tag ? "default" : "outline"}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs
              defaultValue="recent"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="recent">Recent Questions</TabsTrigger>
                <TabsTrigger value="popular">Most Popular</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                <AnimatePresence>
                  {sortedQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="bg-background rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-border/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/dashboard/questions/${question.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                              {question.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={question.author.avatar}
                                alt={question.author.name}
                              />
                              <AvatarFallback>
                                {question.author.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {question.author.name} • {question.timeAgo}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {question.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className={question.tagColors[tagIndex]}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground line-clamp-2">
                        {question.description}
                      </p>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>
                              {Array.isArray(question.answers)
                                ? question.answers.length
                                : 0}{" "}
                              answers
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{question.views} views</span>
                          </div>
                        </div>
                        <Link href={`/dashboard/questions/${question.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            View Question <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {sortedQuestions.length === 0 && (
                  <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center">
                    <h3 className="font-semibold text-lg mb-2">
                      No questions found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                    <Link href="/dashboard/ask">
                      <Button>Ask a Question</Button>
                    </Link>
                  </div>
                )}

                {hasMore && sortedQuestions.length > 0 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      className="gap-1"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                <AnimatePresence>
                  {sortedQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="bg-background rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-border/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/dashboard/questions/${question.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                              {question.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={question.author.avatar}
                                alt={question.author.name}
                              />
                              <AvatarFallback>
                                {question.author.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {question.author.name} • {question.timeAgo}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {question.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className={question.tagColors[tagIndex]}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground line-clamp-2">
                        {question.description}
                      </p>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>
                              {Array.isArray(question.answers)
                                ? question.answers.length
                                : 0}{" "}
                              answers
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{question.views} views</span>
                          </div>
                        </div>
                        <Link href={`/dashboard/questions/${question.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            View Question <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-4">
                <AnimatePresence>
                  {sortedQuestions
                    .filter((question) => question.answers === 0)
                    .map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="bg-background rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-border/50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/dashboard/questions/${question.id}`}>
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                                {question.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={question.author.avatar}
                                  alt={question.author.name}
                                />
                                <AvatarFallback>
                                  {question.author.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {question.author.name} • {question.timeAgo}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {question.tags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className={question.tagColors[tagIndex]}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-muted-foreground line-clamp-2">
                          {question.description}
                        </p>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                              Needs Answer
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{question.views} views</span>
                            </div>
                          </div>
                          <Link href={`/dashboard/questions/${question.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              View Question <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>

                {sortedQuestions.filter((q) => q.answers === 0).length ===
                  0 && (
                  <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center">
                    <h3 className="font-semibold text-lg mb-2">
                      No unanswered questions found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Great job! All questions matching your criteria have been
                      answered.
                    </p>
                    <Link href="/dashboard/ask">
                      <Button>Ask a Question</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Spinner(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
