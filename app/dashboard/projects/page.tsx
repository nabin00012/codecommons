"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import {
  Loader2,
  Github,
  Plus,
  Star,
  Users,
  Calendar,
  Code2,
  ExternalLink,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { authService } from "@/lib/services/auth";
import { API_URL } from "@/lib/constants";

interface Project {
  _id: string;
  title: string;
  description: string;
  githubLink: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  stars: number;
  contributors: number;
  thumbnail?: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubLink: "",
    tags: [] as string[],
    longDescription: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);

      console.log("Fetching projects...");

      const response = await fetch(`/api/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: sends cookies with request
      });

      console.log("Projects response status:", response.status);
      console.log(
        "Projects response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        let errorMessage = `Failed to fetch projects: ${response.status} ${response.statusText}`;

        try {
          const contentType = response.headers?.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textError = await response.text();
            errorMessage = textError || errorMessage;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }

        console.error("Failed to fetch projects:", {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          url: `${API_URL}/api/projects`,
        });

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Projects fetched successfully:", data.length, "projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch projects"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      console.log("Creating project...");
      console.log("Project data:", newProject);

      const response = await fetch(`/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: sends cookies with request
        body: JSON.stringify(newProject),
      });

      console.log("Create project response status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          console.error("Failed to parse error response:", e);
          errorData = { message: "Failed to parse error response" };
        }

        console.error("Failed to create project:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        throw new Error(errorData.message || "Failed to create project");
      }

      toast({
        title: "Success",
        description: "Project created successfully!",
      });

      setIsDialogOpen(false);
      setNewProject({
        title: "",
        description: "",
        githubLink: "",
        tags: [],
        longDescription: "",
      });
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTag === "all" || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Projects</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Showcase your work and explore projects from the community
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto h-10 sm:h-11">
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Share your project with the community. Add a title,
                    description, and GitHub link.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Project Title
                    </label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      placeholder="Enter project title"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your project"
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="githubLink" className="text-sm font-medium">
                      GitHub Link
                    </label>
                    <Input
                      id="githubLink"
                      value={newProject.githubLink}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          githubLink: e.target.value,
                        })
                      }
                      placeholder="https://github.com/username/repo"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="tags" className="text-sm font-medium">
                      Tags
                    </label>
                    <Input
                      id="tags"
                      value={newProject.tags.join(", ")}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim()),
                        })
                      }
                      placeholder="Enter tags separated by commas"
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="longDescription"
                      className="text-sm font-medium"
                    >
                      Long Description
                    </label>
                    <Textarea
                      id="longDescription"
                      value={newProject.longDescription}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          longDescription: e.target.value,
                        })
                      }
                      placeholder="Write a detailed description of your project"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateProject}
                    className="w-full sm:w-auto h-10 sm:h-11"
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-11"
              />
              <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                className="relative group rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-2xl"
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                {/* Thumbnail */}
                <div className="relative h-32 sm:h-40 w-full bg-gradient-to-br from-purple-500/30 to-blue-500/20 flex items-center justify-center">
                  <img
                    src={
                      project.thumbnail ||
                      "/placeholder.svg?height=160&width=320"
                    }
                    alt={project.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                    <button className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 dark:bg-zinc-800/90 text-primary font-semibold rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
                {/* Card Content */}
                <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg sm:text-xl font-bold truncate text-zinc-900 dark:text-zinc-100">
                      {project.title}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 line-clamp-2 sm:line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs px-2 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{project.contributors}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.githubLink, "_blank");
                        }}
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/projects/${project._id}`);
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "No projects match your search criteria."
                : "Be the first to share your project!"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
