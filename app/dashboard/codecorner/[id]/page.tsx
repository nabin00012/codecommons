"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import {
  Loader2,
  MessageSquare,
  ThumbsUp,
  Clock,
  Eye,
  Tag,
  ArrowLeft,
  Code2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { authService } from "@/lib/services/auth";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  language: string;
  author: {
    _id: string;
    name: string;
    role: string;
    semester?: string;
    department?: string;
  };
  createdAt: string;
  views: number;
  votes: number;
  answers: Answer[];
}

interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    role: string;
    semester?: string;
    department?: string;
  };
  createdAt: string;
  votes: number;
  isAccepted: boolean;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function QuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [params.id]);

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      const response = await fetch(`/api/codecorner/questions/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
      toast({
        title: "Error",
        description: "Failed to load question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please enter an answer",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = authService.getToken();
      const response = await fetch(
        `/api/codecorner/questions/${params.id}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newAnswer }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      toast({
        title: "Success",
        description: "Answer posted successfully!",
      });

      setNewAnswer("");
      fetchQuestion();
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to post answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (type: "question" | "answer", id: string) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`/api/codecorner/${type}s/${id}/vote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      fetchQuestion();
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `/api/codecorner/questions/${params.id}/answers/${answerId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept answer");
      }

      fetchQuestion();
    } catch (error) {
      console.error("Error accepting answer:", error);
      toast({
        title: "Error",
        description: "Failed to accept answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Question not found</h1>
          <Button onClick={() => router.push("/dashboard/codecorner")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/dashboard/codecorner")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {question.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {question.language}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {question.author.name}
                      </span>
                      {question.author.semester && (
                        <span className="text-sm text-muted-foreground">
                          • {question.author.semester}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {question.author.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      code({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }: CodeProps) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {question.content}
                  </ReactMarkdown>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleVote("question", question._id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{question.votes}</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answers.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{question.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {question.answers.length} Answers
              </h2>
              {question.answers.map((answer) => (
                <motion.div
                  key={answer._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }: CodeProps) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {answer.content}
                        </ReactMarkdown>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleVote("answer", answer._id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{answer.votes}</span>
                          </Button>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(answer.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {user?.role === "teacher" && !answer.isAccepted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptAnswer(answer._id)}
                          >
                            Accept Answer
                          </Button>
                        )}

                        {answer.isAccepted && (
                          <Badge className="bg-green-500">Accepted</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here. You can use markdown for formatting and code blocks."
                  className="min-h-[200px] font-mono mb-4"
                />
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting Answer...
                    </>
                  ) : (
                    "Post Answer"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How to Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Be clear and concise</li>
                  <li>Include code examples when relevant</li>
                  <li>Explain your reasoning</li>
                  <li>Use markdown for formatting</li>
                  <li>Earn points for helpful answers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Points System</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ask a question: +5 points</li>
                  <li>Answer a question: +10 points</li>
                  <li>Answer accepted: +15 points</li>
                  <li>Receive upvote: +2 points</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
