"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  TrendingUp,
  Award,
  Target,
  Zap,
  Sparkles,
  Send,
  Check,
  X,
  Loader2,
  ArrowRight,
  Users,
  BarChart3,
  GraduationCap,
} from "lucide-react";
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

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  classroomId: string;
  classroomName?: string;
  createdBy: string;
  status?: string;
  submissionStatus?: "pending" | "submitted" | "graded";
  grade?: number;
  submittedAt?: string;
  createdAt: string;
}

interface Classroom {
  _id: string;
  name: string;
}

// Animated loading skeleton - MODERN & SLEEK
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
        className="relative overflow-hidden"
      >
        <div className="rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
          <div className="space-y-4">
            <div className="h-7 bg-gradient-to-r from-blue-300/40 via-purple-300/40 to-pink-300/40 dark:from-blue-700/40 dark:via-purple-700/40 dark:to-pink-700/40 rounded-2xl animate-pulse" />
            <div className="h-5 bg-gray-300/40 dark:bg-gray-700/40 rounded-xl w-3/4 animate-pulse" />
            <div className="flex gap-3 mt-4">
              <div className="h-10 w-28 bg-gray-200/40 dark:bg-gray-700/40 rounded-full animate-pulse" />
              <div className="h-10 w-28 bg-gray-200/40 dark:bg-gray-700/40 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Animated empty state - MODERN & FUN
const EmptyState = ({ isTeacher }: { isTeacher: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: "spring" }}
    className="flex flex-col items-center justify-center py-20 px-4"
  >
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative mb-8"
    >
      {/* Main circle */}
      <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl transform rotate-12">
        <FileText className="h-20 w-20 text-white -rotate-12" />
      </div>
      {/* Floating dots */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-yellow-400 shadow-lg"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-blue-400 shadow-lg"
      />
    </motion.div>
    
    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
      {isTeacher ? "No Assignments Created Yet" : "No Assignments Available"}
    </h3>
    <p className="text-muted-foreground text-center max-w-md text-lg">
      {isTeacher
        ? "Create your first assignment to get started with your classroom"
        : "Your teachers haven't assigned any work yet. Check back soon!"}
    </p>
  </motion.div>
);

