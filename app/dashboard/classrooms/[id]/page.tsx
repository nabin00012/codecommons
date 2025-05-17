"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import {
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Download,
  Calendar,
  Upload,
  Settings,
  Share2,
  Bell,
  BellOff,
  ArrowLeft,
  Clock,
  Plus,
  Loader2,
  School,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { ClassroomService, type Classroom } from "@/lib/services/classroom";
import { assignmentService, type Assignment } from "@/lib/services/assignment";
import { authService } from "@/lib/services/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardFooter } from "@/components/ui/card";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  console.log("Current user:", user);

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const classroomId = params.id as string;

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";
  const isEnrolled =
    isStudent &&
    classroom &&
    classroom.students.some((s) => s._id === user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        // Validate classroom ID
        if (!classroomId) {
          console.error("Missing classroom ID");
          toast({
            title: "Error",
            description: "Invalid classroom ID",
            variant: "destructive",
          });
          router.push("/dashboard/classrooms");
          return;
        }

        console.log("Fetching classroom data for ID:", classroomId);
        const classroomServiceInstance = new ClassroomService(token);

        // First fetch classroom data
        const classroomData = await classroomServiceInstance.getClassroom(
          classroomId
        );
        console.log("Classroom data fetched:", classroomData);
        setClassroom(classroomData);

        // Then fetch assignments
        console.log("Fetching assignments for classroom:", classroomId);
        const assignmentsData = await assignmentService.getAssignments(
          classroomId
        );
        console.log("Assignments data fetched:", assignmentsData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching classroom data:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load classroom data. Please try again.",
          variant: "destructive",
        });
        // Redirect back to classrooms list on error
        router.push("/dashboard/classrooms");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [classroomId, toast, router]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const classroomServiceInstance = new ClassroomService(token);
      await classroomServiceInstance.enrollStudent(classroomId);
      toast({
        title: "Enrolled!",
        description: "You have joined the classroom.",
      });
      // Refresh classroom data
      const classroomData = await classroomServiceInstance.getClassroom(
        classroomId
      );
      setClassroom(classroomData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) {
      toast({
        title: "Error",
        description: "Please provide both a file and a title",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Uploading file:", {
        file: uploadFile,
        title: uploadTitle,
        size: uploadFile.size,
        type: uploadFile.type,
      });

      const classroomServiceInstance = new ClassroomService(token);
      const material = await classroomServiceInstance.uploadMaterial(
        classroomId,
        uploadFile,
        uploadTitle
      );

      console.log("Upload successful:", material);

      // Refresh classroom data to show the new material
      const classroomData = await classroomServiceInstance.getClassroom(
        classroomId
      );
      setClassroom(classroomData);

      toast({
        title: "Success",
        description: "Material uploaded successfully",
      });
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload material",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (materialId: string) => {
    try {
      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const classroomServiceInstance = new ClassroomService(token);
      const blob = await classroomServiceInstance.downloadMaterial(
        classroomId,
        materialId
      );

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        classroom?.materials.find((m) => m.id === materialId)?.title ||
        "material";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download material",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Classroom not found</h1>
        <p className="text-muted-foreground mb-6">
          The classroom you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/dashboard/classrooms")}>
          Back to Classrooms
        </Button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <Link
          href="/dashboard/classrooms"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Classrooms
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {classroom.code}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {classroom.semester}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{classroom.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={classroom.instructor.avatar}
                    alt={classroom.instructor.name}
                  />
                  <AvatarFallback>
                    {classroom.instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {classroom.instructor.name} •{" "}
                  {classroom.instructor.department}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              {isStudent && !isEnrolled && (
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="ml-2"
                >
                  {enrolling ? "Enrolling..." : "Enroll"}
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">{classroom.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{classroom.students.length} students</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{assignments.length} assignments</span>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Materials</span>
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Q&A</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Course Materials</h2>
              {isTeacher && (
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Material
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              {classroom.materials.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Materials Yet
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {isTeacher
                        ? "Upload your first material to get started"
                        : "There are no materials available yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                classroom.materials.map((material, index) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{material.title}</h3>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>{material.type.toUpperCase()}</span>
                              <span>{material.size}</span>
                              <span>Uploaded on {material.uploadedOn}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(material.id)}
                          className="text-primary"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assignments</h2>
              {isTeacher && (
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/classrooms/${classroomId}/assignments/new`
                    )
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              )}
            </div>

            {Array.isArray(assignments) && assignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
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
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{assignment.points} points</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Assignments Yet
                  </h3>
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
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Students</h2>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  router.push(`/dashboard/classrooms/${params.id}/students`)
                }
              >
                <Eye className="h-4 w-4" />
                View All Students
              </Button>
            </div>

            <div className="grid gap-4">
              {classroom.students.slice(0, 5).map((student) => (
                <Card key={student._id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {student.name[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
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
                        Inspect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {classroom.students.length > 5 && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() =>
                    router.push(`/dashboard/classrooms/${params.id}/students`)
                  }
                >
                  <Plus className="h-4 w-4" />
                  View {classroom.students.length - 5} More Students
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Material Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Upload Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Enter material title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadFile(null);
                    setUploadTitle("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !uploadFile || !uploadTitle}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
