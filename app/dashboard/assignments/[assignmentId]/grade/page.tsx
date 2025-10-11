"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  User,
  Calendar,
  Send,
  Download,
  Eye,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Submission {
  _id: string;
  studentEmail: string;
  studentName: string;
  content: string;
  fileName?: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: "submitted" | "graded";
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  classroomName?: string;
}

export default function TeacherGradingPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    grade: "",
    feedback: "",
  });
  const [filter, setFilter] = useState<"all" | "submitted" | "graded">("all");

  useEffect(() => {
    if (user?.role !== "teacher") {
      router.push("/dashboard");
      return;
    }
    fetchData();
  }, [user, assignmentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assignment details
      const assignmentRes = await fetch(`/api/assignments`, {
        credentials: "include",
      });

      if (assignmentRes.ok) {
        const data = await assignmentRes.json();
        const assignments = data.assignments || data.data || [];
        const foundAssignment = assignments.find(
          (a: any) => a._id === assignmentId
        );
        if (foundAssignment) {
          setAssignment(foundAssignment);
        }
      }

      // Fetch submissions
      const submissionsRes = await fetch(
        `/api/assignments/${assignmentId}/submissions`,
        {
          credentials: "include",
        }
      );

      if (submissionsRes.ok) {
        const data = await submissionsRes.json();
        setSubmissions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGradeClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      grade: submission.grade?.toString() || "",
      feedback: submission.feedback || "",
    });
    setGradeDialogOpen(true);
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission || !gradeForm.grade) {
      toast({
        title: "Missing Information",
        description: "Please provide a grade",
        variant: "destructive",
      });
      return;
    }

    setGrading(selectedSubmission._id);

    try {
      const response = await fetch(
        `/api/assignments/${assignmentId}/submissions/${selectedSubmission._id}/grade`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            grade: Number(gradeForm.grade),
            feedback: gradeForm.feedback,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "✨ Graded Successfully!",
          description: `Gave ${gradeForm.grade}/${assignment?.points} to ${selectedSubmission.studentName}`,
        });
        setGradeDialogOpen(false);

        // Update local state
        setSubmissions((prev) =>
          prev.map((s) =>
            s._id === selectedSubmission._id
              ? {
                  ...s,
                  grade: Number(gradeForm.grade),
                  feedback: gradeForm.feedback,
                  status: "graded" as const,
                }
              : s
          )
        );

        // Fetch fresh data
        setTimeout(() => fetchData(), 500);
      } else {
        throw new Error("Failed to grade submission");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save grade",
        variant: "destructive",
      });
    } finally {
      setGrading(null);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    return sub.status === filter;
  });

  const stats = {
    total: submissions.length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    graded: submissions.filter((s) => s.status === "graded").length,
    avgGrade:
      submissions.filter((s) => s.grade !== undefined).length > 0
        ? (
            submissions
              .filter((s) => s.grade !== undefined)
              .reduce((acc, s) => acc + (s.grade || 0), 0) /
            submissions.filter((s) => s.grade !== undefined).length
          ).toFixed(1)
        : "N/A",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-indigo-950/10 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-indigo-950/10 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Assignment Not Found</h2>
            <Button onClick={() => router.push("/dashboard/assignments")}>
              Back to Assignments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-indigo-950/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/assignments")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Grade Submissions
            </h1>
            <p className="text-muted-foreground mt-1">{assignment.title}</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Total",
              value: stats.total,
              icon: FileText,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Pending",
              value: stats.submitted,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
            },
            {
              label: "Graded",
              value: stats.graded,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Avg Grade",
              value: stats.avgGrade,
              icon: Award,
              color: "from-purple-500 to-pink-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
                />
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 flex-wrap"
        >
          {[
            { key: "all", label: "All", icon: FileText },
            { key: "submitted", label: "Pending", icon: Clock },
            { key: "graded", label: "Graded", icon: CheckCircle },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key as any)}
              className={
                filter === key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6"
                  : "rounded-full px-6"
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </motion.div>

        {/* Submissions List */}
        <AnimatePresence mode="wait">
          {filteredSubmissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <FileText className="h-20 w-20 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground">
                {filter === "all"
                  ? "Students haven't submitted any work yet"
                  : `No ${filter} submissions found`}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <Card className="relative overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        submission.status === "graded"
                          ? "from-green-500 to-emerald-500"
                          : "from-yellow-500 to-orange-500"
                      }`}
                    />
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1">
                              {submission.studentName}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {submission.studentEmail}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(
                                  submission.submittedAt
                                ).toLocaleDateString()}
                              </div>
                              {submission.fileName && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {submission.fileName}
                                </div>
                              )}
                            </div>
                            {submission.status === "graded" && (
                              <div className="mt-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="font-semibold">
                                    {submission.grade}/{assignment.points}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (submission.grade! / assignment.points) *
                                    100
                                  }
                                  className="h-2"
                                />
                                {submission.feedback && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">
                                    "{submission.feedback}"
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              submission.status === "graded"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              submission.status === "graded"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                            }
                          >
                            {submission.status === "graded"
                              ? "Graded"
                              : "Pending"}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleGradeClick(submission)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Award className="h-4 w-4 mr-1" />
                            {submission.status === "graded"
                              ? "Update Grade"
                              : "Grade"}
                          </Button>
                        </div>
                      </div>

                      {submission.content && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm font-medium flex items-center gap-2 hover:text-primary">
                            <Eye className="h-4 w-4" />
                            View Submission Content
                          </summary>
                          <div className="mt-2 p-4 bg-muted/50 rounded-lg border">
                            <pre className="text-sm whitespace-pre-wrap break-words">
                              {submission.content}
                            </pre>
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grading Dialog */}
        <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Grade Submission
              </DialogTitle>
              <DialogDescription>
                {selectedSubmission?.studentName} - {assignment.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedSubmission?.content && (
                <div className="space-y-2">
                  <Label>Student's Work</Label>
                  <div className="max-h-60 overflow-y-auto p-4 bg-muted/50 rounded-xl border">
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {selectedSubmission.content}
                    </pre>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="grade">
                  Grade (out of {assignment.points}) *
                </Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max={assignment.points}
                  placeholder={`0 - ${assignment.points}`}
                  value={gradeForm.grade}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, grade: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback to the student..."
                  rows={4}
                  value={gradeForm.feedback}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, feedback: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setGradeDialogOpen(false)}
                disabled={grading !== null}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGradeSubmit}
                disabled={grading !== null || !gradeForm.grade}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {grading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Save Grade
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
