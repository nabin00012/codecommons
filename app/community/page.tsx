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
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 cosmic-text">Community</h1>
          <p className="text-muted-foreground">
            Connect with fellow students, join discussions, and participate in
            events
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search community..."
              className="pl-9 w-[200px] md:w-[300px]"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <Users className="h-4 w-4" />
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Discussions</h2>
            <Button className="cosmic-button">Start Discussion</Button>
          </div>

          <div className="grid gap-6">
            {discussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cosmic-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={discussion.author.avatar}
                          alt={discussion.author.name}
                        />
                        <AvatarFallback>
                          {discussion.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {discussion.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{discussion.author.name}</span>
                              <span>•</span>
                              <span>{discussion.author.department}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {discussion.timeAgo}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {discussion.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-muted/50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            {discussion.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            {discussion.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowRight className="h-4 w-4" />
                            View Discussion
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Events</h2>
            <Button className="cosmic-button">Create Event</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cosmic-card h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.organizer}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {event.attendees} / {event.maxAttendees} attendees
                      </div>
                      <Button
                        variant={event.isRegistered ? "outline" : "default"}
                      >
                        {event.isRegistered ? "Registered" : "Register"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Study Groups</h2>
            <Button className="cosmic-button">Create Group</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cosmic-card h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={group.avatar} alt={group.name} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{group.members} members</span>
                          <span>•</span>
                          <Badge
                            variant="outline"
                            className={
                              group.activity === "High"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          >
                            {group.activity} Activity
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {group.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-muted/50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      variant={group.isMember ? "outline" : "default"}
                    >
                      {group.isMember ? "View Group" : "Join Group"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
