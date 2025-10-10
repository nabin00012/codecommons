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
  Image as ImageIcon,
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
  uploadedBy?: string;
  content?: string;
  fileName?: string;
  hasFile?: boolean;
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
  profileImage?: string;
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
  const [initialLoad, setInitialLoad] = useState(true); // Show classroom first
  const [submittedAssignments, setSubmittedAssignments] = useState<Set<string>>(new Set());
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
  const [submissionsCache, setSubmissionsCache] = useState<Map<string, any[]>>(new Map());
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classroomId = params.id as string;
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch classroom details first for quick display
        const classroomResponse = await fetch(`/api/classrooms/${classroomId}`, { credentials: "include" });
        if (classroomResponse.ok) {
          const classroomData = await classroomResponse.json();
          setClassroom(classroomData.data);
          setInitialLoad(false); // Show classroom immediately
        }

        // Step 2: Fetch everything else in parallel
        const [
          announcementsResponse,
          assignmentsResponse,
          materialsResponse,
          discussionsResponse,
          membersResponse
        ] = await Promise.all([
          fetch(`/api/classrooms/${classroomId}/announcements`, { credentials: "include" }),
          fetch(`/api/classrooms/${classroomId}/assignments`, { credentials: "include" }),
          fetch(`/api/classrooms/${classroomId}/materials`, { credentials: "include" }),
          fetch(`/api/classrooms/${classroomId}/discussions`, { credentials: "include" }),
          fetch(`/api/classrooms/${classroomId}/members`, { credentials: "include" })
        ]);

        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json();
          setAnnouncements(announcementsData.data || []);
        }

        if (assignmentsResponse.ok) {
          const assignmentsData = await assignmentsResponse.json();
          const assignments = assignmentsData.data || [];
          setAssignments(assignments);
          
          // For students: Just fetch which assignments they submitted (lightweight)
          // For teachers: Don't prefetch anything, load on demand
          if (!isTeacher && assignments.length > 0) {
            const submissionsResponse = await fetch(
              `/api/classrooms/${classroomId}/submissions/my-submissions`,
              { credentials: "include" }
            );
            if (submissionsResponse.ok) {
              const submissionsData = await submissionsResponse.json();
              const submitted = new Set<string>(
                (submissionsData.data || []).map((s: any) => s.assignmentId)
              );
              setSubmittedAssignments(submitted);
            }
          }
        }

        if (materialsResponse.ok) {
          const materialsData = await materialsResponse.json();
          setMaterials(materialsData.data || []);
        }

        if (discussionsResponse.ok) {
          const discussionsData = await discussionsResponse.json();
          setDiscussions(discussionsData.data || []);
        }

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

    setIsSubmitting(true);
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
        // Clear cache for this assignment so it fetches fresh data next time
        setSubmissionsCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(selectedAssignment._id);
          return newCache;
        });
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
    } finally {
      setIsSubmitting(false);
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

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="relative">
          {/* Animated Background Circles */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Main Loading Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20 dark:border-gray-700/50">
            <div className="flex flex-col items-center gap-6">
              {/* Animated Logo/Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl">
                  <BookOpen className="h-16 w-16 text-white animate-bounce" />
                </div>
              </div>

              {/* Loading Text */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Loading Classroom
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Preparing your learning experience...
                </p>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease-in-out infinite'
                  }}
                ></div>
              </div>

              {/* Loading Steps */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  <span>Fetching assignments</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center gap-2 animate-pulse" style={{ animationDelay: '0.3s' }}>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                  <span>Loading materials</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center gap-2 animate-pulse" style={{ animationDelay: '0.6s' }}>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                  <span>Getting ready</span>
                </div>
              </div>

              {/* Fun Facts / Tips */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700/50 rounded-xl border border-blue-100 dark:border-gray-600">
                <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                  💡 <span className="font-semibold">Tip:</span> You can press Tab to navigate between assignments quickly!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add shimmer animation */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              {isTeacher ? (
                                <Button 
                                  size="sm"
                                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                  onClick={async () => {
                                    setSelectedAssignment(assignment);
                                    
                                    // Check cache first
                                    if (submissionsCache.has(assignment._id)) {
                                      setAssignmentSubmissions(submissionsCache.get(assignment._id) || []);
                                    } else {
                                      // Fetch submissions only if not cached
                                      setLoadingSubmissions(true);
                                      try {
                                        const res = await fetch(
                                          `/api/classrooms/${classroomId}/assignments/${assignment._id}`,
                                          { credentials: "include" }
                                        );
                                        if (res.ok) {
                                          const data = await res.json();
                                          const submissions = data.data.submissions || [];
                                          setAssignmentSubmissions(submissions);
                                          // Cache the submissions
                                          setSubmissionsCache(prev => new Map(prev).set(assignment._id, submissions));
                                        }
                                      } catch (error) {
                                        console.error("Error fetching submissions:", error);
                                      } finally {
                                        setLoadingSubmissions(false);
                                      }
                                    }
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Submissions
                                </Button>
                              ) : submittedAssignments.has(assignment._id) ? (
                                <Button 
                                  size="sm"
                                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg shadow-green-500/30"
                                  onClick={async () => {
                                    setSelectedAssignment(assignment);
                                    setLoadingSubmissions(true);
                                    
                                    try {
                                      // Always fetch fresh data to verify submission status
                                      const res = await fetch(
                                        `/api/classrooms/${classroomId}/assignments/${assignment._id}`,
                                        { credentials: "include" }
                                      );
                                      if (res.ok) {
                                        const data = await res.json();
                                        const submissions = data.data.submissions || [];
                                        setAssignmentSubmissions(submissions);
                                        
                                        // Update submitted assignments set
                                        if (submissions.length > 0) {
                                          setSubmittedAssignments(prev => new Set(prev).add(assignment._id));
                                        }
                                        
                                        // Cache the submissions
                                        setSubmissionsCache(prev => new Map(prev).set(assignment._id, submissions));
                                      }
                                    } catch (error) {
                                      console.error("Error fetching submissions:", error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to load submission details",
                                        variant: "destructive",
                                      });
                                    } finally {
                                      setLoadingSubmissions(false);
                                    }
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  ✨ Submitted
                                </Button>
                              ) : (
                                <Button 
                                  size="sm"
                                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                  onClick={async () => {
                                    setSelectedAssignment(assignment);
                                    setLoadingSubmissions(true);
                                    
                                    try {
                                      // Fetch to verify if student has actually submitted
                                      const res = await fetch(
                                        `/api/classrooms/${classroomId}/assignments/${assignment._id}`,
                                        { credentials: "include" }
                                      );
                                      if (res.ok) {
                                        const data = await res.json();
                                        const submissions = data.data.submissions || [];
                                        setAssignmentSubmissions(submissions);
                                        
                                        // Update submitted status if there's a submission
                                        if (submissions.length > 0) {
                                          setSubmittedAssignments(prev => new Set(prev).add(assignment._id));
                                        }
                                        
                                        // Cache the submissions
                                        setSubmissionsCache(prev => new Map(prev).set(assignment._id, submissions));
                                      }
                                    } catch (error) {
                                      console.error("Error fetching submissions:", error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to load assignment details",
                                        variant: "destructive",
                                      });
                                    } finally {
                                      setLoadingSubmissions(false);
                                    }
                                  }}
                                >
                                  <Upload className="h-4 w-4" />
                                  Submit Work
                                </Button>
                              )}
                            </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{assignment.title}</DialogTitle>
                              <DialogDescription>
                                {assignment.description}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {loadingSubmissions ? (
                              <div className="space-y-6 py-6">
                                {/* Beautiful animated loading state */}
                                <div className="flex flex-col items-center justify-center">
                                  <div className="relative w-24 h-24 mb-4">
                                    {/* Outer ring */}
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
                                    {/* Spinning gradient ring */}
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
                                    {/* Inner pulsing circle */}
                                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                                    {/* Center icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                                    </div>
                                  </div>
                                  <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    Loading Assignment Details
                                  </h4>
                                  <p className="text-sm text-muted-foreground text-center max-w-md">
                                    Checking submission status and fetching assignment data...
                                  </p>
                                </div>

                                {/* Skeleton content preview */}
                                <div className="space-y-4 pt-4 border-t">
                                  <div className="space-y-2">
                                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-full w-1/3 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-full animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6 animate-pulse"></div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 rounded-full w-1/4 animate-pulse"></div>
                                    <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                                  </div>
                                  <div className="h-12 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-800 dark:to-purple-800 rounded-xl animate-pulse"></div>
                                </div>
                              </div>
                            ) : !isTeacher && !submittedAssignments.has(assignment._id) && (
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
                                  disabled={isSubmitting}
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  {isSubmitting ? "Submitting..." : "Submit Assignment"}
                                </Button>
                              </div>
                            )}

                            {!isTeacher && submittedAssignments.has(assignment._id) && (
                              <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className="bg-green-500 text-white">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Submitted
                                  </Badge>
                                  {assignmentSubmissions.length > 0 && assignmentSubmissions[0].submittedAt && (
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(assignmentSubmissions[0].submittedAt).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {assignmentSubmissions.length > 0 ? (
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
                                ) : (
                                  <p className="text-sm text-muted-foreground py-4">
                                    Loading your submission details...
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {!loadingSubmissions && isTeacher && (
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
                        <option value="image">🖼️ Image/Photo</option>
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
                              ? "video/*,.mp4,.mov,.avi,.mkv,.wmv,.flv,.webm"
                              : newMaterial.type === "image"
                              ? "image/*,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"
                              : newMaterial.type === "document"
                              ? ".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.csv,.rtf,.odt"
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
              <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl">
                      <FileText className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    No Study Materials Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                    {isTeacher
                      ? "📚 Upload lecture notes, PDFs, videos, and resources to help your students learn better"
                      : "📖 Your teacher will upload study materials here. Check back soon!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => {
                  const materialIcon = material.type === "video" 
                    ? { icon: Video, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", badge: "🎥" }
                    : material.type === "image"
                    ? { icon: ImageIcon, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20", badge: "🖼️" }
                    : material.type === "document"
                    ? { icon: File, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", badge: "📄" }
                    : material.type === "link"
                    ? { icon: LinkIcon, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", badge: "🔗" }
                    : { icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", badge: "💻" };
                  
                  const IconComponent = materialIcon.icon;
                  
                  return (
                    <Card
                      key={material.id}
                      className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-primary/10 hover:border-primary/30 overflow-hidden"
                    >
                      {/* Gradient Header */}
                      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`${materialIcon.bg} p-3 rounded-xl shrink-0`}>
                            <IconComponent className={`h-6 w-6 ${materialIcon.color}`} />
                          </div>
                          
                          {/* Title and Badge */}
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                              {material.title}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {materialIcon.badge} {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* File Info */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(material.uploadedOn).toLocaleDateString()}
                          </span>
                          {(material as any).fileName && (
                            <span className="flex items-center gap-1 font-medium">
                              📦 {material.size}
                            </span>
                          )}
                        </div>

                        {/* Uploaded By */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                          <Users className="h-3 w-3" />
                          <span>Uploaded by <span className="font-medium">{material.uploadedBy}</span></span>
                        </div>
                        
                        {/* Action Buttons */}
                        {((material as any).hasFile || material.content) && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                              onClick={() =>
                                window.open(
                                  `/api/classrooms/${classroomId}/materials/view/${encodeURIComponent(
                                    material.title
                                  )}`,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                              onClick={() =>
                                window.open(
                                  `/api/classrooms/${classroomId}/materials/download/${encodeURIComponent(
                                    material.title
                                  )}`,
                                  "_blank"
                                )
                              }
                            >
                              <Download className="h-4 w-4 mr-1.5" />
                              Download
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Class Members
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect and collaborate with your classmates
                </p>
              </div>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Users className="h-4 w-4 mr-2" />
                {members.length} members
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <Card key={member._id} className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16 ring-4 ring-offset-2 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all">
                          <AvatarImage 
                            src={member.profileImage || "/placeholder-user.jpg"} 
                            alt={member.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online status indicator (can be dynamic later) */}
                        <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {member.email}
                        </p>
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
