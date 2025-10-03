"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProjectCard } from "./project-card";
import { ProjectForm, type ProjectFormValues } from "./project-form";
import { useUser } from "@/lib/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Define project types
type ProjectStatus = "not-started" | "in-progress" | "completed" | "overdue";
type UserRole = "student" | "teacher";

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  course?: string;
  members: number;
  owner: {
    id: string;
    name: string;
    role: UserRole;
  };
}

// Mock data for courses
const COURSES = [
  { id: "1", name: "Data Structures & Algorithms" },
  { id: "2", name: "Web Development" },
  { id: "3", name: "Machine Learning Basics" },
  { id: "4", name: "Database Management Systems" },
];

// Mock project data
const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    title: "AI-Powered Code Assistant",
    description:
      "A machine learning model that helps students write better code by providing suggestions and identifying potential bugs.",
    status: "in-progress",
    progress: 65,
    dueDate: "May 15, 2025",
    course: "Machine Learning Basics",
    members: 3,
    owner: {
      id: "user1",
      name: "Rahul Singh",
      role: "student",
    },
  },
  {
    id: "2",
    title: "Distributed Learning Platform",
    description:
      "An educational platform that connects students and teachers across multiple institutions for collaborative learning.",
    status: "completed",
    progress: 100,
    dueDate: "March 10, 2025",
    course: "Web Development",
    members: 4,
    owner: {
      id: "user2",
      name: "Dr. Priya Sharma",
      role: "teacher",
    },
  },
  {
    id: "3",
    title: "Blockchain Voting System",
    description:
      "A secure and transparent voting system built on blockchain technology for student council elections.",
    status: "not-started",
    progress: 0,
    dueDate: "June 30, 2025",
    course: "Database Management Systems",
    members: 2,
    owner: {
      id: "user1",
      name: "Rahul Singh",
      role: "student",
    },
  },
  {
    id: "4",
    title: "Algorithm Visualization Tool",
    description:
      "An interactive tool that visualizes common algorithms to help students understand their operation and complexity.",
    status: "overdue",
    progress: 40,
    dueDate: "April 1, 2025",
    course: "Data Structures & Algorithms",
    members: 1,
    owner: {
      id: "user3",
      name: "Ananya Patel",
      role: "student",
    },
  },
];

export function ProjectManagement() {
  const { user } = useUser();
  const { toast } = useToast();

  // State for projects - start empty to prevent hydration mismatch
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setProjects(INITIAL_PROJECTS);
      setFilteredProjects(INITIAL_PROJECTS);
      setIsLoading(false);
    }, 100); // Small delay to ensure proper hydration
    return () => clearTimeout(timer);
  }, []);

  // Filter projects based on search query and status filter
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.course?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((project) =>
        statusFilter.includes(project.status)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter]);

  // Handle adding a new project
  const handleAddProject = (data: ProjectFormValues) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newProject: Project = {
        id: `${projects.length + 1}`,
        title: data.title,
        description: data.description,
        status: data.status,
        progress: data.progress,
        dueDate: format(data.dueDate, "MMMM d, yyyy"),
        course: data.course,
        members: data.members,
        owner: {
          id: user?.id || "user1",
          name: user?.name || "Current User",
          role: (user?.role as UserRole) || "student",
        },
      };

      setProjects([...projects, newProject]);
      setIsSubmitting(false);
      setIsAddDialogOpen(false);

      toast({
        title: "Project Created",
        description: "Your project has been created successfully.",
      });
    }, 1000);
  };

  // Handle editing a project
  const handleEditProject = (data: ProjectFormValues) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedProjects = projects.map((project): Project => {
        if (project.id === currentProject?.id) {
          return {
            ...project,
            title: data.title,
            description: data.description,
            status: data.status,
            progress: data.progress,
            dueDate: format(data.dueDate, "MMMM d, yyyy"),
            course: data.course,
            members: data.members,
          };
        }
        return project;
      });

      setProjects(updatedProjects);
      setIsSubmitting(false);
      setIsEditDialogOpen(false);

      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully.",
      });
    }, 1000);
  };

  // Handle deleting a project
  const handleDeleteConfirm = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedProjects = projects.filter(
        (project) => project.id !== currentProject?.id
      );
      setProjects(updatedProjects);
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully.",
        variant: "destructive",
      });
    }, 1000);
  };

  if (!mounted || isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 cosmic-text">
            Project Management
          </h2>
          <p className="text-muted-foreground">
            Create and manage your academic projects
          </p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="cosmic-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {statusFilter.length > 0 && (
                <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                  {statusFilter.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("not-started")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "not-started"]);
                } else {
                  setStatusFilter(
                    statusFilter.filter((s) => s !== "not-started")
                  );
                }
              }}
            >
              Not Started
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("in-progress")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "in-progress"]);
                } else {
                  setStatusFilter(
                    statusFilter.filter((s) => s !== "in-progress")
                  );
                }
              }}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("completed")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "completed"]);
                } else {
                  setStatusFilter(
                    statusFilter.filter((s) => s !== "completed")
                  );
                }
              }}
            >
              Completed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("overdue")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStatusFilter([...statusFilter, "overdue"]);
                } else {
                  setStatusFilter(statusFilter.filter((s) => s !== "overdue"));
                }
              }}
            >
              Overdue
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-lg border border-primary/10 bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                {...project}
                onEdit={(id) => {
                  setCurrentProject(project);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(id) => {
                  setCurrentProject(project);
                  setIsDeleteDialogOpen(true);
                }}
                dueDate={new Date(project.dueDate)}
                onView={(id) => {
                  // Handle view project
                  toast({
                    title: "View Project",
                    description: `Viewing ${project.title}`,
                  });
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-6">
            No projects match your current search criteria. Try adjusting your
            filters or create a new project.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Project
          </Button>
        </div>
      )}

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project. Click save when
              you're done.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleAddProject}
            isSubmitting={isSubmitting}
            courses={COURSES}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details below.
            </DialogDescription>
          </DialogHeader>
          {currentProject && (
            <ProjectForm
              initialData={{
                title: currentProject.title,
                description: currentProject.description,
                status: currentProject.status,
                progress: currentProject.progress,
                dueDate: new Date(), // In a real app, parse the date string
                course: currentProject.course,
                members: currentProject.members,
              }}
              onSubmit={handleEditProject}
              isSubmitting={isSubmitting}
              courses={COURSES}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project
              {currentProject && <strong> "{currentProject.title}"</strong>} and
              remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