export default function AssignmentsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // New assignment form
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: 100,
    classroomId: "",
  });

  // Submission form
  const [submission, setSubmission] = useState({
    text: "",
    file: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assignments
      const assignmentsRes = await fetch("/api/assignments", {
        credentials: "include",
      });

      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments || data.data || []);
      }

      // Fetch classrooms if teacher
      if (user?.role === "teacher") {
        const classroomsRes = await fetch("/api/classrooms", {
          credentials: "include",
        });

        if (classroomsRes.ok) {
          const data = await classroomsRes.json();
          setClassrooms(data.classrooms || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.classroomId || !newAssignment.dueDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting("creating");

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        toast({
          title: "🎉 Assignment Created!",
          description: "Your assignment has been published successfully",
        });
        setCreateDialogOpen(false);
        setNewAssignment({
          title: "",
          description: "",
          dueDate: "",
          points: 100,
          classroomId: "",
        });
        fetchData();
      } else {
        throw new Error("Failed to create assignment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleSubmitAssignment = async (assignmentId: string) => {
    setSubmitting(assignmentId);

    try {
      const formData = new FormData();
      formData.append("content", submission.text);
      if (submission.file) {
        formData.append("file", submission.file);
      }

      const response = await fetch(`/api/assignments/${assignmentId}/submissions`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "🎯 Assignment Submitted!",
          description: "Your work has been submitted successfully",
        });
        setSubmitDialogOpen(false);
        setSubmission({ text: "", file: null });
        fetchData();
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const getStatusInfo = (assignment: Assignment) => {
    const due = new Date(assignment.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (assignment.submissionStatus === "graded") {
      return {
        color: "from-green-500 to-emerald-500",
        icon: Award,
        text: `Graded: ${assignment.grade}/${assignment.points}`,
        badge: "success",
      };
    }

    if (assignment.submissionStatus === "submitted") {
      return {
        color: "from-blue-500 to-cyan-500",
        icon: CheckCircle,
        text: "Submitted",
        badge: "default",
      };
    }

    if (diffTime < 0) {
      return {
        color: "from-red-500 to-pink-500",
        icon: AlertCircle,
        text: "Overdue",
        badge: "destructive",
      };
    }

    if (diffHours <= 24) {
      return {
        color: "from-orange-500 to-red-500",
        icon: Clock,
        text: diffHours <= 1 ? "Due in 1 hour!" : `Due in ${diffHours} hours`,
        badge: "secondary",
      };
    }

    if (diffDays <= 3) {
      return {
        color: "from-yellow-500 to-orange-500",
        icon: Clock,
        text: `${diffDays} days left`,
        badge: "secondary",
      };
    }

    return {
      color: "from-green-500 to-teal-500",
      icon: Calendar,
      text: `${diffDays} days left`,
      badge: "outline",
    };
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesFilter =
      filter === "all" || assignment.submissionStatus === filter;
    const matchesSearch = assignment.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group assignments by classroom for better organization
  const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
    const classroomName = assignment.classroomName || "Other";
    if (!acc[classroomName]) {
      acc[classroomName] = [];
    }
    acc[classroomName].push(assignment);
    return acc;
  }, {} as Record<string, Assignment[]>);

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => !a.submissionStatus || a.submissionStatus === "pending").length,
    submitted: assignments.filter((a) => a.submissionStatus === "submitted").length,
    graded: assignments.filter((a) => a.submissionStatus === "graded").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-indigo-950/10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 space-y-4">
            <div className="h-14 w-72 bg-gradient-to-r from-blue-200/60 via-purple-200/60 to-pink-200/60 dark:from-blue-800/40 dark:via-purple-800/40 dark:to-pink-800/40 rounded-2xl animate-pulse" />
            <div className="h-7 w-full max-w-md bg-gray-200/60 dark:bg-gray-800/40 rounded-xl animate-pulse" />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-indigo-950/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 md:p-10 shadow-2xl">
            {/* Subtle animated background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-4 mb-3"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm"
                    >
                      <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      Assignments
                    </h1>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-white/90 text-lg md:text-xl max-w-2xl"
                  >
                    {user?.role === "teacher"
                      ? "Create and manage assignments for your students"
                      : "Track your assignments and submit your work"}
                  </motion.p>
                </div>

                {user?.role === "teacher" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="bg-white text-purple-600 hover:bg-white/95 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 rounded-full px-8 font-semibold text-lg h-14"
                        >
                          <Plus className="h-6 w-6 mr-2" />
                          Create Assignment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Create New Assignment
                          </DialogTitle>
                          <DialogDescription>
                            Fill in the details for your new assignment
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="classroom">Classroom *</Label>
                            <Select
                              value={newAssignment.classroomId}
                              onValueChange={(value) =>
                                setNewAssignment({ ...newAssignment, classroomId: value })
                              }
                            >
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select a classroom" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                {classrooms.map((classroom) => (
                                  <SelectItem key={classroom._id} value={classroom._id}>
                                    {classroom.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                              id="title"
                              className="rounded-xl"
                              placeholder="e.g., Week 5: React Hooks Assignment"
                              value={newAssignment.title}
                              onChange={(e) =>
                                setNewAssignment({ ...newAssignment, title: e.target.value })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              className="rounded-xl"
                              placeholder="Describe the assignment requirements..."
                              rows={4}
                              value={newAssignment.description}
                              onChange={(e) =>
                                setNewAssignment({
                                  ...newAssignment,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="dueDate">Due Date *</Label>
                              <Input
                                id="dueDate"
                                type="datetime-local"
                                className="rounded-xl"
                                value={newAssignment.dueDate}
                                onChange={(e) =>
                                  setNewAssignment({
                                    ...newAssignment,
                                    dueDate: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="points">Points</Label>
                              <Input
                                id="points"
                                type="number"
                                className="rounded-xl"
                                min="1"
                                value={newAssignment.points}
                                onChange={(e) =>
                                  setNewAssignment({
                                    ...newAssignment,
                                    points: parseInt(e.target.value) || 100,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setCreateDialogOpen(false)}
                            disabled={submitting === "creating"}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCreateAssignment}
                            disabled={submitting === "creating"}
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {submitting === "creating" ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Create Assignment
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                )}
              </div>

              {/* Modern Stats Cards for Students */}
              {user?.role === "student" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                >
                  {[
                    { label: "Total", value: stats.total, icon: Target, gradient: "from-purple-400 to-pink-400", bgGlow: "bg-purple-400/20" },
                    { label: "Pending", value: stats.pending, icon: Clock, gradient: "from-yellow-400 to-orange-400", bgGlow: "bg-yellow-400/20" },
                    { label: "Submitted", value: stats.submitted, icon: CheckCircle, gradient: "from-blue-400 to-cyan-400", bgGlow: "bg-blue-400/20" },
                    { label: "Graded", value: stats.graded, icon: Award, gradient: "from-green-400 to-emerald-400", bgGlow: "bg-green-400/20" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 150 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative group cursor-pointer"
                    >
                      {/* Glow effect on hover */}
                      <div className={`absolute inset-0 ${stat.bgGlow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      
                      {/* Card */}
                      <div className="relative bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/40 dark:border-white/10 shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-white drop-shadow-lg">{stat.value}</div>
                            <div className="text-white/90 text-sm font-medium">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modern Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          {/* Search Bar */}
          <motion.div 
            className="flex-1 relative group"
            whileHover={{ scale: 1.01 }}
          >
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 group-hover:text-purple-500 transition-colors" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-700 focus:border-purple-500 rounded-2xl shadow-lg text-base transition-all"
            />
          </motion.div>

          {/* Filter Tabs */}
          {user?.role === "student" && (
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { key: "all", label: "All", icon: Target },
                { key: "pending", label: "Pending", icon: Clock },
                { key: "submitted", label: "Submitted", icon: CheckCircle },
                { key: "graded", label: "Graded", icon: Award },
              ].map(({ key, label, icon: Icon }) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={filter === key ? "default" : "outline"}
                    onClick={() => setFilter(key as any)}
                    className={
                      filter === key
                        ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full px-6 h-12 shadow-lg whitespace-nowrap border-0 font-medium"
                        : "rounded-full px-6 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-700 whitespace-nowrap font-medium transition-all"
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Assignments List - Grouped by Classroom/Subject */}
        <AnimatePresence mode="wait">
          {filteredAssignments.length === 0 ? (
            <EmptyState isTeacher={user?.role === "teacher"} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {Object.entries(groupedAssignments).map(([classroomName, classroomAssignments], groupIndex) => (
                <motion.div
                  key={classroomName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="space-y-4"
                >
                  {/* Subject/Classroom Header */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIndex * 0.1 + 0.1 }}
                    className="flex items-center gap-3 px-2"
                  >
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {classroomName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {classroomAssignments.length} {classroomAssignments.length === 1 ? 'assignment' : 'assignments'}
                      </p>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-700" />
                  </motion.div>

                  {/* Assignments in this classroom */}
                  <div className="grid gap-6">
                    {classroomAssignments.map((assignment, index) => {
                const statusInfo = getStatusInfo(assignment);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group"
                  >
                    <div className="relative rounded-[2rem] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 overflow-hidden">
                      {/* Accent Bar - Thicker and more prominent */}
                      <div
                        className={`h-1.5 bg-gradient-to-r ${statusInfo.color}`}
                      />
                      
                      {/* Subtle glow effect on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${statusInfo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />

                      {/* Header Section */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className={`p-2 rounded-lg bg-gradient-to-r ${statusInfo.color}`}
                              >
                                <StatusIcon className="h-5 w-5 text-white" />
                              </motion.div>
                              <h3 className="text-2xl font-semibold group-hover:text-purple-600 transition-colors">
                                {assignment.title}
                              </h3>
                            </div>

                            {assignment.classroomName && (
                              <Badge variant="outline" className="mb-2">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {assignment.classroomName}
                              </Badge>
                            )}

                            <p className="text-base text-muted-foreground">
                              {assignment.description || "No description provided"}
                            </p>
                          </div>

                          <Badge
                            className={`bg-gradient-to-r ${statusInfo.color} text-white border-0 whitespace-nowrap`}
                          >
                            {statusInfo.text}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="px-6 pb-4">
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            {assignment.points} points
                          </div>
                          {assignment.submittedAt && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Submitted {new Date(assignment.submittedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {/* Progress bar for graded assignments */}
                        {assignment.submissionStatus === "graded" && assignment.grade !== undefined && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Your Score</span>
                              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {assignment.grade}/{assignment.points}
                              </span>
                            </div>
                            <Progress
                              value={(assignment.grade / assignment.points) * 100}
                              className="h-3"
                            />
                          </div>
                        )}
                      </div>

                      {/* Footer Section */}
                      <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-b-[2rem] flex justify-between gap-2">
                        {user?.role === "student" && (
                          <>
                            {assignment.submissionStatus === "submitted" ? (
                              <div className="flex-1 flex items-center justify-center gap-3 py-2 px-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </motion.div>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                    ✨ Submitted Successfully!
                                  </span>
                                  <span className="text-xs text-green-600 dark:text-green-400">
                                    Waiting for review
                                  </span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="ml-auto rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            ) : assignment.submissionStatus === "graded" ? (
                              <div className="flex-1 flex items-center justify-center gap-3 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-700">
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </motion.div>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                    🎉 Graded!
                                  </span>
                                  <span className="text-xs text-purple-600 dark:text-purple-400">
                                    Score: {assignment.grade}/{assignment.points} points
                                  </span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="ml-auto rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            ) : (
                              <Dialog
                                open={submitDialogOpen && selectedAssignment?._id === assignment._id}
                                onOpenChange={(open) => {
                                  setSubmitDialogOpen(open);
                                  if (open) setSelectedAssignment(assignment);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  >
                                    {submitting === assignment._id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Submitting...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Submit Assignment
                                      </>
                                    )}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl rounded-3xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                      Submit Assignment
                                    </DialogTitle>
                                    <DialogDescription>
                                      {assignment.title}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="submission-text">Your Work *</Label>
                                      <Textarea
                                        id="submission-text"
                                        placeholder="Describe your solution or paste your code here..."
                                        rows={6}
                                        className="rounded-xl"
                                        value={submission.text}
                                        onChange={(e) =>
                                          setSubmission({ ...submission, text: e.target.value })
                                        }
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="submission-file">Attach File (Optional)</Label>
                                      <Input
                                        id="submission-file"
                                        type="file"
                                        className="rounded-xl"
                                        onChange={(e) =>
                                          setSubmission({
                                            ...submission,
                                            file: e.target.files?.[0] || null,
                                          })
                                        }
                                      />
                                      {submission.file && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          {submission.file.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      className="rounded-xl"
                                      onClick={() => setSubmitDialogOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => handleSubmitAssignment(assignment._id)}
                                      disabled={submitting === assignment._id || !submission.text}
                                      className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600"
                                    >
                                      {submitting === assignment._id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Submitting...
                                        </>
                                      ) : (
                                        <>
                                          <Check className="h-4 w-4 mr-2" />
                                          Submit
                                        </>
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        )}

                        {user?.role === "teacher" && (
                          <div className="flex gap-2 flex-1">
                            <Button
                              variant="outline"
                              className="flex-1 rounded-xl"
                              onClick={() => router.push(`/dashboard/classrooms/${assignment.classroomId}`)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              View Submissions
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-xl">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-xl text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}