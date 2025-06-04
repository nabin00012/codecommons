"use client";

import React, { useState, useEffect } from "react";
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
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ThumbsDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { authService } from "@/lib/services/auth";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { use } from "react";

interface Author {
  _id: string;
  name: string;
  email: string;
  role?: string;
  semester?: string;
  department?: string;
}

interface Answer {
  _id: string;
  content: string;
  author: Author;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
  likes?: number;
  dislikes?: number;
  userVote?: "like" | "dislike" | null;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  language?: string;
  views?: number;
  votes: number;
  answers: Answer[];
  isSolved: boolean;
  likes?: number;
  dislikes?: number;
  userVote?: "like" | "dislike" | null;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-red-500 mb-4">{this.state.error?.message}</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function QuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [votingStates, setVotingStates] = useState<
    Record<string, "up" | "down" | null>
  >({});

  useEffect(() => {
    const initParams = async () => {
      try {
        setQuestionId(params.id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize question parameters",
          variant: "destructive",
        });
      }
    };
    initParams();
  }, [params, toast]);

  useEffect(() => {
    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  useEffect(() => {
    if (question) {
      console.log("Question before rendering answers:", {
        id: question._id,
        title: question.title,
        answers: question.answers.map((a) => ({
          id: a._id,
          content: a.content,
          author: a.author,
          createdAt: a.createdAt,
          votes: a.votes,
          isAccepted: a.isAccepted,
        })),
      });

      // Log each answer's content type
      question.answers.forEach((answer, index) => {
        console.log(`Answer ${index} content type:`, typeof answer.content);
        console.log(`Answer ${index} content:`, answer.content);
      });
    }
  }, [question]);

  useEffect(() => {
    console.log("Current question state:", question);
    if (question) {
      console.log("Question answers:", question.answers);
      question.answers.forEach((answer, index) => {
        console.log(`Answer ${index}:`, {
          id: answer._id,
          content: answer.content,
          contentType: typeof answer.content,
          author: answer.author,
        });
      });
    }
  }, [question]);

  useEffect(() => {
    if (question) {
      console.log("Question data:", {
        id: question._id,
        title: question.title,
        content: question.content,
        answers: question.answers?.map((a) => ({
          id: a._id,
          content: a.content,
          author: a.author,
        })),
      });
    }
  }, [question]);

  useEffect(() => {
    console.log("Question state updated:", {
      isLoading,
      questionId,
      question: question
        ? {
            id: question._id,
            title: question.title,
            answersCount: question.answers?.length,
            hasContent: !!question.content,
          }
        : null,
    });
  }, [question, isLoading, questionId]);

  // Update the processContent function to better handle object content
  const processContent = (content: any): string => {
    if (content === null || content === undefined) return "";
    if (typeof content === "string") return content;
    if (typeof content === "object") {
      try {
        // If it's an object with a content property, use that
        if (content.content) {
          return processContent(content.content);
        }
        // If it's an array, join its elements
        if (Array.isArray(content)) {
          return content.map((item) => processContent(item)).join("\n");
        }
        // For other objects, try to stringify them
        const stringified = JSON.stringify(content);
        // If the stringified result is just an empty object or array, return empty string
        if (stringified === "{}" || stringified === "[]") return "";
        return stringified;
      } catch (error) {
        console.warn("Error converting content to string:", error);
        return "[Object]";
      }
    }
    return String(content);
  };

  // Update the MarkdownContent component to ensure content is properly processed
  const MarkdownContent = ({ content }: { content: string }) => {
    const safeContent = processContent(content);

    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            const codeContent = processContent(children).replace(/\n$/, "");

            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {codeContent}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {codeContent}
              </code>
            );
          },
        }}
      >
        {safeContent}
      </ReactMarkdown>
    );
  };

  // Update the QuestionContent component to ensure content is properly processed
  const QuestionContent = ({ question }: { question: Question }) => {
    if (!question) return null;

    const processedContent = processContent(question.content);

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <MarkdownContent content={processedContent} />
      </div>
    );
  };

  // Update the AnswerContent component to ensure content is properly processed
  const AnswerContent = ({ answer }: { answer: Answer }) => {
    if (!answer) return null;

    const processedContent = processContent(answer.content);

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <MarkdownContent content={processedContent} />
      </div>
    );
  };

  // Add a utility function to safely process question data
  const processQuestionData = (data: any): Question | null => {
    if (!data) return null;

    try {
      // Process content first
      const content = processContent(data.content);

      // Process answers
      const answers = Array.isArray(data.answers)
        ? data.answers.map((answer: any) => {
            const answerContent = processContent(answer.content);

            return {
              _id: String(answer._id || ""),
              content: answerContent,
              author: {
                _id: String(answer.author?._id || ""),
                name: String(answer.author?.name || "Anonymous"),
                email: String(answer.author?.email || ""),
                role: answer.author?.role
                  ? String(answer.author.role)
                  : undefined,
                semester: answer.author?.semester
                  ? String(answer.author.semester)
                  : undefined,
                department: answer.author?.department
                  ? String(answer.author.department)
                  : undefined,
              },
              createdAt: String(answer.createdAt || new Date().toISOString()),
              votes: Number(answer.votes || 0),
              isAccepted: Boolean(answer.isAccepted),
              likes: Number(answer.likes || 0),
              dislikes: Number(answer.dislikes || 0),
            };
          })
        : [];

      return {
        _id: String(data._id || ""),
        title: String(data.title || ""),
        content: content,
        author: {
          _id: String(data.author?._id || ""),
          name: String(data.author?.name || "Anonymous"),
          email: String(data.author?.email || ""),
          role: data.author?.role ? String(data.author.role) : undefined,
          semester: data.author?.semester
            ? String(data.author.semester)
            : undefined,
          department: data.author?.department
            ? String(data.author.department)
            : undefined,
        },
        createdAt: String(data.createdAt || new Date().toISOString()),
        updatedAt: String(data.updatedAt || new Date().toISOString()),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        language: data.language ? String(data.language) : undefined,
        views: Number(data.views || 0),
        votes: Number(data.votes || 0),
        answers: answers,
        isSolved: Boolean(data.isSolved),
        likes: Number(data.likes || 0),
        dislikes: Number(data.dislikes || 0),
        userVote: data.userVote,
      };
    } catch (error) {
      console.error("Error processing question data:", error);
      return null;
    }
  };

  const fetchQuestion = async () => {
    try {
      console.log("Starting to fetch question...");
      setIsLoading(true);
      const token = authService.getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Making API request...");
      const response = await fetch(`/api/codecorner/questions/${questionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch question: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Raw API response:", JSON.stringify(data, null, 2));

      if (!data || typeof data !== "object") {
        throw new Error("Invalid API response format");
      }

      // Process the question data
      const processedData = processQuestionData(data);
      if (!processedData) {
        throw new Error("Failed to process question data");
      }

      console.log(
        "Processed question data:",
        JSON.stringify(processedData, null, 2)
      );
      setQuestion(processedData);
    } catch (error) {
      console.error("Error fetching question:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load question. Please try again.",
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

    setIsSubmitting(true);
    try {
      const token = authService.getToken();
      const response = await fetch(
        `/api/codecorner/questions/${questionId}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newAnswer }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post answer");
      }

      if (!data.success || !data.data) {
        throw new Error("Invalid response from server");
      }

      // Create a new answer object with the current user's information
      const newAnswerObj: Answer = {
        _id: data.data._id || crypto.randomUUID(), // Fallback to a random UUID if _id is not provided
        content: newAnswer,
        author: {
          _id: user?.id || "",
          name: user?.name || "Anonymous",
          email: user?.email || "",
          role: user?.role,
        },
        createdAt: new Date().toISOString(),
        votes: 0,
        isAccepted: false,
        likes: 0,
        dislikes: 0,
      };

      // Update the question state with the new answer
      if (question) {
        setQuestion({
          ...question,
          answers: [...question.answers, newAnswerObj],
        });
      }

      setNewAnswer("");
      toast({
        title: "Success",
        description: "Answer posted successfully!",
      });

      // Refresh the question data to ensure we have the latest state
      await fetchQuestion();
    } catch (error) {
      console.error("Error posting answer:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to post answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (answerId: string, type: "like" | "dislike") => {
    try {
      const token = authService.getToken();
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to vote",
          variant: "destructive",
        });
        return;
      }

      // First update the UI optimistically
      if (question) {
        setQuestion((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            answers: prev.answers.map((answer) => {
              if (answer._id === answerId) {
                // Get current vote state
                const currentVote = answer.userVote;
                let newLikes = answer.likes || 0;
                let newDislikes = answer.dislikes || 0;

                // Handle vote changes
                if (currentVote === type) {
                  // If clicking the same vote type, remove it
                  if (type === "like") newLikes--;
                  else newDislikes--;
                } else if (currentVote === null) {
                  // If no previous vote, add new vote
                  if (type === "like") newLikes++;
                  else newDislikes++;
                } else {
                  // If changing vote type, remove old and add new
                  if (type === "like") {
                    newLikes++;
                    newDislikes--;
                  } else {
                    newLikes--;
                    newDislikes++;
                  }
                }

                return {
                  ...answer,
                  likes: newLikes,
                  dislikes: newDislikes,
                  userVote: currentVote === type ? null : type,
                };
              }
              return answer;
            }),
          };
        });
      }

      // Then make the API call
      const response = await fetch(`/api/codecorner/answer/${answerId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: type === "like" ? "up" : "down" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || errorData?.message || "Failed to vote"
        );
      }

      const data = await response.json();

      // Update with server response
      if (question) {
        setQuestion((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            answers: prev.answers.map((answer) => {
              if (answer._id === answerId) {
                return {
                  ...answer,
                  likes: data.likes,
                  dislikes: data.dislikes,
                  userVote: type,
                };
              }
              return answer;
            }),
          };
        });
      }

      toast({
        title: "Success",
        description: "Vote recorded successfully!",
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to vote. Please try again.",
        variant: "destructive",
      });

      // Revert the optimistic update on error
      if (question) {
        setQuestion((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            answers: prev.answers.map((answer) => {
              if (answer._id === answerId) {
                return {
                  ...answer,
                  likes: answer.likes,
                  dislikes: answer.dislikes,
                  userVote: answer.userVote,
                };
              }
              return answer;
            }),
          };
        });
      }
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `/api/codecorner/questions/${questionId}/answers/${answerId}/accept`,
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

  // Add logging before rendering answers
  useEffect(() => {
    if (question) {
      console.log("Question before rendering:", {
        id: question._id,
        title: question.title,
        answers: question.answers.map((a) => ({
          id: a._id,
          contentType: typeof a.content,
          content: a.content,
          author: a.author,
          createdAt: a.createdAt,
          votes: a.votes,
          isAccepted: a.isAccepted,
        })),
      });
    }
  }, [question]);

  // Add a utility function to safely process answer data
  const processAnswerData = (answer: any): Answer | null => {
    if (!answer) return null;

    try {
      // Process content first
      let content = answer.content;
      if (typeof content === "object") {
        try {
          content = JSON.stringify(content);
        } catch (error) {
          console.warn("Error converting answer content to string:", error);
          content = "[Object]";
        }
      } else {
        content = String(content || "");
      }

      return {
        _id: String(answer._id || ""),
        content: content,
        author: {
          _id: String(answer.author?._id || ""),
          name: String(answer.author?.name || "Anonymous"),
          email: String(answer.author?.email || ""),
          role: answer.author?.role ? String(answer.author.role) : undefined,
          semester: answer.author?.semester
            ? String(answer.author.semester)
            : undefined,
          department: answer.author?.department
            ? String(answer.author.department)
            : undefined,
        },
        createdAt: String(answer.createdAt || new Date().toISOString()),
        votes: Number(answer.votes || 0),
        isAccepted: Boolean(answer.isAccepted),
        likes: Number(answer.likes || 0),
        dislikes: Number(answer.dislikes || 0),
      };
    } catch (error) {
      console.error("Error processing answer data:", error);
      return null;
    }
  };

  // Add a utility function to safely process answer content
  const processAnswerContent = (content: any): string => {
    if (content === null || content === undefined) return "";
    if (typeof content === "string") return content;
    if (typeof content === "object") {
      try {
        return JSON.stringify(content);
      } catch (error) {
        console.warn("Error converting content to string:", error);
        return "[Object]";
      }
    }
    return String(content);
  };

  // Update the renderAnswers function
  const renderAnswers = () => {
    if (!question?.answers?.length) {
      return (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No answers yet</h3>
          <p className="text-muted-foreground">
            Be the first to answer this question!
          </p>
        </div>
      );
    }

    const sortedAnswers = [...question.answers].sort((a, b) => {
      if (a.isAccepted) return -1;
      if (b.isAccepted) return 1;
      return b.votes - a.votes;
    });

    return (
      <div className="space-y-6">
        {sortedAnswers.map((answer) => {
          const answerId = String(answer._id || "");
          const authorName = String(answer.author?.name || "Anonymous");
          const createdAt = String(
            answer.createdAt || new Date().toISOString()
          );
          const votes = Number(answer.votes || 0);
          const isAccepted = Boolean(answer.isAccepted);

          return (
            <div key={answerId} className="border-t border-gray-200 pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => handleVote(answerId, "like")}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      disabled={!user}
                      title={!user ? "Please login to vote" : "Like"}
                    >
                      <ThumbsUp className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        {answer.likes || 0}
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-sm font-medium text-red-600">
                        {answer.dislikes || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => handleVote(answerId, "dislike")}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      disabled={!user}
                      title={!user ? "Please login to vote" : "Dislike"}
                    >
                      <ThumbsDown className="h-6 w-6" />
                    </button>
                    {question?.author?._id === user?.id &&
                      !question?.isSolved && (
                        <button
                          onClick={() => handleAcceptAnswer(answerId)}
                          className="mt-2 text-gray-400 hover:text-green-500 transition-colors"
                          title="Accept this answer"
                        >
                          <CheckCircleIcon className="h-6 w-6" />
                        </button>
                      )}
                  </div>
                </div>
                <div className="flex-1">
                  <AnswerContent answer={answer} />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Answered by {authorName}</span>
                      <span>•</span>
                      <time dateTime={createdAt}>
                        {new Date(createdAt).toLocaleString()}
                      </time>
                    </div>
                    {isAccepted && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Accepted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Add a useEffect to fetch answers periodically
  useEffect(() => {
    if (questionId) {
      const fetchAnswers = async () => {
        await fetchQuestion();
      };

      // Fetch answers every 30 seconds
      const interval = setInterval(fetchAnswers, 30000);

      return () => clearInterval(interval);
    }
  }, [questionId]);

  // Add debug logging for question content
  useEffect(() => {
    if (question) {
      console.log("Question content type:", typeof question.content);
      console.log("Question content:", question.content);
      console.log(
        "Question answers:",
        question.answers.map((a) => ({
          id: a._id,
          contentType: typeof a.content,
          content: a.content,
        }))
      );
    }
  }, [question]);

  // Modify the answer submission section to show for both students and teachers
  const renderAnswerForm = () => {
    // Check if user is logged in and has either student or teacher role
    const canAnswer =
      user && (user.role === "student" || user.role === "teacher");

    if (!canAnswer) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Answer This Question</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need to be logged in as a student or teacher to answer
              questions.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
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
    );
  };

  // Add loading state handling
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Add error state handling
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

  // Safely access question properties
  const currentQuestionId = processContent(question._id);
  const questionTitle = processContent(question.title);
  const questionContent = processContent(question.content);
  const authorName = processContent(question.author?.name);
  const authorRole = processContent(question.author?.role);
  const authorSemester = processContent(question.author?.semester);
  const language = processContent(question.language);
  const views = Number(processContent(question.views));
  const votes = Number(processContent(question.votes));
  const createdAt = processContent(question.createdAt);
  const tags = Array.isArray(question.tags)
    ? question.tags.map((tag) => processContent(tag))
    : [];
  const answersCount = Array.isArray(question.answers)
    ? question.answers.length
    : 0;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleString();

  // Debug log the question content
  console.log("Question content:", questionContent);

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="container py-8">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-primary/10"
            onClick={() => router.push("/dashboard/codecorner")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {questionTitle}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="capitalize bg-primary/10"
                        >
                          {language}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          by {authorName}
                        </span>
                        {authorSemester && (
                          <span className="text-sm text-muted-foreground">
                            • {authorSemester}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="capitalize bg-primary/10"
                    >
                      {authorRole}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          question?.userVote === "like"
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                        onClick={() =>
                          question?._id && handleVote(question._id, "like")
                        }
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {question?.likes || 0}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          question?.userVote === "dislike"
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                        onClick={() =>
                          question?._id && handleVote(question._id, "dislike")
                        }
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {question?.dislikes || 0}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none dark:prose-invert mb-6">
                        <MarkdownContent content={questionContent} />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1 bg-primary/5"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{answersCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {answersCount} Answers
                  </h2>
                  <Badge variant="outline" className="capitalize">
                    {answersCount === 0 ? "No answers yet" : "Answered"}
                  </Badge>
                </div>
                {renderAnswers()}
              </div>

              {renderAnswerForm()}
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
    </ErrorBoundary>
  );
}
