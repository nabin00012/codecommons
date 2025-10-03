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
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ClassroomService } from "@/lib/services/classroom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";

export function JoinClassroom() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [classroomService, setClassroomService] =
    useState<ClassroomService | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setClassroomService(new ClassroomService());
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 dark:bg-blue-950/50 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Join a Classroom</CardTitle>
              <CardDescription>
                Enter the classroom code provided by your teacher
              </CardDescription>
            </div>
          </div>
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
                className="uppercase text-lg tracking-wider font-mono"
                maxLength={6}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                The code should be 6 characters long
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleJoin}
            disabled={isLoading || !classroomService || code.length !== 6}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join Classroom
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
