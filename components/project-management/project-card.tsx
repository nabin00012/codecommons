"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MoreHorizontal,
  Trash2,
  Edit,
  ExternalLink,
  Users,
  MoreVertical,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Project } from "@/lib/models/project";

export type ProjectStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "overdue";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: Project["status"];
  progress: number;
  dueDate: Date;
  course?: string;
  members: number;
  stars?: number;
  thumbnail?: string;
  owner: {
    id: string;
    name: string;
    role: "student" | "teacher";
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function ProjectCard({
  id,
  title,
  description,
  status,
  progress,
  dueDate,
  course,
  members,
  stars = 0,
  thumbnail,
  owner,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Determine if current user can edit/delete this project
  const canModify = user?.role === "teacher" || user?.id === owner.id;

  // Status styling
  const statusStyles = {
    "not-started": {
      badge:
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      progress: "bg-slate-500",
    },
    "in-progress": {
      badge:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
      progress: "bg-blue-500",
    },
    completed: {
      badge:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900",
      progress: "bg-green-500",
    },
    overdue: {
      badge:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900",
      progress: "bg-red-500",
    },
  };

  const statusLabels = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Completed",
    overdue: "Overdue",
  };

  const handleClick = () => {
    router.push(`/projects/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        {thumbnail && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canModify && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={`${statusStyles[status].badge} font-medium`}>
                {statusLabels[status]}
              </Badge>
              {course && (
                <span className="text-sm text-muted-foreground">{course}</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4" />
                  {stars}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {members}
                </div>
              </div>
              <span>Due {dueDate.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
