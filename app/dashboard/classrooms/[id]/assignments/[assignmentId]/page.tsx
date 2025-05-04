"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/context/user-context"
import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react"
import Link from "next/link"

// Mock assignment data
const assignments = [
  {
    id: "a1",
    classroomId: "1",
    title: "Assignment 1: Array Implementation",
    description:
      "In this assignment, you will implement various array operations such as insertion, deletion, and searching. You will also analyze the time complexity of each operation.\n\n## Requirements\n\n1. Implement a dynamic array class with the following methods:\n   - `insert(index, value)`\n   - `delete(index)`\n   - `search(value)`\n   - `get(index)`\n   - `size()`\n\n2. Write test cases to verify your implementation.\n\n3. Analyze the time complexity of each operation and explain your analysis.\n\n## Submission Guidelines\n\n- Submit your code as a single file named `DynamicArray.java`.\n- Include comments to explain your implementation.\n- Write a brief report (maximum 2 pages) explaining your approach and time complexity analysis.",
    dueDate: "April 15, 2024",
    points: 100,
    status: "pending",
    submissionType: "code",
    codeTemplate: `public class DynamicArray {
    private int[] array;
    private int size;
    private int capacity;
    
    public DynamicArray() {
        // TODO: Initialize the array with a default capacity
    }
    
    public void insert(int index, int value) {
        // TODO: Implement insertion at the specified index
    }
    
    public void delete(int index) {
        // TODO: Implement deletion at the specified index
    }
    
    public int search(int value) {
        // TODO: Implement search and return the index of the value
        return -1; // Return -1 if not found
    }
    
    public int get(int index) {
        // TODO: Return the value at the specified index
        return 0;
    }
    
    public int size() {
        // TODO: Return the current size of the array
        return 0;
    }
    
    // You may add helper methods as needed
}`,
  },
  // More assignments...
]

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const classroomId = params.id as string
  const assignmentId = params.assignmentId as string
  
  const assignment = assignments.find((a) => a.id === assignmentId && a.classroomId === classroomId)
  
  if (!assignment) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Assignment not found</h1>
        <p className="text-muted-foreground mb-6">The assignment you're looking for doesn't exist.</p>
        <Button onClick={() => router.push(`/dashboard/classrooms/${classroomId}`)}>Back to Classroom</Button>
      </div>
    )
  }
  
  const isTeacher = user?.role === "teacher"
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }
  
  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Assignment submitted successfully!",
        description: "Your submission has been received.",
      })
      setIsSubmitting(false)
      router.push(`/dashboard/classrooms/${classroomId}`)
    }, 1500)
  }
  
  return (
    <div className="container py-8">
      <Link
        href={`/dashboard/classrooms/${classroomId}`}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Classroom
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due {assignment.dueDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{assignment.points} points</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Status: {assignment.status}</span>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {assignment.description.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("##")) {
                    return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.replace("##", "").trim()}</h2>
                  } else if (paragraph.startsWith("-")) {
                    return (
                      <ul key={index} className="list-disc pl-6 my-3">
                        {paragraph.split("\n").map((item, i) => (
                          <li key={i}>{item.replace("-", "").trim()}</li>
                        ))}
                      </ul>
                    )
                  } else if (paragraph.startsWith("1.")) {
                    return (
                      <ol key={index} className="list-decimal pl-6 my-3">
                        {paragraph.split("\n").map((item, i) => {
                          const match = item.match(/^\d+\.\s(.+)/)
                          return match ? <li key={i}>{match[1]}</li> : null
                        })}
                      </ol>
                    )
                  } else {
                    return <p key={index} className="mb-4">{paragraph}</p>
                  }
                })}
              </div>

\
