"use client";
import { useUser } from "@/lib/context/user-context";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { assignmentService, type Assignment } from "@/lib/services/assignment";

export default function AssignmentsPage() {
  const { user } = useUser();
  const isTeacher = user?.role === "teacher";
  const router = useRouter();
  const params = useParams();
  const classroomId = params.id as string;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getAssignments(classroomId);
        setAssignments(data);
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [classroomId]);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {isTeacher && (
          <Button
            onClick={() =>
              router.push(
                `/dashboard/classrooms/${classroomId}/assignments/new`
              )
            }
            className="gap-2"
          >
            + Create Assignment
          </Button>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : assignments.length === 0 ? (
        <div>No assignments yet.</div>
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment._id}>{assignment.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
