"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Users,
  Calendar,
  Github,
  ExternalLink,
  Tag,
  ImageIcon,
  Video,
  FileText,
  ArrowLeft,
  Share2,
  Heart,
  Upload,
  Code2,
  Terminal,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Eye,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { authService } from "@/lib/services/auth";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useUser } from "@/lib/context/user-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  githubLink: string;
  demoLink?: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    role: string;
  };
  media: Array<{
    type: "image" | "video";
    url: string;
    caption?: string;
  }>;
  screenshots: Array<{
    url: string;
    caption?: string;
  }>;
  screenRecordings: Array<{
    url: string;
    caption?: string;
  }>;
  stars: number;
  contributors: number;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  views?: number;
  comments?: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      role: string;
    };
    content: string;
    createdAt: string;
  }>;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`/api/projects?id=${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const data = await response.json();
      setProject(data);
      setIsLiked(data.isLiked || false);
      setIsBookmarked(data.isBookmarked || false);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "Failed to load project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("type", "media");
      formData.append("projectId", params.id as string);

      const token = authService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/projects/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload files");
      }

      const data = await response.json();
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          media: [...prev.media, ...data.files],
        };
      });

      toast({
        title: "Success",
        description: "Files uploaded successfully!",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLike = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`/api/projects/${params.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to like project");
      }

      setIsLiked(!isLiked);
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: (prev.likes || 0) + (isLiked ? -1 : 1),
        };
      });

      toast({
        title: isLiked ? "Unliked" : "Liked",
        description: isLiked
          ? "Project unliked successfully"
          : "Project liked successfully",
      });
    } catch (error) {
      console.error("Error liking project:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`/api/projects/${params.id}/bookmark`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to bookmark project");
      }

      setIsBookmarked(!isBookmarked);
      toast({
        title: isBookmarked ? "Unbookmarked" : "Bookmarked",
        description: isBookmarked
          ? "Project removed from bookmarks"
          : "Project added to bookmarks",
      });
    } catch (error) {
      console.error("Error bookmarking project:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    setShareUrl(url);
    setShowShareDialog(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const token = authService.getToken();
      const response = await fetch(`/api/projects/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [...(prev.comments || []), data],
        };
      });

      setNewComment("");
      setShowCommentDialog(false);
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
            {project.likes || 0}
          </Button>
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleBookmark}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Project Title and Stats */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {project.views || 0} views
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {project.comments?.length || 0} comments
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Project Info */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground mb-6">
                    {project.description}
                  </p>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {project.longDescription}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Comments</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCommentDialog(true)}
                    >
                      Add Comment
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {project.comments?.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex gap-4 p-4 rounded-lg bg-muted"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">
                              {comment.user.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Media</h2>
                    {user?._id === project.author._id && (
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          id="media-upload"
                          className="hidden"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("media-upload")?.click()
                          }
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Media
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  {isUploading && (
                    <Progress value={uploadProgress} className="mb-4" />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.media.map((item, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.url}
                            alt={item.caption || "Project media"}
                            width={400}
                            height={300}
                            className="object-cover w-full h-48"
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleDownload(item.url, item.caption || "media")
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        {item.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
                            {item.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screenshots" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Screenshots</h2>
                    {user?._id === project.author._id && (
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          id="screenshot-upload"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById("screenshot-upload")
                              ?.click()
                          }
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Screenshots
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.screenshots.map((screenshot, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        <Image
                          src={screenshot.url}
                          alt={screenshot.caption || "Project screenshot"}
                          width={400}
                          height={300}
                          className="object-cover w-full h-48"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleDownload(
                                screenshot.url,
                                screenshot.caption || "screenshot"
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        {screenshot.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
                            {screenshot.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recordings" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">
                      Screen Recordings
                    </h2>
                    {user?._id === project.author._id && (
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          id="recording-upload"
                          className="hidden"
                          multiple
                          accept="video/*"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("recording-upload")?.click()
                          }
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Recordings
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {project.screenRecordings.map((recording, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        <video
                          src={recording.url}
                          controls
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleDownload(
                                recording.url,
                                recording.caption || "recording"
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        {recording.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm">
                            {recording.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Project Info */}
        <div className="w-full md:w-80 space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Project Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="font-medium">{project.author.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant="outline" className="capitalize">
                    {project.author.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stats</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{project.contributors}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.open(project.githubLink, "_blank")}
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </Button>
                  {project.demoLink && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 mt-2"
                      onClick={() => window.open(project.demoLink, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Share this project with others using the link below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Share your thoughts about this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCommentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleComment}
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
