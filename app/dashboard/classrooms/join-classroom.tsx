"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ClassroomService } from "@/lib/services/classroom";
import { useRouter } from "next/navigation";

export function JoinClassroom() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [classroomService, setClassroomService] =
    useState<ClassroomService | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setClassroomService(new ClassroomService(token));
    }
  }, []);

  const handleJoin = async () => {
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter a classroom code",
        variant: "destructive",
      });
      return;
    }

    if (!classroomService) {
      toast({
        title: "Error",
        description: "Please log in to join a classroom",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const classroom = await classroomService.joinClassroomByCode(code);
      toast({
        title: "Success",
        description: `Joined classroom: ${classroom.name}`,
      });
      router.push(`/dashboard/classrooms/${classroom._id}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to join classroom",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join a Classroom</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Classroom Code
            </label>
            <Input
              id="code"
              placeholder="Enter classroom code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="uppercase"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleJoin}
          disabled={isLoading || !classroomService}
          className="w-full"
        >
          {isLoading ? "Joining..." : "Join Classroom"}
        </Button>
      </CardFooter>
    </Card>
  );
}
