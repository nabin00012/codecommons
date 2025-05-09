"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { assignmentService } from "@/lib/services/assignment";

export default function NewAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const classroomId = params.id as string;
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: 10,
    submissionType: "file" as "code" | "file" | "text",
    codeTemplate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await assignmentService.createAssignment({
        ...form,
        classroomId,
        points: Number(form.points),
      });
      toast({ title: "Assignment created!" });
      router.push(`/dashboard/classrooms/${classroomId}/assignments`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                name="points"
                type="number"
                min={1}
                value={form.points}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="submissionType">Submission Type</Label>
              <select
                id="submissionType"
                name="submissionType"
                value={form.submissionType}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="code">Code</option>
                <option value="file">File</option>
                <option value="text">Text</option>
              </select>
            </div>
            {form.submissionType === "code" && (
              <div>
                <Label htmlFor="codeTemplate">Code Template (optional)</Label>
                <Textarea
                  id="codeTemplate"
                  name="codeTemplate"
                  value={form.codeTemplate}
                  onChange={handleChange}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
