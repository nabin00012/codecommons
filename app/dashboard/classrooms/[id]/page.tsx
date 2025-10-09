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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Paperclip,
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
  attachments?: Array<{name: string; url: string; size: number}>;
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
  const [submittedAssignments, setSubmittedAssignments] = useState<Set<string>>(new Set());
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);

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
  
  // Assignment submission states
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
  const [assignmentAttachments, setAssignmentAttachments] = useState<File[]>([]);

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
          
          // Check which assignments the student has submitted
          if (!isTeacher) {
            const submitted = new Set<string>();
            for (const assignment of assignmentsData.data || []) {
              const checkResponse = await fetch(
                `/api/classrooms/${classroomId}/assignments/${assignment._id}`,
                { credentials: "include" }
              );
              if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (checkData.data.submissions && checkData.data.submissions.length > 0) {
                  submitted.add(assignment._id);
                }
              }
            }
            setSubmittedAssignments(submitted);
          }
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
          body: JSON.stringify({
            ...newAssignment,
            attachments: assignmentAttachments.map(f => ({
              name: f.name,
              size: f.size,
              type: f.type,
            }))
          }),
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
        setAssignmentAttachments([]);
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

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;

    try {
      // Convert files to base64
      const attachmentsWithContent = await Promise.all(
        submissionFiles.map(async (file) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]); // Remove data:image/png;base64, prefix
            };
            reader.readAsDataURL(file);
          });
          
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            content: base64,
          };
        })
      );

      const response = await fetch(
        `/api/classrooms/${classroomId}/assignments/${selectedAssignment._id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: submissionText,
            attachments: attachmentsWithContent
          }),
        }
      );

      if (response.ok) {
        // Mark assignment as submitted
        setSubmittedAssignments(prev => new Set(prev).add(selectedAssignment._id));
        setShowAssignmentDialog(false);
        setSubmissionText("");
        setSubmissionFiles([]);
        setSelectedAssignment(null);
        toast({
          title: "Success",
          description: "Assignment submitted successfully",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assignment",
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Back Button */}
          <div className="mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="hover:bg-primary/10 transition-colors"
            >
              <Link href="/dashboard/classrooms">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Classrooms
              </Link>
            </Button>
          </div>

          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl mb-8">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="font-mono text-base px-4 py-1 bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30">
                      {classroom.code}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3">
                    {classroom.name}
                  </h1>
                  <p className="text-lg text-white/90 mb-4 max-w-3xl">
                    {classroom.description}
                  </p>
                  <div className="flex items-center gap-6 text-white/80">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{classroom.students.length}</span> students
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{classroom.department.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {isTeacher && (
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 min-w-[200px]">
                    <p className="text-sm text-white/80 mb-3 text-center">
                      🎓 Share Code
                    </p>
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      <p className="text-3xl font-mono font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {classroom.code}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Tabs */}
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur p-1 h-auto gap-1">
            <TabsTrigger 
              value="announcements"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger 
              value="assignments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger 
              value="materials"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Materials
            </TabsTrigger>
            <TabsTrigger 
              value="discussions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
          </TabsList>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Class Announcements
              </h2>
              {isTeacher && (
                <Button
                  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
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
              <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full mb-6">
                    <Megaphone className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    No announcements yet
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {isTeacher
                      ? "Create your first announcement to keep students informed about important updates"
                      : "Announcements from your teacher will appear here"}
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
                        ? "border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-amber-900/10 shadow-lg"
                        : "border-primary/20 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50"
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {announcement.isPinned && (
                            <div className="p-1.5 bg-amber-500/20 rounded-lg">
                              <Pin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                          )}
                          <CardTitle className="text-lg font-bold">
                            {announcement.title}
                          </CardTitle>
                        </div>
                        <Badge 
                          variant="outline"
                          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/30"
                        >
                          👨‍🏫 {announcement.authorName}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(announcement.createdAt).toLocaleString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Assignments
              </h2>
              {isTeacher && (
                <Button
                  onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
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
                    
                    {/* File Attachments */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Attach Files (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              setAssignmentAttachments(Array.from(e.target.files));
                            }
                          }}
                          className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                        />
                      </div>
                      {assignmentAttachments.length > 0 && (
                        <div className="space-y-1">
                          {assignmentAttachments.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                              <span className="flex items-center gap-2">
                                <Paperclip className="h-3 w-3" />
                                {file.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setAssignmentAttachments(prev => prev.filter((_, i) => i !== idx));
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        Create Assignment
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAssignmentForm(false);
                          setAssignmentAttachments([]);
                        }}
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
                  <Card key={assignment._id} className="border-primary/20 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                          {assignment.points} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {assignment.description}
                      </p>
                      
                      {/* Attachments from teacher */}
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            Attached Files:
                          </p>
                          <div className="space-y-1">
                            {assignment.attachments.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                                <span className="flex items-center gap-2">
                                  <File className="h-4 w-4" />
                                  {file.name}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    // Download file logic
                                    toast({
                                      title: "Downloading",
                                      description: `Downloading ${file.name}...`,
                                    });
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Due: {new Date(assignment.dueDate).toLocaleString()}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!isTeacher && submittedAssignments.has(assignment._id) && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Submitted
                            </Badge>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm"
                                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                onClick={async () => {
                                  setSelectedAssignment(assignment);
                                  // Fetch submissions for both teacher and student
                                  try {
                                    const res = await fetch(
                                      `/api/classrooms/${classroomId}/assignments/${assignment._id}`,
                                      { credentials: "include" }
                                    );
                                    if (res.ok) {
                                      const data = await res.json();
                                      setAssignmentSubmissions(data.data.submissions || []);
                                    }
                                  } catch (error) {
                                    console.error("Error fetching submissions:", error);
                                  }
                                }}
                              >
                                {isTeacher ? (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    View Submissions
                                  </>
                                ) : submittedAssignments.has(assignment._id) ? (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    View Submission
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4" />
                                    Submit Work
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{assignment.title}</DialogTitle>
                              <DialogDescription>
                                {assignment.description}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {!isTeacher && !submittedAssignments.has(assignment._id) && (
                              <div className="space-y-4 mt-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Your Submission
                                  </label>
                                  <Textarea
                                    placeholder="Type your answer or add notes here..."
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    rows={6}
                                    className="w-full"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Attach Files
                                  </label>
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        setSubmissionFiles(Array.from(e.target.files));
                                      }
                                    }}
                                    className="w-full p-2 border rounded-md"
                                  />
                                  {submissionFiles.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {submissionFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                                          <span>{file.name}</span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                              setSubmissionFiles(prev => prev.filter((_, i) => i !== idx));
                                            }}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <Button 
                                  onClick={handleSubmitAssignment}
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Submit Assignment
                                </Button>
                              </div>
                            )}

                            {!isTeacher && submittedAssignments.has(assignment._id) && assignmentSubmissions.length > 0 && (
                              <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className="bg-green-500 text-white">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Submitted
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(assignmentSubmissions[0].submittedAt).toLocaleString()}
                                  </span>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg border">
                                  <h4 className="font-medium mb-2">Your Submission:</h4>
                                  <p className="text-sm whitespace-pre-wrap mb-3">
                                    {assignmentSubmissions[0].content || "No text submission"}
                                  </p>
                                  {assignmentSubmissions[0].attachments && assignmentSubmissions[0].attachments.length > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Attached Files:</p>
                                      {assignmentSubmissions[0].attachments.map((file: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between bg-background p-2 rounded text-sm">
                                          <span className="flex items-center gap-2">
                                            <File className="h-4 w-4" />
                                            {file.name}
                                          </span>
                                          <div className="flex gap-1">
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                const viewUrl = `/api/classrooms/${classroomId}/assignments/${selectedAssignment?._id}/submissions/${assignmentSubmissions[0]._id}/view?fileIndex=${idx}`;
                                                window.open(viewUrl, '_blank');
                                              }}
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                const downloadUrl = `/api/classrooms/${classroomId}/assignments/${selectedAssignment?._id}/submissions/${assignmentSubmissions[0]._id}/download?fileIndex=${idx}`;
                                                window.open(downloadUrl, '_blank');
                                              }}
                                            >
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {isTeacher && (
                              <div className="mt-4 space-y-4">
                                <h3 className="text-lg font-semibold">Student Submissions ({assignmentSubmissions.length})</h3>
                                {assignmentSubmissions.length === 0 ? (
                                  <p className="text-sm text-muted-foreground py-4">
                                    No submissions yet. Students haven't submitted their work.
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {assignmentSubmissions.map((submission, idx) => (
                                      <Card key={idx} className="bg-muted/50">
                                        <CardContent className="pt-4">
                                          <div className="flex items-start justify-between mb-2">
                                            <div>
                                              <p className="font-medium">{submission.studentName}</p>
                                              <p className="text-sm text-muted-foreground">{submission.studentEmail}</p>
                                            </div>
                                            <Badge variant="outline">
                                              {new Date(submission.submittedAt).toLocaleDateString()}
                                            </Badge>
                                          </div>
                                          <div className="mt-3 p-3 bg-background rounded border">
                                            <p className="text-sm whitespace-pre-wrap">{submission.content || "No text submission"}</p>
                                          </div>
                                          {submission.attachments && submission.attachments.length > 0 && (
                                            <div className="mt-3 space-y-1">
                                              <p className="text-sm font-medium">Attached Files:</p>
                                              {submission.attachments.map((file: any, fileIdx: number) => (
                                                <div key={fileIdx} className="flex items-center justify-between bg-background p-2 rounded text-sm">
                                                  <span className="flex items-center gap-2">
                                                    <File className="h-4 w-4" />
                                                    {file.name}
                                                  </span>
                                                  <div className="flex gap-1">
                                                    <Button
                                                      size="sm"
                                                      variant="ghost"
                                                      onClick={() => {
                                                        const viewUrl = `/api/classrooms/${classroomId}/assignments/${selectedAssignment?._id}/submissions/${submission._id}/view?fileIndex=${fileIdx}`;
                                                        window.open(viewUrl, '_blank');
                                                      }}
                                                    >
                                                      <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                      size="sm"
                                                      variant="ghost"
                                                      onClick={() => {
                                                        const downloadUrl = `/api/classrooms/${classroomId}/assignments/${selectedAssignment?._id}/submissions/${submission._id}/download?fileIndex=${fileIdx}`;
                                                        window.open(downloadUrl, '_blank');
                                                      }}
                                                    >
                                                      <Download className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        </div>
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
                        {((material as any).fileName || material.content) && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() =>
                                window.open(
                                  `/api/classrooms/${classroomId}/materials/view/${encodeURIComponent(
                                    material.title
                                  )}`,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
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
                          </>
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
      </div>
    </ProtectedRoute>
  );
}
