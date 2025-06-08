"use client";

import React, { useState } from "react";
import { Project } from "@/lib/models/project";
import { useSettings } from "@/lib/context/settings-context";

interface ProjectManagementProps {
  projects: Project[];
  onProjectUpdate: (project: Project) => void;
  onProjectDelete: (projectId: string) => void;
}

export function ProjectManagement({
  projects,
  onProjectUpdate,
  onProjectDelete,
}: ProjectManagementProps) {
  const { settings } = useSettings();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleStatusChange = (
    projectId: string,
    newStatus: Project["status"]
  ) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      onProjectUpdate({ ...project, status: newStatus });
    }
  };

  const handleProgressChange = (projectId: string, newProgress: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      onProjectUpdate({ ...project, progress: newProgress });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Management</h2>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={project.status}
                  onChange={(e) =>
                    handleStatusChange(
                      project.id,
                      e.target.value as Project["status"]
                    )
                  }
                  className="px-2 py-1 border rounded"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button
                  onClick={() => onProjectDelete(project.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Progress: {project.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) =>
                  handleProgressChange(project.id, parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
