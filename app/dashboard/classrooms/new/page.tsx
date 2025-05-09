"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, School } from "lucide-react";
import Link from "next/link";
import { classroomService } from "@/lib/services/classroom";

export default function NewClassroomPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const classroom = await classroomService.createClassroom(formData);
      toast({
        title: "Classroom Created",
        description: `${classroom.name} has been created successfully.`,
      });
      router.push("/dashboard/classrooms");
    } catch (error) {
      console.error("Error creating classroom:", error);
      toast({
        title: "Error",
        description: "Failed to create classroom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Link
        href="/dashboard/classrooms"
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Classrooms
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Classroom</h1>
            <p className="text-muted-foreground">
              Set up a new classroom for your students
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Classroom Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Classroom Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Advanced Web Development"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what students will learn in this classroom..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <School className="mr-2 h-4 w-4" />
                      Create Classroom
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
