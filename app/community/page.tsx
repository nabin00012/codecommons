"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MessageSquare,
  Calendar,
  Users,
  ThumbsUp,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Discussions from "./components/Discussions";
import Events from "./components/Events";
import Groups from "./components/Groups";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const router = useRouter();

  // Mock data for discussions
  const discussions = [
    {
      id: "1",
      title: "Best practices for React state management",
      author: {
        name: "Rahul Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        department: "Computer Science",
      },
      content:
        "I'm working on a large React application and need advice on state management. What are the best practices for handling complex state in React?",
      tags: ["React", "JavaScript", "State Management"],
      likes: 45,
      comments: 12,
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      title: "Getting started with Docker",
      author: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        department: "Software Engineering",
      },
      content:
        "I'm new to Docker and containerization. Can someone explain the basic concepts and share some resources for beginners?",
      tags: ["Docker", "DevOps", "Containers"],
      likes: 38,
      comments: 15,
      timeAgo: "5 hours ago",
    },
    {
      id: "3",
      title: "Career paths in AI and Machine Learning",
      author: {
        name: "Vikram Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        department: "AI & ML",
      },
      content:
        "I'm currently studying AI and ML and wondering about different career paths in this field. What roles should I be looking at, and what skills should I focus on developing?",
      tags: ["AI", "Machine Learning", "Career"],
      likes: 32,
      comments: 15,
      timeAgo: "1 day ago",
    },
    {
      id: "4",
      title: "Preparing for technical interviews",
      author: {
        name: "Nabin Chapagain",
        avatar: "/placeholder.svg?height=40&width=40",
        department: "Computer Science",
      },
      content:
        "I have some technical interviews coming up for software engineering internships. What's the best way to prepare? Any specific resources or practice strategies you'd recommend?",
      tags: ["Interviews", "Career", "Algorithms"],
      likes: 45,
      comments: 22,
      timeAgo: "2 days ago",
    },
  ];

  // Mock data for events
  const events = [
    {
      id: "1",
      title: "Web Development Workshop",
      organizer: "CodeCommons Club",
      date: "April 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Tech Hub, Room 302",
      description:
        "Learn modern web development techniques with React and Next.js. Bring your laptop and be ready to code!",
      attendees: 28,
      maxAttendees: 40,
      isRegistered: true,
    },
    {
      id: "2",
      title: "AI Ethics Panel Discussion",
      organizer: "AI Research Group",
      date: "April 20, 2025",
      time: "3:30 PM - 5:00 PM",
      location: "Main Auditorium",
      description:
        "Join us for a panel discussion on ethical considerations in artificial intelligence with industry experts and professors.",
      attendees: 45,
      maxAttendees: 100,
      isRegistered: false,
    },
    {
      id: "3",
      title: "Hackathon: Code for Good",
      organizer: "Jain University Tech Club",
      date: "May 5-7, 2025",
      time: "48-hour event",
      location: "Innovation Center",
      description:
        "A 48-hour hackathon focused on developing solutions for social good. Form teams and create impactful projects!",
      attendees: 120,
      maxAttendees: 150,
      isRegistered: false,
    },
  ];

  // Mock data for groups
  const groups = [
    {
      id: "1",
      name: "Web Development Club",
      description:
        "A community of web developers sharing knowledge and building projects together.",
      members: 124,
      avatar: "/placeholder.svg?height=80&width=80",
      isMember: true,
      tags: ["JavaScript", "React", "CSS"],
      activity: "High",
    },
    {
      id: "2",
      name: "AI & ML Research Group",
      description:
        "Discussing the latest in artificial intelligence and machine learning research and applications.",
      members: 98,
      avatar: "/placeholder.svg?height=80&width=80",
      isMember: false,
      tags: ["Python", "TensorFlow", "Data Science"],
      activity: "Medium",
    },
    {
      id: "3",
      name: "Competitive Programming",
      description:
        "Practice algorithmic problem solving and prepare for coding competitions.",
      members: 76,
      avatar: "/placeholder.svg?height=80&width=80",
      isMember: true,
      tags: ["Algorithms", "Data Structures", "Problem Solving"],
      activity: "High",
    },
    {
      id: "4",
      name: "Mobile App Developers",
      description:
        "For students interested in mobile app development for iOS and Android.",
      members: 65,
      avatar: "/placeholder.svg?height=80&width=80",
      isMember: false,
      tags: ["Flutter", "React Native", "Swift"],
      activity: "Medium",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Community</h1>

      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions">
          <Discussions />
        </TabsContent>

        <TabsContent value="events">
          <Events />
        </TabsContent>

        <TabsContent value="groups">
          <Groups />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Progress({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${(Math.min(Math.max(value, 0), max) / max) * 100}%` }}
      />
    </div>
  );
}
