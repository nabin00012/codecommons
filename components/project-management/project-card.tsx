"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MoreHorizontal, Trash2, Edit, ExternalLink, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useUser } from "@/lib/context/user-context"

export type ProjectStatus = "not-started" | "in-progress" | "completed" | "overdue"

export interface ProjectCardProps {
  id: string
  title: string
  description: string
  status: ProjectStatus
  progress: number
  dueDate: string
  course?: string
  members?: number
  owner: {
    id: string
    name: string
    role: "student" | "teacher"
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function ProjectCard({
  id,
  title,
  description,
  status,
  progress,
  dueDate,
  course,
  members = 1,
  owner,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) {
  const { user } = useUser()
  const [isHovered, setIsHovered] = useState(false)

  // Determine if current user can edit/delete this project
  const canModify = user?.role === "teacher" || user?.id === owner.id

  // Status styling
  const statusStyles = {
    "not-started": {
      badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      progress: "bg-slate-500",
    },
    "in-progress": {
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900",
      progress: "bg-blue-500",
    },
    completed: {
      badge:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900",
      progress: "bg-green-500",
    },
    overdue: {
      badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900",
      progress: "bg-red-500",
    },
  }

  const statusLabels = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Completed",
    overdue: "Overdue",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full flex flex-col border-primary/10 overflow-hidden cosmic-card",
          status === "overdue" && "border-l-2 border-l-red-500",
          status === "completed" && "border-l-2 border-l-green-500",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {canModify && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit?.(id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete?.(id)}
                      className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Badge variant="outline" className={statusStyles[status].badge}>
            {statusLabels[status]}
          </Badge>
        </CardHeader>

        <CardContent className="flex-grow pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className={cn("h-1.5", statusStyles[status].progress)} />
            </div>

            {course && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>{course}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>Due {dueDate}</span>
              </div>

              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                <span>
                  {members} {members === 1 ? "member" : "members"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => onView?.(id)}>
            View Project
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
