"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { ClassroomService, type Classroom } from "@/lib/services/classroom";
import { authService } from "@/lib/services/auth";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { School, Users, Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function ClassroomsListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const classroomServiceInstance = new ClassroomService(token);
        const classroomsData = await classroomServiceInstance.getClassrooms();
        setClassrooms(classroomsData);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load classrooms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, [toast, router]);

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
          <h1 className="text-2xl font-bold">Classrooms</h1>
          {isTeacher && (
            <Button
              onClick={() => router.push("/dashboard/classrooms/new")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Classroom
            </Button>
          )}
        </div>

        {classrooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <School className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Classrooms Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                {isTeacher
                  ? "Create your first classroom to get started"
                  : "You haven't joined any classrooms yet"}
              </p>
              {isTeacher ? (
                <Button
                  onClick={() => router.push("/dashboard/classrooms/new")}
                >
                  Create Classroom
                </Button>
              ) : (
                <Button onClick={() => router.push("/dashboard/join")}>
                  Join Classroom
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <Link
                key={classroom._id}
                href={`/dashboard/classrooms/${classroom._id}`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {classroom.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {classroom.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <School className="h-4 w-4" />
                        <span>{classroom.semester}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{classroom.students.length} students</span>
                      </div>
                    </div>
                    {isStudent && (
                      <Badge variant="default" className="mt-4">
                        {classroom.students.some((s) => s._id === user?.id)
                          ? "Enrolled"
                          : "Not Enrolled"}
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
