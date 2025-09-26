"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Plus,
  Calendar,
  Upload,
  Video,
  File,
  Link as LinkIcon,
  Send,
} from "lucide-react";
import Link from "next/link";

interface Classroom {
  _id: string;
  name: string;
  description: string;
  code: string;
  department: string;
  instructor: any;
  students: string[];
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
}

interface Material {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadedOn: string;
  content?: string;
}

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: any[];
}

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: "100",
  });
  
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    content: "",
    type: "document",
  });
  
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
  });

  const classroomId = params.id as string;
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classroom details
        const classroomResponse = await fetch(`/api/classrooms/${classroomId}`, {
          credentials: "include",
        });
        
        if (classroomResponse.ok) {
          const classroomData = await classroomResponse.json();
          setClassroom(classroomData.data);
        }

        // Fetch assignments
        const assignmentsResponse = await fetch(`/api/classrooms/${classroomId}/assignments`, {
          credentials: "include",
        });
        
        if (assignmentsResponse.ok) {
          const assignmentsData = await assignmentsResponse.json();
          setAssignments(assignmentsData.data || []);
        }

        // Fetch materials
        const materialsResponse = await fetch(`/api/classrooms/${classroomId}/materials`, {
          credentials: "include",
        });
        
        if (materialsResponse.ok) {
          const materialsData = await materialsResponse.json();
          setMaterials(materialsData.data || []);
        }

      } catch (error) {
        console.error("Error fetching classroom data:", error);
        toast({
          title: "Error",
          description: "Failed to load classroom data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchData();
    }
  }, [classroomId, toast]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/classrooms/${classroomId}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(prev => [data.data, ...prev]);
        setNewAssignment({ title: "", description: "", dueDate: "", points: "100" });
        setShowAssignmentForm(false);
        toast({
          title: "Success",
          description: "Assignment created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/classrooms/${classroomId}/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newMaterial),
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials(prev => [data.data, ...prev]);
        setNewMaterial({ title: "", content: "", type: "document" });
        setShowMaterialForm(false);
        toast({
          title: "Success",
          description: "Material uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Error uploading material:", error);
      toast({
        title: "Error",
        description: "Failed to upload material",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Classroom not found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              The classroom you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/classrooms">Back to Classrooms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/classrooms">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Classrooms
              </Link>
            </Button>
            <Badge variant="outline">{classroom.code}</Badge>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {classroom.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {classroom.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {classroom.students.length} students
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {classroom.department.toUpperCase()}
                </div>
              </div>
            </div>
            
            {isTeacher && (
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-2">Classroom Code</p>
                <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {classroom.code}
                </p>
                <p className="text-xs text-gray-500">Share with students</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                  <Calendar className="h-4 w-4 ml-auto text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assignments.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                  <FileText className="h-4 w-4 ml-auto text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{materials.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students Enrolled</CardTitle>
                  <Users className="h-4 w-4 ml-auto text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classroom.students.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Classroom activity will appear here as students and teachers interact.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Assignments</h2>
              {isTeacher && (
                <Button onClick={() => setShowAssignmentForm(!showAssignmentForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              )}
            </div>

            {/* Create Assignment Form */}
            {showAssignmentForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAssignment} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Assignment title"
                        value={newAssignment.title}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Assignment description and instructions"
                        value={newAssignment.description}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="datetime-local"
                          value={newAssignment.dueDate}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Points"
                          value={newAssignment.points}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, points: e.target.value }))}
                          min="1"
                          max="1000"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Create Assignment</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAssignmentForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Assignments List */}
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No assignments yet</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isTeacher ? "Create your first assignment" : "No assignments posted yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Card key={assignment._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle>{assignment.title}</CardTitle>
                        <Badge variant="outline">{assignment.points} pts</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {assignment.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(assignment.dueDate).toLocaleString()}
                        </div>
                        <Button size="sm">
                          {isTeacher ? "Manage" : "Submit"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Study Materials</h2>
              {isTeacher && (
                <Button onClick={() => setShowMaterialForm(!showMaterialForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              )}
            </div>

            {/* Upload Material Form */}
            {showMaterialForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Study Material</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUploadMaterial} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Material title"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={newMaterial.type}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="document">📄 Document/PDF</option>
                        <option value="video">🎥 Video Resource</option>
                        <option value="link">🔗 External Link</option>
                        <option value="code">💻 Code Sample</option>
                      </select>
                    </div>
                    <div>
                      <Textarea
                        placeholder={
                          newMaterial.type === "video" ? "Video URL or embed code" :
                          newMaterial.type === "link" ? "External link URL" :
                          newMaterial.type === "code" ? "Code content" :
                          "Document content or description"
                        }
                        value={newMaterial.content}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, content: e.target.value }))}
                        rows={6}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Add Material</Button>
                      <Button type="button" variant="outline" onClick={() => setShowMaterialForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Materials List */}
            {materials.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No materials yet</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isTeacher ? "Upload study materials for your students" : "Materials will appear here when uploaded"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((material) => (
                  <Card key={material.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <div className="text-right">
                          {material.type === "video" && <Video className="h-5 w-5 text-red-500" />}
                          {material.type === "document" && <File className="h-5 w-5 text-blue-500" />}
                          {material.type === "link" && <LinkIcon className="h-5 w-5 text-green-500" />}
                          {material.type === "code" && <FileText className="h-5 w-5 text-purple-500" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-2">
                        Uploaded: {new Date(material.uploadedOn).toLocaleDateString()}
                      </p>
                      <Button size="sm" className="w-full">
                        View Material
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Class Discussions</h2>
              <Button onClick={() => setShowDiscussionForm(!showDiscussionForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </div>

            {/* Create Discussion Form */}
            {showDiscussionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Start a Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Input
                        placeholder="Discussion topic"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="What would you like to discuss?"
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Send className="h-4 w-4 mr-2" />
                        Post Discussion
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowDiscussionForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Discussions List */}
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No discussions yet</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start the first discussion in this classroom!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}