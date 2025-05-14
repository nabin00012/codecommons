"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { ArrowLeft, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { assignmentService, type Assignment } from "@/lib/services/assignment";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { authService } from "@/lib/services/auth";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/constants";
import { ClassroomService } from "@/lib/services/classroom";

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [grading, setGrading] = useState<{
    [key: string]: { grade: string; feedback: string; loading: boolean };
  }>({});
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState<{ [key: number]: string }>({});
  const [qaLoading, setQaLoading] = useState(false);

  const classroomId = params.id as string;
  const assignmentId = params.assignmentId as string;
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // Validate required parameters
        if (!classroomId || !assignmentId) {
          console.error("Missing required parameters:", {
            classroomId,
            assignmentId,
          });
          toast({
            title: "Error",
            description: "Invalid classroom or assignment ID",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }

        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        console.log("Fetching assignment details:", {
          classroomId,
          assignmentId,
          url: `${API_URL}/api/classrooms/${classroomId}/assignments/${assignmentId}`,
        });

        // First verify we can access the classroom
        const classroomServiceInstance = new ClassroomService(token);
        try {
          const classroomData = await classroomServiceInstance.getClassroom(
            classroomId
          );
          console.log("Classroom access verified:", classroomData);
        } catch (error) {
          console.error("Error accessing classroom:", error);
          toast({
            title: "Error",
            description: "You don't have access to this classroom",
            variant: "destructive",
          });
          router.push("/dashboard/classrooms");
          return;
        }

        // Then fetch the assignment
        const assignmentData = await assignmentService.getAssignment(
          classroomId,
          assignmentId
        );

        console.log("Assignment data received:", assignmentData);

        // Verify the assignment belongs to the correct classroom
        if (assignmentData.classroom !== classroomId) {
          console.error("Assignment classroom mismatch:", {
            expected: classroomId,
            actual: assignmentData.classroom,
          });
          toast({
            title: "Error",
            description: "Assignment not found in this classroom",
            variant: "destructive",
          });
          router.push(`/dashboard/classrooms/${classroomId}`);
          return;
        }

        setAssignment(assignmentData);
        if (assignmentData.codeTemplate) {
          setCode(assignmentData.codeTemplate);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load assignment. Please try again.",
          variant: "destructive",
        });
        // Redirect back to classroom page on error
        router.push(`/dashboard/classrooms/${classroomId}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [classroomId, assignmentId, toast, router]);

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Assignment not found</h1>
        <p className="text-muted-foreground mb-6">
          The assignment you're looking for doesn't exist or you don't have
          access to it.
        </p>
        <Button
          onClick={() => router.push(`/dashboard/classrooms/${classroomId}`)}
        >
          Back to Classroom
        </Button>
      </div>
    );
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    try {
      setIsSubmitting(true);

      if (assignment.submissionType === "file" && !selectedFile) {
        toast({
          title: "Error",
          description: "Please select a file to submit",
          variant: "destructive",
        });
        return;
      }

      if (assignment.submissionType === "code" && !code.trim()) {
        toast({
          title: "Error",
          description: "Please enter your code submission",
          variant: "destructive",
        });
        return;
      }

      console.log("Preparing submission:", {
        type: assignment.submissionType,
        hasFile: !!selectedFile,
        fileSize: selectedFile?.size,
        contentLength: code.length,
      });

      const submissionData = {
        content: code,
        ...(selectedFile && { file: selectedFile }),
      };

      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const result = await assignmentService.submitAssignment(
        assignment._id,
        submissionData,
        classroomId
      );

      console.log("Submission result:", result);

      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      });
      setCode("");
      setSelectedFile(null);

      // Refresh assignment data
      const updatedAssignment = await assignmentService.getAssignment(
        classroomId,
        assignment._id
      );
      setAssignment(updatedAssignment);

      router.push(`/dashboard/classrooms/${classroomId}`);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      if (error instanceof Error) {
        if (error.message.includes("File size exceeds")) {
          toast({
            title: "Error",
            description: "File size exceeds 20MB limit",
            variant: "destructive",
          });
        } else if (error.message.includes("already submitted")) {
          toast({
            title: "Error",
            description: "You have already submitted this assignment",
            variant: "destructive",
          });
        } else if (error.message.includes("Not authorized")) {
          toast({
            title: "Error",
            description: "You are not authorized to submit this assignment",
            variant: "destructive",
          });
        } else if (error.message.includes("Invalid file type")) {
          toast({
            title: "Error",
            description:
              "The file type is not supported. Please use PDF, Word, PowerPoint, Excel, Text, or Image files.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to submit assignment",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle grading submission
  const handleGrade = async (submissionIdx: number, submissionId: string) => {
    setGrading((prev) => ({
      ...prev,
      [submissionId]: { ...prev[submissionId], loading: true },
    }));
    try {
      const grade = grading[submissionId]?.grade || "";
      const feedback = grading[submissionId]?.feedback || "";
      await assignmentService.gradeSubmission(submissionId, {
        grade: Number(grade),
        feedback,
      });
      toast({
        title: "Graded!",
        description: "Grade and feedback saved.",
      });
      // Refresh assignment data
      const data = await assignmentService.getAssignment(
        classroomId,
        assignmentId
      );
      setAssignment(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save grade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGrading((prev) => ({
        ...prev,
        [submissionId]: { ...prev[submissionId], loading: false },
      }));
    }
  };

  // Helper to get student name (if available)
  const getStudentName = (studentId: any) => {
    if (!studentId) return "Unknown";
    if (typeof studentId === "object" && studentId.name) return studentId.name;
    return studentId.toString();
  };

  // Find the current student's submission
  const studentSubmission =
    !isTeacher && assignment.submissions
      ? assignment.submissions.find((sub) => sub.studentId === user?.id)
      : null;

  // Post a new question
  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    setQaLoading(true);
    try {
      await assignmentService.postQuestion(
        classroomId,
        assignmentId,
        newQuestion
      );
      toast({ title: "Question posted!" });
      setNewQuestion("");
      // Refresh assignment data
      const data = await assignmentService.getAssignment(
        classroomId,
        assignmentId
      );
      setAssignment(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post question.",
        variant: "destructive",
      });
    } finally {
      setQaLoading(false);
    }
  };

  // Post a new answer
  const handleAnswer = async (qIdx: number) => {
    if (!newAnswer[qIdx]?.trim()) return;
    setQaLoading(true);
    try {
      await assignmentService.postAnswer(
        classroomId,
        assignmentId,
        qIdx,
        newAnswer[qIdx]
      );
      toast({ title: "Answer posted!" });
      setNewAnswer((prev) => ({ ...prev, [qIdx]: "" }));
      // Refresh assignment data
      const data = await assignmentService.getAssignment(
        classroomId,
        assignmentId
      );
      setAssignment(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post answer.",
        variant: "destructive",
      });
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <Link
          href={`/dashboard/classrooms/${classroomId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Classroom
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Due {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{assignment.points} points</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Type: {assignment.submissionType}</span>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            {/* Teacher view: List of submissions */}
            {isTeacher &&
              assignment.submissions &&
              assignment.submissions.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Student Submissions
                  </h2>
                  <div className="space-y-4">
                    {assignment.submissions.map((submission, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="font-medium">
                              Student: {getStudentName(submission.studentId)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Submitted:{" "}
                              {submission.submittedAt
                                ? new Date(
                                    submission.submittedAt
                                  ).toLocaleString()
                                : "-"}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm">
                              <span className="font-semibold">Status:</span>{" "}
                              {submission.status}
                            </div>
                            <form
                              className="flex flex-col gap-2 mt-2"
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await handleGrade(
                                  idx,
                                  submission._id || idx.toString()
                                );
                              }}
                            >
                              <div className="flex gap-2 items-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={assignment.points}
                                  placeholder="Grade"
                                  className="border rounded px-2 py-1 w-20"
                                  value={
                                    grading[submission._id]?.grade ??
                                    submission.grade ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    setGrading((prev) => ({
                                      ...prev,
                                      [submission._id]: {
                                        ...prev[submission._id],
                                        grade: e.target.value,
                                        feedback:
                                          prev[submission._id]?.feedback ??
                                          submission.feedback ??
                                          "",
                                        loading: false,
                                      },
                                    }))
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder="Feedback"
                                  className="border rounded px-2 py-1 w-48"
                                  value={
                                    grading[submission._id]?.feedback ??
                                    submission.feedback ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    setGrading((prev) => ({
                                      ...prev,
                                      [submission._id]: {
                                        ...prev[submission._id],
                                        grade:
                                          prev[submission._id]?.grade ??
                                          submission.grade ??
                                          "",
                                        feedback: e.target.value,
                                        loading: false,
                                      },
                                    }))
                                  }
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={grading[submission._id]?.loading}
                                >
                                  {grading[submission._id]?.loading
                                    ? "Saving..."
                                    : "Save"}
                                </Button>
                              </div>
                            </form>
                            {submission.grade !== undefined && (
                              <div className="text-sm">
                                <span className="font-semibold">Grade:</span>{" "}
                                {submission.grade}
                              </div>
                            )}
                            {submission.feedback && (
                              <div className="text-sm">
                                <span className="font-semibold">Feedback:</span>{" "}
                                {submission.feedback}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="font-semibold mb-1">Submission:</div>
                          <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border border-border">
                            {submission.content || "(No content)"}
                          </pre>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {assignment.description
                        .split("\n\n")
                        .map((paragraph, index) => {
                          if (paragraph.startsWith("##")) {
                            return (
                              <h2
                                key={index}
                                className="text-xl font-bold mt-6 mb-3"
                              >
                                {paragraph.replace("##", "").trim()}
                              </h2>
                            );
                          } else if (paragraph.startsWith("-")) {
                            return (
                              <ul key={index} className="list-disc pl-6 my-3">
                                {paragraph.split("\n").map((item, i) => (
                                  <li key={i}>
                                    {item.replace("-", "").trim()}
                                  </li>
                                ))}
                              </ul>
                            );
                          } else if (paragraph.startsWith("1.")) {
                            return (
                              <ol
                                key={index}
                                className="list-decimal pl-6 my-3"
                              >
                                {paragraph.split("\n").map((item, i) => {
                                  const match = item.match(/^\d+\.\s(.+)/);
                                  return match ? (
                                    <li key={i}>{match[1]}</li>
                                  ) : null;
                                })}
                              </ol>
                            );
                          } else {
                            return (
                              <p key={index} className="mb-4">
                                {paragraph}
                              </p>
                            );
                          }
                        })}
                    </div>
                  </CardContent>
                </Card>

                {!isTeacher && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Assignment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {assignment.submissionType === "file" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            File Submission
                          </label>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-md cursor-pointer hover:bg-muted/50"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                              />
                            </div>
                            {selectedFile && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Selected file: {selectedFile.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedFile(null)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                            {!selectedFile && (
                              <p className="text-sm text-muted-foreground">
                                Please select a file to submit. Supported
                                formats: PDF, Word, PowerPoint, Excel, Text,
                                Images
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {assignment.submissionType === "code" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Code Submission
                          </label>
                          <textarea
                            value={code}
                            onChange={handleCodeChange}
                            className="w-full h-48 p-2 border rounded-md"
                            placeholder="Write your code here..."
                          />
                        </div>
                      )}
                      <Button
                        onClick={handleSubmit}
                        disabled={
                          isSubmitting ||
                          (assignment.submissionType === "file" &&
                            !selectedFile) ||
                          (assignment.submissionType === "code" && !code.trim())
                        }
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Assignment"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Student view: Show their own submission, grade, and feedback */}
                {!isTeacher && studentSubmission && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Your Submission</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <span className="font-semibold">Status:</span>{" "}
                        {studentSubmission.status}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Submitted:</span>{" "}
                        {studentSubmission.submittedAt
                          ? new Date(
                              studentSubmission.submittedAt
                            ).toLocaleString()
                          : "-"}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Grade:</span>{" "}
                        {studentSubmission.grade !== undefined
                          ? studentSubmission.grade
                          : "Not graded yet"}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Feedback:</span>{" "}
                        {studentSubmission.feedback || "No feedback yet"}
                      </div>
                      <div className="font-semibold mb-1">Your Answer:</div>
                      <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border border-border">
                        {studentSubmission.content || "(No content)"}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="qa">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Q&A</h2>
              {/* Ask a question */}
              {!isTeacher && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 flex-1 bg-background text-foreground"
                    placeholder="Ask a question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    disabled={qaLoading}
                  />
                  <Button onClick={handleAskQuestion} disabled={qaLoading}>
                    Ask
                  </Button>
                </div>
              )}
              {/* List questions and answers */}
              {assignment.questions && assignment.questions.length > 0 ? (
                assignment.questions.map((q, qIdx) => (
                  <Card key={qIdx} className="p-4">
                    <div className="mb-2">
                      <span className="font-semibold">Q:</span> {q.question}
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Asked by{" "}
                        {q.student?.name ||
                          q.student?.toString?.() ||
                          "Student"}{" "}
                        on{" "}
                        {q.createdAt
                          ? new Date(q.createdAt).toLocaleDateString()
                          : "-"}
                        )
                      </span>
                    </div>
                    <div className="space-y-2 ml-4">
                      {q.answers && q.answers.length > 0 ? (
                        q.answers.map((a, aIdx) => (
                          <div key={aIdx} className="text-sm">
                            <span className="font-semibold">A:</span> {a.answer}
                            <span className="ml-2 text-xs text-muted-foreground">
                              (by{" "}
                              {a.user?.name || a.user?.toString?.() || "User"}{" "}
                              on{" "}
                              {a.createdAt
                                ? new Date(a.createdAt).toLocaleDateString()
                                : "-"}
                              )
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          No answers yet.
                        </div>
                      )}
                    </div>
                    {/* Answer form for teachers */}
                    {isTeacher && (
                      <form
                        className="flex gap-2 mt-2"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          await handleAnswer(qIdx);
                        }}
                      >
                        <input
                          type="text"
                          className="border rounded px-2 py-1 flex-1 bg-background text-foreground"
                          placeholder="Write an answer..."
                          value={newAnswer[qIdx] || ""}
                          onChange={(e) =>
                            setNewAnswer((prev) => ({
                              ...prev,
                              [qIdx]: e.target.value,
                            }))
                          }
                          disabled={qaLoading}
                        />
                        <Button type="submit" disabled={qaLoading}>
                          Answer
                        </Button>
                      </form>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-muted-foreground">No questions yet.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
