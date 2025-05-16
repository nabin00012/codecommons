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
                  {subjectGroup.assignments.length === 0 ? (
                    <Card className="cosmic-card">
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground">
                          No assignments till now.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subjectGroup.assignments.map((assignment) => {
                        const status = getAssignmentStatus(assignment);
                        const progress = getAssignmentProgress(assignment);

                        return (
                          <Card key={assignment._id} className="cosmic-card">
                            <CardHeader>
                              <CardTitle>{assignment.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground">
                                {assignment.description}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
