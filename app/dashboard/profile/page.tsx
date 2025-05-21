"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { useAuth } from "@/lib/context/AuthContext";
import { authService } from "@/lib/services/auth";
import {
  Github,
  Linkedin,
  Globe,
  MapPin,
  GraduationCap,
  Calendar,
  User,
  Mail,
  Code2,
  Star,
  Plus,
  Save,
  Sparkles,
  Trophy,
  Award,
  Briefcase,
  BookOpen,
  Languages,
  Lightbulb,
  Edit2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  name: string;
  email: string;
  location: string;
  course: string;
  semester: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: string[];
  languages: Array<{
    name: string;
    proficiency: number;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const languageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    location: "",
    course: "",
    semester: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    skills: [],
    languages: [],
  });

  // Force re-render when edit mode changes
  const [editModeKey, setEditModeKey] = useState(0);

  useEffect(() => {
    if (isEditing) {
      setEditModeKey((prev) => prev + 1);
    }
  }, [isEditing]);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, router, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditToggle = () => {
    console.log("Edit button clicked");
    console.log("Current isEditing state:", isEditing);
    setIsEditing((prev) => !prev);
    // Force a re-render when toggling edit mode
    setEditModeKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    fetchProfile();
    setIsEditing(false);
    // Force a re-render when canceling
    setEditModeKey((prev) => prev + 1);
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    console.log("Input change:", { field, value });
    setProfileData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("Updated profile data:", newData);
      return newData;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save button clicked");
    console.log("Current profile data:", profileData);

    if (!token) {
      console.error("No token available");
      toast({
        title: "Error",
        description: "Authentication token is missing. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      console.log("Profile update response status:", response.status);
      const data = await response.json();
      console.log("Profile update response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfileData(data);
      setIsEditing(false);
      // Force a re-render after saving
      setEditModeKey((prev) => prev + 1);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add effect to handle edit mode changes
  useEffect(() => {
    console.log("Edit mode changed:", isEditing);
    if (isEditing) {
      // Force a re-render when entering edit mode
      setEditModeKey((prev) => prev + 1);
    }
  }, [isEditing]);

  // Add effect to handle profile data changes
  useEffect(() => {
    console.log("Profile data updated:", profileData);
  }, [profileData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-muted py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className={`border-primary/10 shadow-2xl backdrop-blur-sm bg-background/80 relative overflow-hidden ${
              isEditing ? "ring-2 ring-primary" : ""
            }`}
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

            <CardHeader className="space-y-4 pb-8 relative">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Profile Settings
                  </CardTitle>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground mt-2 text-lg"
                  >
                    {isEditing
                      ? "Edit your profile information"
                      : "View your profile information"}
                  </motion.p>
                </motion.div>
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg"
                  >
                    <User className="h-10 w-10 text-primary" />
                  </motion.div>
                  {!isEditing ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Button
                        onClick={handleEditToggle}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform transition-all duration-300 hover:shadow-lg"
                      >
                        <Edit2 className="h-5 w-5 mr-2" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex gap-2"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="border-primary/20 hover:border-primary/40 transform transition-all duration-300 hover:shadow-lg"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        form="profile-form"
                        disabled={isSaving}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform transition-all duration-300 hover:shadow-lg"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form
                id="profile-form"
                onSubmit={handleSave}
                className="space-y-8"
                key={editModeKey}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      <User className="h-5 w-5 text-primary" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                        {profileData.name || "Not specified"}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      Email
                    </Label>
                    <div className="p-3 rounded-md bg-background/50 border border-primary/10">
                      {profileData.email}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      <MapPin className="h-5 w-5 text-primary" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="Enter your location"
                        className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                        {profileData.location || "Not specified"}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="course"
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Course
                    </Label>
                    {isEditing ? (
                      <Input
                        id="course"
                        value={profileData.course}
                        onChange={(e) =>
                          handleInputChange("course", e.target.value)
                        }
                        placeholder="Enter your course"
                        className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                        {profileData.course || "Not specified"}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="semester"
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      <Calendar className="h-5 w-5 text-primary" />
                      Semester
                    </Label>
                    {isEditing ? (
                      <Input
                        id="semester"
                        value={profileData.semester}
                        onChange={(e) =>
                          handleInputChange("semester", e.target.value)
                        }
                        placeholder="Enter your semester"
                        className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                        {profileData.semester || "Not specified"}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2 md:col-span-2"
                  >
                    <Label
                      htmlFor="bio"
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      <User className="h-5 w-5 text-primary" />
                      Bio
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        placeholder="Tell us about yourself"
                        rows={4}
                        className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="p-4 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300 min-h-[100px]">
                        {profileData.bio || "No bio provided"}
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Social Links
                    </h3>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="githubUrl"
                        className="flex items-center gap-2"
                      >
                        <Github className="h-5 w-5 text-primary" />
                        GitHub
                      </Label>
                      {isEditing ? (
                        <Input
                          id="githubUrl"
                          value={profileData.githubUrl}
                          onChange={(e) =>
                            handleInputChange("githubUrl", e.target.value)
                          }
                          placeholder="https://github.com/username"
                          className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                          {profileData.githubUrl || "Not specified"}
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="linkedinUrl"
                        className="flex items-center gap-2"
                      >
                        <Linkedin className="h-5 w-5 text-primary" />
                        LinkedIn
                      </Label>
                      {isEditing ? (
                        <Input
                          id="linkedinUrl"
                          value={profileData.linkedinUrl}
                          onChange={(e) =>
                            handleInputChange("linkedinUrl", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/username"
                          className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                          {profileData.linkedinUrl || "Not specified"}
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="portfolioUrl"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-5 w-5 text-primary" />
                        Portfolio
                      </Label>
                      {isEditing ? (
                        <Input
                          id="portfolioUrl"
                          value={profileData.portfolioUrl}
                          onChange={(e) =>
                            handleInputChange("portfolioUrl", e.target.value)
                          }
                          placeholder="https://your-portfolio.com"
                          className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                          {profileData.portfolioUrl || "Not specified"}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2"
                  >
                    <Code2 className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Skills
                    </h3>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="skills"
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      <Star className="h-5 w-5 text-primary" />
                      Skills
                    </Label>
                    {isEditing ? (
                      <Input
                        id="skills"
                        value={profileData.skills.join(", ")}
                        onChange={(e) =>
                          handleInputChange(
                            "skills",
                            e.target.value
                              .split(",")
                              .map((skill) => skill.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="e.g., JavaScript, React, Node.js"
                        className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="p-3 rounded-md bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                        {profileData.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profileData.skills.map((skill, index) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        ) : (
                          "No skills specified"
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2"
                  >
                    <Languages className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Programming Languages
                    </h3>
                  </motion.div>
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <AnimatePresence>
                          {profileData.languages.map((lang, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/20 transition-colors"
                            >
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Code2 className="h-4 w-4 text-primary" />
                                  Language
                                </Label>
                                <Input
                                  value={lang.name}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "languages",
                                      profileData.languages.map((l, i) =>
                                        i === index
                                          ? { ...l, name: e.target.value }
                                          : l
                                      )
                                    )
                                  }
                                  placeholder="e.g., JavaScript"
                                  className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Trophy className="h-4 w-4 text-primary" />
                                  Proficiency (1-5)
                                </Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={lang.proficiency}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "languages",
                                      profileData.languages.map((l, i) =>
                                        i === index
                                          ? {
                                              ...l,
                                              proficiency: parseInt(
                                                e.target.value
                                              ),
                                            }
                                          : l
                                      )
                                    )
                                  }
                                  className="bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 focus:ring-2 focus:ring-primary/20"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setProfileData((prev) => ({
                                ...prev,
                                languages: [
                                  ...prev.languages,
                                  { name: "", proficiency: 1 },
                                ],
                              }));
                            }}
                            className="w-full md:w-auto bg-background/50 hover:bg-background/80 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Language
                          </Button>
                        </motion.div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.languages.length > 0 ? (
                          profileData.languages.map((lang, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/20 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{lang.name}</span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < lang.proficiency
                                          ? "text-primary fill-primary"
                                          : "text-primary/20"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-2 p-4 rounded-lg bg-background/50 border border-primary/10 text-center text-muted-foreground">
                            No programming languages specified
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
