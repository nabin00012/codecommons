"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { ClassroomService, type Classroom } from "@/lib/services/classroom";
import { authService } from "@/lib/services/auth";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  School,
  Users,
  Loader2,
  Plus,
  Calendar,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-muted-foreground">Loading classrooms...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              Classrooms
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {isTeacher
                ? "Manage your teaching spaces"
                : "Access your learning environments"}
            </p>
          </div>
          {isTeacher && (
            <Button
              onClick={() => router.push("/dashboard/classrooms/new")}
              className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              Create Classroom
            </Button>
          )}
        </motion.div>

        {classrooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-dashed bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 p-6 rounded-full mb-8 shadow-lg">
                  <School className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                  No Classrooms Yet
                </h3>
                <p className="text-muted-foreground text-center mb-8 max-w-md text-lg">
                  {isTeacher
                    ? "Create your first classroom to start teaching and managing your students"
                    : "Join a classroom to start learning and collaborating with your peers"}
                </p>
                {isTeacher ? (
                  <Button
                    onClick={() => router.push("/dashboard/classrooms/new")}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Create Classroom
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/dashboard/join")}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <BookOpen className="w-4 h-4" />
                    Join Classroom
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {classrooms.map((classroom, index) => (
              <motion.div
                key={classroom._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/dashboard/classrooms/${classroom._id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/50 group bg-white dark:bg-gray-900">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                          {classroom.name}
                        </CardTitle>
                        <Badge
                          variant={
                            classroom.students.some((s) => s._id === user?.id)
                              ? "default"
                              : "secondary"
                          }
                          className={`ml-2 ${
                            classroom.students.some((s) => s._id === user?.id)
                              ? "bg-gradient-to-r from-green-400 to-emerald-400 dark:from-green-500 dark:to-emerald-500"
                              : "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600"
                          } text-white`}
                        >
                          {classroom.students.some((s) => s._id === user?.id)
                            ? "Enrolled"
                            : "Not Enrolled"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 mb-6">
                        {classroom.description}
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors duration-300">
                          <School className="h-4 w-4 text-blue-400 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300" />
                          <span>{classroom.semester}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors duration-300">
                          <Users className="h-4 w-4 text-blue-400 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300" />
                          <span>{classroom.students.length} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors duration-300">
                          <Calendar className="h-4 w-4 text-blue-400 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300" />
                          <span>
                            Created{" "}
                            {new Date(classroom.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex items-center text-sm text-blue-400 dark:text-blue-300 group-hover:gap-2 transition-all duration-300">
                        <span className="font-medium">View Details</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  );
}
