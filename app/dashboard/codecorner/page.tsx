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
  Plus,
  Code2,
  MessageSquare,
  ThumbsUp,
  Clock,
  Eye,
  Tag,
  Search,
  Filter,
  ThumbsDown,
  Users,
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  TrendingUp,
  Activity,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/services/auth";
import Link from "next/link";

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
  answers: number;
  userVote?: "like" | "dislike" | null;
  likes?: number;
  dislikes?: number;
}

interface Stats {
  totalQuestions: number;
  activeUsers: number;
  topContributors: number;
  totalPoints: number;
}

interface UserActivity {
  type: "question" | "answer" | "upvote" | "downvote";
  title: string;
  points: number;
  timestamp: string;
  status?: "positive" | "negative" | "neutral";
}

interface UserStats {
  totalPoints: number;
  questionsAsked: number;
  answersGiven: number;
  upvotesReceived: number;
  downvotesReceived: number;
  recentActivities: UserActivity[];
}

const processContent = (content: any): string => {
  if (content === null || content === undefined) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    try {
      if (content.content) {
        return processContent(content.content);
      }
      if (Array.isArray(content)) {
        return content.map((item) => processContent(item)).join("\n");
      }
      const stringified = JSON.stringify(content);
      if (stringified === "{}" || stringified === "[]") return "";
      return stringified;
    } catch (error) {
      console.warn("Error converting content to string:", error);
      return "[Object]";
    }
  }
  return String(content);
};

