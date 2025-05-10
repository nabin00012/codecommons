"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { assignmentService, type Assignment } from "@/lib/services/assignment";
import { authService } from "@/lib/services/auth";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function AssignmentsListPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const classroomId = params.id as string;
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const assignmentsData = await assignmentService.getAssignments(
          classroomId
        );
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load assignments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [classroomId, toast, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Assignments</h1>
          {isTeacher && (
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/classrooms/${classroomId}/assignments/new`
                )
              }
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </Button>
          )}
        </div>

        {assignments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assignments Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                {isTeacher
                  ? "Create your first assignment to get started"
                  : "There are no assignments available yet"}
              </p>
              {isTeacher && (
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/classrooms/${classroomId}/assignments/new`
                    )
                  }
                >
                  Create Assignment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <Link
                key={assignment._id}
                href={`/dashboard/classrooms/${classroomId}/assignments/${assignment._id}`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {assignment.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {assignment.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Due{" "}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{assignment.points} points</span>
                      </div>
                    </div>
                    {isStudent && (
                      <Badge variant="default" className="mt-4">
                        Not Submitted
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
