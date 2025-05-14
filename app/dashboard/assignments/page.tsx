"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { Loader2, BookOpen, Calendar, Clock, FileText } from "lucide-react";
import { assignmentService, type Assignment } from "@/lib/services/assignment";
import { ClassroomService, type Classroom } from "@/lib/services/classroom";
import { authService } from "@/lib/services/auth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

interface SubjectAssignments {
  subject: Classroom;
  assignments: Assignment[];
}

export default function AssignmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [subjectAssignments, setSubjectAssignments] = useState<
    SubjectAssignments[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        // Initialize services with token
        const classroomServiceInstance = new ClassroomService(token);
        const assignmentServiceInstance = assignmentService;

        // Fetch all classrooms
        const classrooms = await classroomServiceInstance.getClassrooms();

        // Fetch assignments for each classroom
        const assignmentsBySubject = await Promise.all(
          classrooms.map(async (classroom) => {
            const assignments = await assignmentServiceInstance.getAssignments(
              classroom._id
            );
            return {
              subject: classroom,
              assignments,
            };
          })
        );

        setSubjectAssignments(assignmentsBySubject);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast({
          title: "Error",
          description: "Failed to load assignments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, toast]);

  const getAssignmentStatus = (assignment: Assignment) => {
    if (!assignment.submissions) return "not-started";
    const userSubmission = assignment.submissions.find(
      (sub) => sub.studentId === user?.id
    );
    if (!userSubmission) return "not-started";
    if (userSubmission.status === "graded") return "completed";
    return "in-progress";
  };

  const getAssignmentProgress = (assignment: Assignment) => {
    if (!assignment.submissions) return 0;
    const userSubmission = assignment.submissions.find(
      (sub) => sub.studentId === user?.id
    );
    if (!userSubmission) return 0;
    if (userSubmission.status === "graded") return 100;
    return 50;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Assignments</h1>

        <div className="grid gap-8">
          {subjectAssignments.map((subjectGroup) => (
            <motion.div
              key={subjectGroup.subject._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl">
                          {subjectGroup.subject.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {subjectGroup.subject.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10">
                      {subjectGroup.assignments.length} Assignments
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {subjectGroup.assignments.map((assignment) => {
                      const status = getAssignmentStatus(assignment);
                      const progress = getAssignmentProgress(assignment);

                      return (
                        <motion.div
                          key={assignment._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-lg">
                                    {assignment.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {assignment.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        Due{" "}
                                        {new Date(
                                          assignment.dueDate
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{assignment.points} points</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-4 w-4" />
                                      <span>{assignment.submissionType}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge
                                    variant={
                                      status === "completed"
                                        ? "default"
                                        : status === "in-progress"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {status === "completed"
                                      ? "Completed"
                                      : status === "in-progress"
                                      ? "In Progress"
                                      : "Not Started"}
                                  </Badge>
                                  <Progress value={progress} className="w-24" />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classrooms/${subjectGroup.subject._id}/assignments/${assignment._id}`
                                      )
                                    }
                                  >
                                    View Assignment
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
