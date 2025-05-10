"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { ClassroomService } from "@/lib/services/classroom";
import { authService } from "@/lib/services/auth";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function JoinClassroomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStudent = user?.role === "student";

  if (!isStudent) {
    router.push("/dashboard/classrooms");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const classroomServiceInstance = new ClassroomService(token);
      await classroomServiceInstance.joinClassroomByCode(code);

      toast({
        title: "Success",
        description: "Joined classroom successfully",
      });

      router.push("/dashboard/classrooms");
    } catch (error) {
      console.error("Error joining classroom:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to join classroom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Join Classroom</h1>

          <Card>
            <CardHeader>
              <CardTitle>Enter Classroom Code</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Classroom Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the classroom code"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/classrooms")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Classroom"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