export default function CodeCornerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    language: "",
    tags: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [replies, setReplies] = useState<{ [key: string]: string }>({});
  const [points, setPoints] = useState(0);
  const [votingStates, setVotingStates] = useState<{
    [key: string]: "like" | "dislike" | null;
  }>({});
  const [stats] = useState<Stats>({
    totalQuestions: 0,
    activeUsers: 1200,
    topContributors: 50,
    totalPoints: 15000,
  });
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    questionsAsked: 0,
    answersGiven: 0,
    upvotesReceived: 0,
    downvotesReceived: 0,
    recentActivities: [],
  });

  const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "SQL",
    "Other",
  ];

  useEffect(() => {
    fetchQuestions();
    fetchUserStats();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      const response = await fetch("/api/codecorner/questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(
        Array.isArray(data)
          ? data.map((q) => ({
              ...q,
              userVote: q.userVote || null,
              likes: q.likes || 0,
              dislikes: q.dislikes || 0,
            }))
          : []
      );
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch("/api/codecorner/user/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }

      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast({
        title: "Error",
        description: "Failed to load your stats. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch("/api/codecorner/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        throw new Error("Failed to create question");
      }

      toast({
        title: "Success",
        description: "Question posted successfully!",
      });

      setIsDialogOpen(false);
      setNewQuestion({
        title: "",
        content: "",
        language: "",
        tags: [],
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error creating question:", error);
      toast({
        title: "Error",
        description: "Failed to post question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (
    postId: string,
    reply: string,
    points?: number
  ) => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `/api/codecorner/questions/${postId}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: reply, points }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to submit reply: ${response.status} ${response.statusText}`
        );
      }

      toast({
        title: "Success",
        description: "Reply posted successfully!",
      });

      setReplies((prev) => ({
        ...prev,
        [postId]: "",
      }));
      setPoints(0);
      fetchQuestions();
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (questionId: string, type: "like" | "dislike") => {
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
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => {
          if (q._id === questionId) {
            // Get current vote state
            const currentVote = q.userVote;
            let newLikes = q.likes || 0;
            let newDislikes = q.dislikes || 0;

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
              ...q,
              likes: newLikes,
              dislikes: newDislikes,
              userVote: currentVote === type ? null : type,
            };
          }
          return q;
        })
      );

      // Then make the API call
      const response = await fetch(
        `/api/codecorner/question/${questionId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || errorData?.message || "Failed to vote"
        );
      }

      const data = await response.json();

      // Update with server response
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => {
          if (q._id === questionId) {
            return {
              ...q,
              likes: data.likes,
              dislikes: data.dislikes,
              userVote: type,
            };
          }
          return q;
        })
      );

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
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => {
          if (q._id === questionId) {
            return {
              ...q,
              likes: q.likes,
              dislikes: q.dislikes,
              userVote: q.userVote,
            };
          }
          return q;
        })
      );
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      selectedLanguage === "all" || question.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* User Points & Activity Dashboard */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  Total Points
                </CardTitle>
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.totalPoints}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Your contribution score
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Questions</CardTitle>
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {userStats.questionsAsked}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Questions asked
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Answers</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.answersGiven}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Answers provided
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Votes</CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    +{userStats.upvotesReceived}
                  </div>
                  <p className="text-sm text-muted-foreground">Upvotes</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    -{userStats.downvotesReceived}
                  </div>
                  <p className="text-sm text-muted-foreground">Downvotes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-primary/10">
                Last 7 days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        activity.status === "positive"
                          ? "bg-green-100 text-green-600"
                          : activity.status === "negative"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {activity.type === "question" && (
                        <MessageSquare className="h-4 w-4" />
                      )}
                      {activity.type === "answer" && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {activity.type === "upvote" && (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                      {activity.type === "downvote" && (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-medium ${
                      activity.points > 0
                        ? "text-green-600"
                        : activity.points < 0
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {activity.points > 0 ? "+" : ""}
                    {activity.points} points
                  </div>
                </motion.div>
              ))}

              {userStats.recentActivities.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-muted/50 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No recent activity
                  </h3>
                  <p className="text-muted-foreground">
                    Start participating in the community to see your activity
                    here!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 mb-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">CodeCorner</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mb-8">
            Join our vibrant community of developers. Ask questions, share
            knowledge, and grow together.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Questions</p>
                  <p className="text-2xl font-bold text-white">
                    {questions.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.activeUsers}+
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Top Contributors</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.topContributors}+
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Points</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalPoints}+
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ask Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Ask a Question</DialogTitle>
                  <DialogDescription>
                    Share your coding question with the community. Be specific
                    and include relevant code snippets.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title">Question Title</label>
                    <Input
                      id="title"
                      value={newQuestion.title}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          title: e.target.value,
                        })
                      }
                      placeholder="What's your question?"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="language">Programming Language</label>
                    <Select
                      value={newQuestion.language}
                      onValueChange={(value) =>
                        setNewQuestion({ ...newQuestion, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="content">Question Details</label>
                    <Textarea
                      id="content"
                      value={newQuestion.content}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          content: e.target.value,
                        })
                      }
                      placeholder="Describe your question in detail. You can use markdown for formatting and code blocks."
                      className="min-h-[200px] font-mono"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="tags">Tags</label>
                    <Input
                      id="tags"
                      value={newQuestion.tags.join(", ")}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim()),
                        })
                      }
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateQuestion}>Post Question</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Code2 className="h-5 w-5 mr-2" />
              Browse Questions
            </Button>
          </div>
        </div>
      </div>

      {/* Points System Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <CardTitle>Quick Points</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="font-medium">Ask a question:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  +5 points
                </Badge>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="font-medium">Answer a question:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  +10 points
                </Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <CardTitle>Achievement Points</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="font-medium">Answer accepted:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  +15 points
                </Badge>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="font-medium">Receive upvote:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  +2 points
                </Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/50 dark:to-orange-950/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-pink-600" />
              <CardTitle>Special Rewards</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="font-medium">Top contributor:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  +50 points
                </Badge>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="font-medium">Weekly streak:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  +20 points
                </Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-card rounded-xl p-6 mb-8 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang.toLowerCase()}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="space-y-6">
        {filteredQuestions.map((question, index) => (
          <motion.div
            key={question._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/dashboard/codecorner/${question._id}`}>
                      <CardTitle className="line-clamp-1 cursor-pointer hover:text-primary transition-colors text-xl">
                        {question.title}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="capitalize bg-primary/10"
                      >
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
                  <Badge variant="outline" className="capitalize bg-primary/10">
                    {question.author.role}
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
                        votingStates[question._id] === "like"
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => handleVote(question._id, "like")}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {question.likes || 0}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        votingStates[question._id] === "dislike"
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => handleVote(question._id, "dislike")}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {question.dislikes || 0}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {processContent(question.content)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 bg-primary/5"
                        >
                          <Tag className="h-3 w-3" />
                          {processContent(tag)}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{processContent(question.answers)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{processContent(question.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(
                            processContent(question.createdAt)
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Code2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No questions match your search criteria."
              : "Be the first to ask a question!"}
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>
      )}
    </div>
  );
}
