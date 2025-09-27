"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/context/user-context";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Calendar,
  Users,
  Plus,
  Search,
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  UserPlus,
  UserMinus,
  ExternalLink,
  Filter,
  TrendingUp,
  Star,
} from "lucide-react";

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  authorRole: string;
  tags: string[];
  likes: number;
  replies: number;
  createdAt: string;
  isPinned: boolean;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  organizerName: string;
  attendees: string[];
  maxAttendees: number;
  createdAt: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  members: string[];
  tags: string[];
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
}

export default function CommunityPage() {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: "",
  });
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxAttendees: "50",
  });
  
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    tags: "",
    isPrivate: false,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch discussions
        const discussionsResponse = await fetch("/api/discussions", {
          credentials: "include",
        });
        
        if (discussionsResponse.ok) {
          const discussionsData = await discussionsResponse.json();
          setDiscussions(discussionsData.data || []);
        }

        // Fetch events
        const eventsResponse = await fetch("/api/events", {
          credentials: "include",
        });
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.data || []);
        }

        // Fetch groups
        const groupsResponse = await fetch("/api/groups", {
          credentials: "include",
        });
        
        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          setGroups(groupsData.data || []);
        }

      } catch (error) {
        console.error("Error fetching community data:", error);
        toast({
          title: "Error",
          description: "Failed to load community data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...newDiscussion,
          tags: newDiscussion.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(prev => [data.data, ...prev]);
        setNewDiscussion({ title: "", content: "", tags: "" });
        setShowDiscussionForm(false);
        toast({
          title: "Success",
          description: "Discussion created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(prev => [data.data, ...prev]);
        setNewEvent({ title: "", description: "", date: "", location: "", maxAttendees: "50" });
        setShowEventForm(false);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...newGroup,
          tags: newGroup.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGroups(prev => [data.data, ...prev]);
        setNewGroup({ name: "", description: "", tags: "", isPrivate: false });
        setShowGroupForm(false);
        toast({
          title: "Success",
          description: "Group created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setGroups(prev => prev.map(group => 
          group._id === groupId 
            ? { ...group, members: [...group.members, user?.email || ""] }
            : group
        ));
        toast({
          title: "Success",
          description: "Joined group successfully",
        });
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
    }
  };

  const handleAttendEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/attend`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setEvents(prev => prev.map(event => 
          event._id === eventId 
            ? { ...event, attendees: [...event.attendees, user?.email || ""] }
            : event
        ));
        toast({
          title: "Success",
          description: "You're now attending this event",
        });
      }
    } catch (error) {
      console.error("Error attending event:", error);
      toast({
        title: "Error",
        description: "Failed to attend event",
        variant: "destructive",
      });
    }
  };

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Community Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect, discuss, and collaborate with your peers
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search discussions, events, and groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Community Discussions</h2>
              <Button onClick={() => setShowDiscussionForm(!showDiscussionForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </div>

            {/* Create Discussion Form */}
            {showDiscussionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Start a Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateDiscussion} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Discussion title"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="What would you like to discuss?"
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Tags (comma-separated)"
                        value={newDiscussion.tags}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Post Discussion
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowDiscussionForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <Card key={discussion._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {discussion.isPinned && <Star className="h-4 w-4 text-yellow-500" />}
                          <CardTitle className="text-lg">{discussion.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="text-xs">
                                {discussion.authorName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {discussion.authorName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(discussion.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {discussion.replies} replies
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {discussion.likes} likes
                          </div>
                        </div>
                      </div>
                      <Badge variant={discussion.authorRole === "teacher" ? "default" : "secondary"}>
                        {discussion.authorRole === "teacher" ? "👨‍🏫 Teacher" : "👨‍🎓 Student"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {discussion.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <Button onClick={() => setShowEventForm(!showEventForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Create Event Form */}
            {showEventForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Event title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Event description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="datetime-local"
                          placeholder="Event date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Max attendees"
                          type="number"
                          value={newEvent.maxAttendees}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Input
                        placeholder="Location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowEventForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <Card key={event._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        {event.attendees.length} / {event.maxAttendees} attendees
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {event.attendees.includes(user?.email || "") ? (
                        <Badge variant="default">Attending</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleAttendEvent(event._id)}
                          disabled={event.attendees.length >= parseInt(event.maxAttendees)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Attend
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Study Groups</h2>
              <Button onClick={() => setShowGroupForm(!showGroupForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            {/* Create Group Form */}
            {showGroupForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Group name"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Group description"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Tags (comma-separated)"
                        value={newGroup.tags}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, tags: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="private"
                        checked={newGroup.isPrivate}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      />
                      <label htmlFor="private" className="text-sm">Private group</label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Users className="h-4 w-4 mr-2" />
                        Create Group
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowGroupForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Groups List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <Card key={group._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant={group.isPrivate ? "secondary" : "default"}>
                        {group.isPrivate ? "Private" : "Public"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {group.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        {group.members.length} members
                      </div>
                      <div className="flex gap-2">
                        {group.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {group.members.includes(user?.email || "") ? (
                        <Badge variant="default">Member</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinGroup(group._id)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Join Group
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}