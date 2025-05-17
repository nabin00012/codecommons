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
} from "lucide-react";
import { authService } from "@/lib/services/auth";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [isLiked, setIsLiked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id, toast]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "media"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      formData.append("type", type);
      formData.append("projectId", params.id as string);

      const token = authService.getToken();
      const response = await fetch("/api/projects/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

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
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4"
        >
          Project Not Found
        </motion.h1>
        <Button onClick={() => router.push("/dashboard/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push("/dashboard/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart
                className="h-5 w-5"
                fill={isLiked ? "currentColor" : "none"}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/20"></div>
        <Image
          src={
            project.media[0]?.url || "/placeholder.svg?height=400&width=1200"
          }
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end">
          <div className="container mx-auto p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-white/80 mb-4">
                {project.description}
              </p>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>{project.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  <span>{project.contributors}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto p-8 pt-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                <TabsTrigger
                  value="description"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
                >
                  <BookOpen className="h-4 w-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
                >
                  <ImageIcon className="h-4 w-4" />
                  Media
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent key="description" value="description">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
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
                            {project?.longDescription}
                          </ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent key="media" value="media">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-end">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, "media")}
                          disabled={isUploading}
                        />
                        <Button
                          variant="outline"
                          className="gap-2"
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Media"}
                        </Button>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project?.media.map((item, index) => (
                        <Card
                          key={`media-${index}`}
                          className="overflow-hidden group"
                        >
                          <CardContent className="p-0">
                            {item.type === "image" ? (
                              <div className="relative aspect-video">
                                <Image
                                  src={item.url}
                                  alt={item.caption || "Media"}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                            ) : (
                              <video
                                src={item.url}
                                controls
                                className="w-full aspect-video"
                              />
                            )}
                            {item.caption && (
                              <p className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                                {item.caption}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Project Info</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Author
                    </p>
                    <p className="font-medium">{project.author.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Role
                    </p>
                    <Badge variant="outline" className="capitalize">
                      {project.author.role}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Button
                      className="w-full gap-2"
                      onClick={() => window.open(project.githubLink, "_blank")}
                    >
                      <Github className="h-4 w-4" />
                      View on GitHub
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {project.demoLink && (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
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
      </div>
    </div>
  );
}
