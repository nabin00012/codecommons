"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Plus,
  TrendingUp,
  Heart,
  Bookmark,
  MessageSquare,
  ExternalLink,
  Filter,
  Sparkles,
  Zap,
  Code,
  Brain,
  Briefcase,
  Palette,
  Database,
  Shield,
  X,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/lib/context/user-context";
import { useToast } from "@/components/ui/use-toast";

const categories = [
  { name: "All", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { name: "Web Dev", icon: Code, color: "from-blue-500 to-cyan-500" },
  { name: "DSA", icon: Brain, color: "from-green-500 to-emerald-500" },
  { name: "AI/ML", icon: Zap, color: "from-orange-500 to-red-500" },
  { name: "Interview Prep", icon: Briefcase, color: "from-yellow-500 to-orange-500" },
  { name: "Design", icon: Palette, color: "from-pink-500 to-rose-500" },
  { name: "Database", icon: Database, color: "from-indigo-500 to-purple-500" },
  { name: "Security", icon: Shield, color: "from-red-500 to-pink-500" },
];

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  upvotes: number;
  bookmarks: number;
  comments: number;
  isVerified?: boolean;
  author: {
    name: string;
    role: string;
  };
  createdAt: string;
  hasUpvoted?: boolean;
  hasBookmarked?: boolean;
}

export default function ResourcesPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
  });

  useEffect(() => {
    setMounted(true);
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [selectedCategory, searchQuery, resources]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/resources", {
        credentials: "include",
      });
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newResource),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Resource added successfully",
        });
        setIsDialogOpen(false);
        setNewResource({ title: "", description: "", category: "", link: "" });
        fetchResources();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      await fetch(`/api/resources/${id}/upvote`, {
        method: "POST",
        credentials: "include",
      });
      fetchResources();
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleBookmark = async (id: string) => {
    try {
      await fetch(`/api/resources/${id}/bookmark`, {
        method: "POST",
        credentials: "include",
      });
      fetchResources();
    } catch (error) {
      console.error("Failed to bookmark:", error);
    }
  };

  const topResources = [...resources]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
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
          className="mb-12 text-center"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <BookOpen className="h-16 w-16 mx-auto text-primary drop-shadow-lg" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Resource Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, share, and upvote the best learning resources curated by
            our community
          </p>
        </motion.div>

        {/* Search and Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-12 h-14 text-lg border-2 border-primary/20 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Resource
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Share a Resource</DialogTitle>
                <DialogDescription>
                  Help the community by sharing an awesome learning resource!
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Input
                    placeholder="Resource Title"
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource({ ...newResource, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Description (what makes this resource valuable?)"
                    value={newResource.description}
                    onChange={(e) =>
                      setNewResource({
                        ...newResource,
                        description: e.target.value,
                      })
                    }
                    required
                    rows={4}
                  />
                </div>
                <div>
                  <Select
                    value={newResource.category}
                    onValueChange={(value) =>
                      setNewResource({ ...newResource, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    placeholder="Resource Link (URL)"
                    type="url"
                    value={newResource.link}
                    onChange={(e) =>
                      setNewResource({ ...newResource, link: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-purple-600"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Submit Resource
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-primary/50`
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="inline-block mr-2 h-4 w-4" />
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Top Resources of the Week */}
        {topResources.length > 0 && selectedCategory === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Top Resources This Week</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topResources.slice(0, 3).map((resource, index) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  index={index}
                  onUpvote={handleUpvote}
                  onBookmark={handleBookmark}
                  isTopResource
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Resources Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              {selectedCategory === "All"
                ? "All Resources"
                : `${selectedCategory} Resources`}
            </h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {filteredResources.length} resources
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  index={index}
                  onUpvote={handleUpvote}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share a resource in this category!
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-purple-600"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Resource
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ResourceCard({
  resource,
  index,
  onUpvote,
  onBookmark,
  isTopResource,
}: {
  resource: Resource;
  index: number;
  onUpvote: (id: string) => void;
  onBookmark: (id: string) => void;
  isTopResource?: boolean;
}) {
  const category = categories.find((c) => c.name === resource.category);
  const Icon = category?.icon || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className="h-full relative overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-500 bg-gradient-to-br from-card to-card/50 backdrop-blur">
        {/* Animated background glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            category?.color || "from-primary to-purple-500"
          } opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Top Resource Badge */}
        {isTopResource && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </motion.div>
          </div>
        )}

        {/* Verified Badge */}
        {resource.isVerified && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Check className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}

        <CardHeader className="relative pb-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${
                category?.color || "from-primary to-purple-500"
              } text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <Badge
                variant="secondary"
                className="mb-2 text-xs font-semibold"
              >
                {resource.category}
              </Badge>
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                {resource.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {resource.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              By <span className="font-medium">{resource.author.name}</span>
              {resource.author.role === "teacher" && (
                <Badge variant="outline" className="ml-1 text-xs">
                  Teacher
                </Badge>
              )}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpvote(resource._id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                resource.hasUpvoted
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  resource.hasUpvoted ? "fill-current" : ""
                }`}
              />
              <span className="text-sm font-medium">{resource.upvotes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onBookmark(resource._id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                resource.hasBookmarked
                  ? "bg-yellow-500 text-white"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  resource.hasBookmarked ? "fill-current" : ""
                }`}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{resource.comments}</span>
            </motion.button>

            <motion.a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-auto flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm font-medium">View</span>
            </motion.a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
