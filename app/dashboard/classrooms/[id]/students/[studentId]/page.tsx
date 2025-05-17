"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MapPin,
  Calendar,
  Code2,
  Trophy,
  Star,
  MessageSquare,
  Activity,
  ArrowLeft,
  Github,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/lib/services/auth";
import { useUser } from "@/lib/context/user-context";

interface Student {
  _id: string;
  name: string;
  email: string;
  location: string;
  course: string;
  semester: string;
  joinDate: string;
  points: number;
  solutions: number;
  questions: number;
  languages: Array<{
    name: string;
    proficiency: number;
  }>;
  achievements: Array<{
    title: string;
    date: string;
  }>;
  recentActivity: Array<{
    type: "answer" | "question";
    title: string;
    points: number;
    date: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    githubLink: string;
    demoLink?: string;
    isFeatured: boolean;
  }>;
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `/api/classrooms/${params.id}/students/${params.studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
        toast({
          title: "Error",
          description: "Failed to load student profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [params.id, params.studentId, toast, router]);

  // Check if user is authorized to view this profile
  const isAuthorized =
    user?.role === "teacher" ||
    (user?.role === "student" && student?._id === user?.id);

  if (!isAuthorized) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to view this profile.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="gap-2 mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Classroom
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {student.name[0]}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-1">{student.name}</h1>
                <p className="text-muted-foreground">Student</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{student.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Joined {new Date(student.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">Achievements</h3>
                <div className="space-y-3">
                  {student.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Top Languages</h3>
              <div className="space-y-4">
                {student.languages.map((language, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span>{language.name}</span>
                      <span>{language.proficiency}%</span>
                    </div>
                    <Progress value={language.proficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity and Projects */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{student.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{student.solutions}</div>
                  <div className="text-sm text-muted-foreground">Solutions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{student.questions}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
              </div>

              <Tabs defaultValue="activity">
                <TabsList className="mb-4">
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="activity">
                  <div className="space-y-4">
                    {student.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="p-2 rounded-full bg-primary/10">
                          {activity.type === "answer" ? (
                            <MessageSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Activity className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === "answer" ? "Answered" : "Asked"}{" "}
                            {activity.date}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          +{activity.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="projects">
                  <div className="grid gap-4">
                    {student.projects.map((project, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">
                                {project.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {project.description}
                              </p>
                            </div>
                            {project.isFeatured && (
                              <Badge className="bg-yellow-500/10 text-yellow-500">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="secondary"
                                className="gap-1"
                              >
                                <Code2 className="h-3 w-3" />
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                window.open(project.githubLink, "_blank")
                              }
                            >
                              <Github className="h-4 w-4" />
                              View on GitHub
                            </Button>
                            {project.demoLink && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() =>
                                  window.open(project.demoLink, "_blank")
                                }
                              >
                                <ExternalLink className="h-4 w-4" />
                                Live Demo
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
