"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Calendar,
  Users,
  ThumbsUp,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  User,
  Send,
  Heart,
  Bookmark,
  Share2,
  Star,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Helper function to format time ago
function formatTimeAgo(dateString: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    {
      id: "discussions",
      label: "Discussions",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "groups",
      label: "Groups",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <Users className="h-16 w-16 mx-auto text-primary drop-shadow-lg" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Community Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, collaborate, and grow with fellow developers
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions, events, or groups..."
              className="pl-12 h-14 text-lg border-2 border-primary/20 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl shadow-primary/50`
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="inline-block mr-2 h-5 w-5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "discussions" && <DiscussionsContent />}
          {activeTab === "events" && <EventsContent />}
          {activeTab === "groups" && <GroupsContent />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DiscussionsContent() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch("/api/discussions", {
        credentials: "include",
      });
      const data = await response.json();
      // API returns data.data format with questions collection
      const discussionData = data.data || [];
      // Transform API data to match UI expectations
      const formattedDiscussions = discussionData.map((d: any) => ({
        id: d._id,
        title: d.title,
        content: d.content,
        author: {
          name: d.author || "Anonymous",
          department: d.department || "Unknown",
          avatar: "/placeholder.svg",
        },
        tags: d.tags || [],
        likes: d.votes || 0,
        comments: d.answers || [],
        timeAgo: formatTimeAgo(d.createdAt),
        hasLiked: false,
      }));
      setDiscussions(formattedDiscussions);
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await fetch(`/api/discussions/${id}/like`, {
        method: "POST",
        credentials: "include",
      });
      fetchDiscussions();
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Discussions</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              <Plus className="mr-2 h-5 w-5" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Start a Discussion</DialogTitle>
            </DialogHeader>
            <DiscussionForm onClose={() => setIsDialogOpen(false)} onSuccess={fetchDiscussions} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : discussions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {discussions.map((discussion, index) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              index={index}
              onLike={handleLike}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No discussions yet"
          description="Be the first to start a discussion!"
          actionLabel="Start Discussion"
          onAction={() => setIsDialogOpen(true)}
        />
      )}
    </motion.div>
  );
}

function DiscussionCard({ discussion, index, onLike }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <Card className="overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card to-card/50 backdrop-blur group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={discussion.author?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20">
                {discussion.author?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                {discussion.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{discussion.author?.name}</span>
                <span>•</span>
                <span>{discussion.author?.department}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{discussion.timeAgo}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {discussion.content}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {discussion.tags?.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 hover:bg-primary/20 transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onLike(discussion.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  discussion.hasLiked
                    ? "bg-red-500 text-white"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <Heart className={`h-4 w-4 ${discussion.hasLiked ? "fill-current" : ""}`} />
                <span className="font-medium">{discussion.likes || 0}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">{discussion.comments?.length || 0}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all"
              >
                <Bookmark className="h-4 w-4" />
              </motion.button>
            </div>

            <Button
              variant="ghost"
              className="bg-gradient-to-r from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20"
            >
              View Discussion
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DiscussionForm({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Discussion created successfully",
        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Input
          placeholder="Discussion Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="What's on your mind?"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={6}
        />
      </div>
      <div>
        <Input
          placeholder="Tags (comma-separated, e.g., React, JavaScript)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-purple-600"
      >
        <Send className="mr-2 h-5 w-5" />
        {isSubmitting ? "Posting..." : "Post Discussion"}
      </Button>
    </form>
  );
}

function EventsContent() {
  const [events, setEvents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        credentials: "include",
      });
      const data = await response.json();
      // API returns data.events format
      const eventsData = data.events || [];
      // Transform API data to match UI expectations
      const formattedEvents = eventsData.map((e: any) => ({
        id: e._id,
        title: e.title,
        description: e.description,
        date: new Date(e.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: e.time || "TBD",
        location: e.location || "Online",
        organizer: e.organizer?.name || "Unknown",
        type: e.type || "Workshop",
        featured: e.featured || false,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Events</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-500/90 hover:to-pink-600/90">
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create Event</DialogTitle>
            </DialogHeader>
            <EventForm onClose={() => setIsDialogOpen(false)} onSuccess={fetchEvents} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="Be the first to create an event!"
          actionLabel="Create Event"
          onAction={() => setIsDialogOpen(true)}
        />
      )}
    </motion.div>
  );
}

function EventCard({ event, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className="h-full overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all duration-500 bg-gradient-to-br from-card to-card/50 backdrop-blur group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between mb-3">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {event.type || "Workshop"}
            </Badge>
            {event.featured && (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="relative space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-purple-500" />
            <span>{event.organizer}</span>
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-500/90 hover:to-pink-500/90">
            Register Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EventForm({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "Workshop",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Event created successfully",
        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <Input
        placeholder="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Textarea
        placeholder="Event Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        rows={4}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <Input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>
      <Input
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-600"
      >
        <Calendar className="mr-2 h-5 w-5" />
        {isSubmitting ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
}

function GroupsContent() {
  const [groups, setGroups] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/groups", {
        credentials: "include",
      });
      const data = await response.json();
      // API returns data.groups format
      const groupsData = data.groups || [];
      // Transform API data to match UI expectations
      const formattedGroups = groupsData.map((g: any) => ({
        id: g._id,
        name: g.name,
        description: g.description,
        tags: g.tags || [],
        members: g.members || [],
      }));
      setGroups(formattedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Groups</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-500/90 hover:to-red-600/90">
              <Plus className="mr-2 h-5 w-5" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create Group</DialogTitle>
            </DialogHeader>
            <GroupForm onClose={() => setIsDialogOpen(false)} onSuccess={fetchGroups} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <GroupCard key={group.id} group={group} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No groups yet"
          description="Be the first to create a group!"
          actionLabel="Create Group"
          onAction={() => setIsDialogOpen(true)}
        />
      )}
    </motion.div>
  );
}

function GroupCard({ group, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className="h-full overflow-hidden border-2 border-transparent hover:border-orange-500/50 transition-all duration-500 bg-gradient-to-br from-card to-card/50 backdrop-blur group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">
                {group.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {group.members?.length || 0} members
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {group.description}
          </p>
        </CardHeader>

        <CardContent className="relative">
          <div className="flex flex-wrap gap-2 mb-4">
            {group.tags?.slice(0, 3).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-500/90 hover:to-red-500/90">
            Join Group
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GroupForm({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Group created successfully",
        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <Input
        placeholder="Group Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Textarea
        placeholder="Group Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        rows={4}
      />
      <Input
        placeholder="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-red-600"
      >
        <Users className="mr-2 h-5 w-5" />
        {isSubmitting ? "Creating..." : "Create Group"}
      </Button>
    </form>
  );
}

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="relative inline-block mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl"
        />
        <Icon className="relative h-20 w-20 mx-auto text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button
        onClick={onAction}
        className="bg-gradient-to-r from-primary to-purple-600"
      >
        <Plus className="mr-2 h-5 w-5" />
        {actionLabel}
      </Button>
    </motion.div>
  );
}
