"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (name: string, description: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  searchProjects: (query: string) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    console.log("ProjectProvider - Theme changed:", resolvedTheme);
  }, [resolvedTheme]);

  const addProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      description,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const searchProjects = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        searchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
