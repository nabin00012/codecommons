"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Mail, Calendar, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/lib/services/auth";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { useUser } from "@/lib/context/user-context";

interface Student {
  _id: string;
  name: string;
  email: string;
  joinDate: string;
  points: number;
  solutions: number;
  questions: number;
}

export default function ClassroomStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/classrooms/${params.id}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "Failed to load students. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [params.id, toast, router]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="gap-2 mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classroom
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Classmates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search classmates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card key={student._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {student.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Joined{" "}
                              {new Date(student.joinDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {student.points}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Points
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {student.solutions}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Solutions
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {student.questions}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Questions
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            router.push(
                              `/dashboard/classrooms/${params.id}/students/${student._id}`
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No students found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
