"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  classroomId: string;
  createdAt: string;
}

interface Submission {
  _id: string;
  assignmentId: string;
  studentEmail: string;
  studentName: string;
  content: string;
  fileName?: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: string;
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [submissionContent, setSubmissionContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const assignmentId = params.id as string;
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // Fetch assignment details
        const assignmentResponse = await fetch(
          `/api/assignments/${assignmentId}`,
          {
            credentials: "include",
          }
        );

        if (assignmentResponse.ok) {
          const assignmentData = await assignmentResponse.json();
          setAssignment(assignmentData.data);
        }

        // Fetch student's submission if not teacher
        if (!isTeacher) {
          const submissionResponse = await fetch(
            `/api/assignments/${assignmentId}/submissions`,
            {
              credentials: "include",
            }
          );

          if (submissionResponse.ok) {
            const submissionData = await submissionResponse.json();
            const studentSubmission = submissionData.data?.find(
              (sub: Submission) => sub.studentEmail === user?.email
            );
            if (studentSubmission) {
              setSubmission(studentSubmission);
              setSubmissionContent(studentSubmission.content);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        toast({
          title: "Error",
          description: "Failed to load assignment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId, isTeacher, user?.email, toast]);

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", submissionContent);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch(
        `/api/assignments/${assignmentId}/submissions`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubmission(data.data);
        setSelectedFile(null);
        toast({
          title: "Success",
          description: "Assignment submitted successfully!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to submit assignment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = assignment && new Date(assignment.dueDate) < new Date();
  const isSubmitted = !!submission;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Assignment not found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              The assignment you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/assignments">Back to Assignments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/assignments">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assignments
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {assignment.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {assignment.points} points
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge
                variant={
                  isOverdue
                    ? "destructive"
                    : isSubmitted
                    ? "default"
                    : "secondary"
                }
              >
                {isOverdue ? "Overdue" : isSubmitted ? "Submitted" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {assignment.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Alerts */}
        {isOverdue && !isSubmitted && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              This assignment is overdue. Please submit as soon as possible.
            </AlertDescription>
          </Alert>
        )}

        {isSubmitted && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Assignment submitted on{" "}
              {new Date(submission.submittedAt).toLocaleString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Submission Form (Students only) */}
        {!isTeacher && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {isSubmitted ? "Update Submission" : "Submit Assignment"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Response / Answer
                  </label>
                  <Textarea
                    placeholder="Write your answer or response here..."
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Attach File (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                    />
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {selectedFile.name} (
                      {(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitted
                          ? "Update Submission"
                          : "Submit Assignment"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Submission (if submitted) */}
        {isSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Response
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {submission.content}
                    </p>
                  </div>
                </div>

                {submission.fileName && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Attached File
                    </label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{submission.fileName}</span>
                      {submission.fileUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Submitted:{" "}
                    {new Date(submission.submittedAt).toLocaleString()}
                  </div>
                  <Badge variant="default">{submission.status}</Badge>
                </div>

                {submission.grade && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Grade</span>
                      <Badge variant="default">
                        {submission.grade} / {assignment.points}
                      </Badge>
                    </div>
                    {submission.feedback && (
                      <div>
                        <span className="font-medium">Feedback:</span>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
