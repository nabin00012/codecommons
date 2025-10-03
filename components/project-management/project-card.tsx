"use client";

import React from "react";
import { Project } from "@/lib/models/project";

type ProjectStatus = "not-started" | "in-progress" | "completed" | "overdue";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  dueDate: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const statusStyles: Record<ProjectStatus, { badge: string; progress: string }> = {
  "not-started": {
    badge: "bg-gray-100 text-gray-800",
    progress: "bg-gray-200",
  },
  "in-progress": {
    badge: "bg-blue-100 text-blue-800",
    progress: "bg-blue-200",
  },
  completed: {
    badge: "bg-green-100 text-green-800",
    progress: "bg-green-200",
  },
  overdue: {
    badge: "bg-red-100 text-red-800",
    progress: "bg-red-200",
  },
};

const statusLabels = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
  overdue: "Overdue",
};

export function ProjectCard({
  id,
  title,
  description,
  status,
  progress,
  dueDate,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status].badge}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${statusStyles[status].progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
        <div className="space-x-2">
          <button
            onClick={() => onView(id)}
            className="text-blue-600 hover:text-blue-800"
          >
            View
          </button>
          <button
            onClick={() => onEdit(id)}
            className="text-gray-600 hover:text-gray-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
