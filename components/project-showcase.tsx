"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Github, Eye, Code, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSpotlightEffect } from "@/hooks/use-spotlight-effect"

// Define the project type
export interface Project {
  id: string
  title: string
  description: string
  thumbnail: string
  demoUrl?: string
  githubUrl?: string
  technologies: string[]
  featured: boolean
}

interface ProjectShowcaseProps {
  username: string
  projects: Project[]
}

export function ProjectShowcase({ username, projects }: ProjectShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "featured">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  // Use our custom spotlight effect hook
  useSpotlightEffect()

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter projects based on active filter
  const filteredProjects = activeFilter === "all" ? projects : projects.filter((project) => project.featured)

  // Generate a deterministic gradient for each project based on project id
  const getGradientForProject = (projectId: string) => {
    const gradients = [
      "from-violet-500 to-indigo-600",
      "from-fuchsia-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-emerald-500 to-teal-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
    ]
    // Use project id to generate consistent gradient
    const index = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
    return gradients[index];
  }

  return (
    <section className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 cosmic-text">
            <Code className="h-5 w-5 text-primary cosmic-glow" />
            Project Showcase
          </h2>
          <p className="text-muted-foreground">Explore {username}'s portfolio of projects and contributions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className="project-filter-btn"
          >
            All Projects
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "featured" ? "default" : "outline"}
            onClick={() => setActiveFilter("featured")}
            className="project-filter-btn"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Featured
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-primary/10 project-card-skeleton">
              <div className="h-48 bg-muted animate-pulse rounded-t-lg" />
              <CardHeader className="animate-pulse">
                <div className="h-6 w-3/4 bg-muted rounded-md" />
                <div className="h-4 w-full bg-muted rounded-md mt-2" />
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-4 w-5/6 bg-muted rounded-md mt-2" />
              </CardContent>
              <CardFooter className="animate-pulse">
                <div className="h-8 w-full bg-muted rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "project-card overflow-hidden h-full flex flex-col",
                    hoveredProject === project.id ? "project-card-hovered" : "",
                  )}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="relative h-48 overflow-hidden group">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-90 transition-all duration-500",
                        getGradientForProject(project.id),
                        "group-hover:opacity-100 transform group-hover:scale-105",
                      )}
                    />
                    <Image
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white border-none shadow-lg flex items-center gap-1 px-3 py-1">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Overlay with buttons that appear on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                      <Button size="sm" className="project-action-btn">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>

                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white"
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      )}

                      {project.demoUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="project-title text-lg font-semibold">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2 project-description">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow pt-0">
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="project-tech-badge text-xs py-0 h-5">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2 pt-2 pb-4">
                    <Button className="project-view-btn w-full gap-1 relative overflow-hidden" size="sm">
                      <span className="relative z-10 flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View Project
                      </span>
                    </Button>
                  </CardFooter>

                  {/* Spotlight overlay effect */}
                  <div className="spotlight-effect"></div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  )
}
