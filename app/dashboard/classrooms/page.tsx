"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import {
  Plus,
  Search,
  Users,
  ArrowRight,
  School,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ClassroomService, type Classroom } from "@/lib/services/classroom";
import { authService } from "@/lib/services/auth";
import { JoinClassroom } from "./join-classroom";

export default function ClassroomsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isTeacher] = useState(user?.role === "teacher");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    description: "",
    semester: "",
  });
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");

      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const classroomService = new ClassroomService(token);
      const data = await classroomService.getClassrooms();
      setClassrooms(data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      setIsError(true);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch classrooms"
      );
      toast({
        title: "Error",
        description: "Failed to fetch classrooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter classrooms based on search query
  const filteredClassrooms = classrooms.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get emoji based on role
  const getEmoji = () => {
    return user?.role === "teacher" ? "👩‍🏫" : "👨‍💻";
  };

  // Handle classroom creation
  const handleCreateClassroom = async () => {
    try {
      setError("");
      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const classroomService = new ClassroomService(token);
      const classroom = await classroomService.createClassroom(newClassroom);
      setClassrooms([classroom, ...classrooms]);
      setIsCreateModalOpen(false);
      setNewClassroom({ name: "", description: "", semester: "" });
      toast({
        title: "Success",
        description: "Classroom created successfully!",
      });
    } catch (error: any) {
      setError(error.message || "Failed to create classroom");
      toast({
        title: "Error",
        description: error.message || "Failed to create classroom",
        variant: "destructive",
      });
    }
  };

  const handleJoinClassroom = async () => {
    try {
      setError("");
      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const classroomService = new ClassroomService(token);
      const classroom = await classroomService.joinClassroomByCode(joinCode);
      setClassrooms([...classrooms, classroom]);
      setIsJoinModalOpen(false);
      setJoinCode("");
      toast({
        title: "Success",
        description: "Joined classroom successfully!",
      });
    } catch (error: any) {
      setError(error.message || "Failed to join classroom");
      toast({
        title: "Error",
        description: error.message || "Failed to join classroom",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Classrooms</h2>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Button onClick={fetchClassrooms}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Classrooms</h1>
        {isTeacher ? (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Classroom
          </button>
        ) : (
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Join Classroom
          </button>
        )}
      </div>

      {/* Create Classroom Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create Classroom</h2>
            <input
              type="text"
              value={newClassroom.name}
              onChange={(e) =>
                setNewClassroom({ ...newClassroom, name: e.target.value })
              }
              placeholder="Classroom Name"
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              value={newClassroom.semester}
              onChange={(e) =>
                setNewClassroom({ ...newClassroom, semester: e.target.value })
              }
              placeholder="Semester"
              className="w-full p-2 border rounded mb-4"
            />
            <textarea
              value={newClassroom.description}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  description: e.target.value,
                })
              }
              placeholder="Description"
              className="w-full p-2 border rounded mb-4"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClassroom}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Classroom Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Join Classroom</h2>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter classroom code"
              className="w-full p-2 border rounded mb-4"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinClassroom}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classrooms Grid */}
      {isTeacher ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom) => (
            <Card
              key={classroom._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{classroom.name}</span>
                  <Badge variant="secondary">Code: {classroom.code}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {classroom.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <School className="w-4 h-4" />
                  <span>{classroom.semester}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Users className="w-4 h-4" />
                  <span>{classroom.students.length} Students</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    router.push(`/dashboard/classrooms/${classroom._id}`)
                  }
                  className="w-full"
                >
                  View Classroom
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <JoinClassroom />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
              <Card
                key={classroom._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{classroom.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {classroom.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <School className="w-4 h-4" />
                    <span>{classroom.semester}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Users className="w-4 h-4" />
                    <span>{classroom.students.length} Students</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      router.push(`/dashboard/classrooms/${classroom._id}`)
                    }
                    className="w-full"
                  >
                    View Classroom
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
