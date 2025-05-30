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

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  tagColors: string[];
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  timeAgo: string;
  upvotes: number;
  answers: number;
  views: number;
}

const demoQuestions: Question[] = [
  {
    id: "1",
    title: "How to implement efficient binary search in Python?",
    content:
      "I'm working on optimizing my search algorithms and need help implementing binary search with proper edge case handling...",
    tags: ["Python", "Algorithms", "Data Structures"],
    tagColors: [
      "bg-blue-50 text-blue-700 border-blue-200",
      "bg-purple-50 text-purple-700 border-purple-200",
      "bg-green-50 text-green-700 border-green-200",
    ],
    author: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AC",
    },
    timeAgo: "2 hours ago",
    upvotes: 24,
    answers: 5,
    views: 89,
  },
  {
    id: "2",
    title: "React useEffect cleanup and memory leaks",
    content:
      "I'm experiencing memory leaks in my React application when components unmount. How can I properly clean up useEffect hooks?",
    tags: ["React", "JavaScript", "Performance"],
    tagColors: [
      "bg-cyan-50 text-cyan-700 border-cyan-200",
      "bg-yellow-50 text-yellow-700 border-yellow-200",
      "bg-red-50 text-red-700 border-red-200",
    ],
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
    timeAgo: "4 hours ago",
    upvotes: 18,
    answers: 3,
    views: 67,
  },
  {
    id: "3",
    title: "Database optimization for large-scale applications",
    content:
      "Looking for best practices to optimize database queries and improve performance for applications handling millions of records...",
    tags: ["Database", "Performance", "SQL"],
    tagColors: [
      "bg-indigo-50 text-indigo-700 border-indigo-200",
      "bg-red-50 text-red-700 border-red-200",
      "bg-gray-50 text-gray-700 border-gray-200",
    ],
    author: {
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MR",
    },
    timeAgo: "1 day ago",
    upvotes: 31,
    answers: 8,
    views: 156,
  },
];

export function DemoQuestions() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
            <MessageSquare className="h-4 w-4 mr-2" />
            Community Questions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Learn from the Best
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore real questions and solutions from our community of
            passionate developers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {demoQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="cosmic-card group">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag, i) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`${question.tagColors[i]} cosmic-glow`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mb-3 cosmic-text">
                    {question.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {question.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 cosmic-glow">
                        <AvatarImage
                          src={question.author.avatar}
                          alt={question.author.name}
                        />
                        <AvatarFallback>
                          {question.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium cosmic-text">
                          {question.author.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {question.timeAgo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 cosmic-glow">
                              <ThumbsUp className="h-4 w-4" />
                              {question.upvotes}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Upvotes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 cosmic-glow">
                              <MessageSquare className="h-4 w-4" />
                              {question.answers}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Answers</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 cosmic-glow">
                              <Eye className="h-4 w-4" />
                              {question.views}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Views</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <Button
                      variant="ghost"
                      className="w-full cosmic-button"
                      onClick={() => toggleExpand(question.id)}
                    >
                      {expandedQuestion === question.id
                        ? "Show Less"
                        : "Read More"}
                      <ArrowRight
                        className={`ml-2 h-4 w-4 transition-transform ${
                          expandedQuestion === question.id ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
