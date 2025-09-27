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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  MessageSquare,
  MessageCircle,
  Users,
  Plus,
  Calendar,
  Upload,
  Video,
  File,
  Link as LinkIcon,
  Send,
  Pin,
  Trash2,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Megaphone,
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
  fileName?: string;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  isPinned: boolean;
  createdAt: string;
}

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  authorRole: string;
  replies: any[];
  createdAt: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinedAt: string;
}

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    isPinned: false,
  });

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const classroomId = params.id as string;
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classroom details
        const classroomResponse = await fetch(
          `/api/classrooms/${classroomId}`,
          {
            credentials: "include",
          }
        );

        if (classroomResponse.ok) {
          const classroomData = await classroomResponse.json();
          setClassroom(classroomData.data);
        }

        // Fetch announcements
        const announcementsResponse = await fetch(
          `/api/classrooms/${classroomId}/announcements`,
          {
            credentials: "include",
          }
        );

        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json();
          setAnnouncements(announcementsData.data || []);
        }

        // Fetch assignments
        const assignmentsResponse = await fetch(
          `/api/classrooms/${classroomId}/assignments`,
          {
            credentials: "include",
          }
        );

        if (assignmentsResponse.ok) {
          const assignmentsData = await assignmentsResponse.json();
          setAssignments(assignmentsData.data || []);
        }

        // Fetch materials
        const materialsResponse = await fetch(
          `/api/classrooms/${classroomId}/materials`,
          {
            credentials: "include",
          }
        );

        if (materialsResponse.ok) {
          const materialsData = await materialsResponse.json();
          setMaterials(materialsData.data || []);
        }

        // Fetch classroom discussions
        const discussionsResponse = await fetch(
          `/api/classrooms/${classroomId}/discussions`,
          {
            credentials: "include",
          }
        );

        if (discussionsResponse.ok) {
          const discussionsData = await discussionsResponse.json();
          setDiscussions(discussionsData.data || []);
        }

        // Fetch members
        const membersResponse = await fetch(
          `/api/classrooms/${classroomId}/members`,
          {
            credentials: "include",
          }
        );

        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setMembers(membersData.data || []);
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

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/classrooms/${classroomId}/announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newAnnouncement),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnnouncements((prev) => [data.data, ...prev]);
        setNewAnnouncement({ title: "", content: "", isPinned: false });
        setShowAnnouncementForm(false);
        toast({
          title: "Success",
          description: "Announcement created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/classrooms/${classroomId}/assignments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newAssignment),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAssignments((prev) => [data.data, ...prev]);
        setNewAssignment({
          title: "",
          description: "",
          dueDate: "",
          points: "100",
        });
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
      const formData = new FormData();
      formData.append("title", newMaterial.title);
      formData.append("type", newMaterial.type);

      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (newMaterial.content) {
        formData.append("content", newMaterial.content);
      } else {
        toast({
          title: "Error",
          description: "Please select a file or enter content",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/classrooms/${classroomId}/materials`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMaterials((prev) => [data.data, ...prev]);
        setNewMaterial({ title: "", content: "", type: "document" });
        setSelectedFile(null);
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

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/classrooms/${classroomId}/discussions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newDiscussion),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDiscussions((prev) => [data.data, ...prev]);
        setNewDiscussion({ title: "", content: "" });
        setShowDiscussionForm(false);
        toast({
          title: "Success",
          description: "Discussion created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast({
        title: "Error",
        description: "Failed to create discussion",
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
              The classroom you're looking for doesn't exist or you don't have
              access to it.
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
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/classrooms">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Classrooms
              </Link>
            </Button>
            <Badge variant="outline" className="font-mono text-lg px-3 py-1">
              {classroom.code}
            </Badge>
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
                <p className="text-sm text-gray-500 mb-2">
                  Share this code with students
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                    {classroom.code}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Class Announcements</h2>
              {isTeacher && (
                <Button
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              )}
            </div>

            {/* Create Announcement Form */}
            {showAnnouncementForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create Announcement</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleCreateAnnouncement}
                    className="space-y-4"
                  >
                    <div>
                      <Input
                        placeholder="Announcement title"
                        value={newAnnouncement.title}
                        onChange={(e) =>
                          setNewAnnouncement((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Announcement content"
                        value={newAnnouncement.content}
                        onChange={(e) =>
                          setNewAnnouncement((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pinned"
                        checked={newAnnouncement.isPinned}
                        onChange={(e) =>
                          setNewAnnouncement((prev) => ({
                            ...prev,
                            isPinned: e.target.checked,
                          }))
                        }
                      />
                      <label htmlFor="pinned" className="text-sm">
                        Pin this announcement
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Post Announcement</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAnnouncementForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Announcements List */}
            {announcements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Megaphone className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No announcements yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isTeacher
                      ? "Create your first announcement"
                      : "Announcements will appear here"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card
                    key={announcement._id}
                    className={
                      announcement.isPinned
                        ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10"
                        : ""
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {announcement.isPinned && (
                            <Pin className="h-4 w-4 text-yellow-500" />
                          )}
                          <CardTitle className="text-lg">
                            {announcement.title}
                          </CardTitle>
                        </div>
                        <Badge variant="outline">
                          👨‍🏫 {announcement.authorName}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(announcement.createdAt).toLocaleString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300">
                        {announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Assignments</h2>
              {isTeacher && (
                <Button
                  onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                >
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
                        onChange={(e) =>
                          setNewAssignment((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Assignment description and instructions"
                        value={newAssignment.description}
                        onChange={(e) =>
                          setNewAssignment((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Due Date
                        </label>
                        <Input
                          type="datetime-local"
                          value={newAssignment.dueDate}
                          onChange={(e) =>
                            setNewAssignment((prev) => ({
                              ...prev,
                              dueDate: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Points
                        </label>
                        <Input
                          type="number"
                          placeholder="Points"
                          value={newAssignment.points}
                          onChange={(e) =>
                            setNewAssignment((prev) => ({
                              ...prev,
                              points: e.target.value,
                            }))
                          }
                          min="1"
                          max="1000"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Create Assignment</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAssignmentForm(false)}
                      >
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
                  <h3 className="text-xl font-semibold mb-2">
                    No assignments yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isTeacher
                      ? "Create your first assignment"
                      : "No assignments posted yet"}
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
                          {isTeacher ? "View Submissions" : "Submit Assignment"}
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
                        onChange={(e) =>
                          setNewMaterial((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Material Type
                      </label>
                      <select
                        value={newMaterial.type}
                        onChange={(e) =>
                          setNewMaterial((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      >
                        <option value="document">📄 Document/PDF</option>
                        <option value="video">🎥 Video Resource</option>
                        <option value="link">🔗 External Link</option>
                        <option value="code">💻 Code Sample</option>
                      </select>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Upload File from Device
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          onChange={(e) =>
                            setSelectedFile(e.target.files?.[0] || null)
                          }
                          accept={
                            newMaterial.type === "video"
                              ? "video/*"
                              : newMaterial.type === "document"
                              ? ".pdf,.doc,.docx,.txt,.ppt,.pptx"
                              : "*/*"
                          }
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
                        <p className="text-sm text-gray-500">
                          Selected: {selectedFile.name} (
                          {(selectedFile.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                    </div>

                    {/* Text Content (alternative to file) */}
                    {!selectedFile && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Or Enter Content/Link
                        </label>
                        <Textarea
                          placeholder={
                            newMaterial.type === "video"
                              ? "Video URL (YouTube, Vimeo, etc.)"
                              : newMaterial.type === "link"
                              ? "External link URL"
                              : newMaterial.type === "code"
                              ? "Code content"
                              : "Document content or description"
                          }
                          value={newMaterial.content}
                          onChange={(e) =>
                            setNewMaterial((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          rows={6}
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button type="submit">Add Material</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMaterialForm(false)}
                      >
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
                  <h3 className="text-xl font-semibold mb-2">
                    No materials yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isTeacher
                      ? "Upload study materials for your students"
                      : "Materials will appear here when uploaded"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((material) => (
                  <Card
                    key={material.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">
                          {material.title}
                        </CardTitle>
                        <div className="text-right">
                          {material.type === "video" && (
                            <Video className="h-5 w-5 text-red-500" />
                          )}
                          {material.type === "document" && (
                            <File className="h-5 w-5 text-blue-500" />
                          )}
                          {material.type === "link" && (
                            <LinkIcon className="h-5 w-5 text-green-500" />
                          )}
                          {material.type === "code" && (
                            <FileText className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">
                        Uploaded:{" "}
                        {new Date(material.uploadedOn).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        {(material as any).fileName && (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              window.open(
                                `/api/classrooms/${classroomId}/materials/download/${encodeURIComponent(
                                  material.title
                                )}`,
                                "_blank"
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        {material.content && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
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
              <Button
                onClick={() => setShowDiscussionForm(!showDiscussionForm)}
              >
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
                  <form onSubmit={handleCreateDiscussion} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Discussion topic"
                        value={newDiscussion.title}
                        onChange={(e) =>
                          setNewDiscussion((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="What would you like to discuss?"
                        value={newDiscussion.content}
                        onChange={(e) =>
                          setNewDiscussion((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Send className="h-4 w-4 mr-2" />
                        Post Discussion
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDiscussionForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Discussions List */}
            {discussions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No discussions yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Start the first discussion in this classroom!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">
                          {discussion.title}
                        </CardTitle>
                        <Badge
                          variant={
                            discussion.authorRole === "teacher"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {discussion.authorRole === "teacher"
                            ? "👨‍🏫 Teacher"
                            : "👨‍🎓 Student"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        by {discussion.authorName} •{" "}
                        {new Date(discussion.createdAt).toLocaleString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {discussion.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MessageCircle className="h-4 w-4" />
                          {discussion.replies.length} replies
                        </div>
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Class Members</h2>
              <Badge variant="outline">{members.length} total members</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card key={member._id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {member.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          member.role === "teacher" ? "default" : "secondary"
                        }
                      >
                        {member.role === "teacher"
                          ? "👨‍🏫 Teacher"
                          : "👨‍🎓 Student"}
                      </Badge>
                      {isTeacher && member.role === "student" && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Joined: {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
