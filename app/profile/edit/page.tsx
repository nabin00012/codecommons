"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Shield,
  Bell,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Upload,
  Camera,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/lib/components/ProtectedRoute";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form data
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    location: "",
    department: "",
    usn: "",
    studentId: "",
    collegeId: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        usn: user.usn || "",
        studentId: user.studentId || "",
        collegeId: user.collegeId || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        twitter: user.twitter || "",
        website: user.website || "",
        avatar: user.avatar || "",
      });
      if (user.avatar) {
        setImagePreview(user.avatar);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await refreshUser();
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setIsSendingVerification(true);

    try {
      const response = await fetch("/api/users/send-verification", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your account",
        });
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification:", error);
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Edit Profile</h1>
                    <p className="text-lg text-white/90">
                      Update your personal information and settings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="security">Security & Verification</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile details and social links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Profile Photo Upload */}
                    <div className="flex flex-col items-center gap-4 pb-6 border-b">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Profile Preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold mb-1">Profile Photo</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          JPG, PNG or GIF. Max size 5MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({ ...formData, location: e.target.value })
                            }
                            placeholder="San Francisco, CA"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="department" className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Department/Major
                          </Label>
                          <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) =>
                              setFormData({ ...formData, department: e.target.value })
                            }
                            placeholder="Computer Science"
                          />
                        </div>
                      </div>

                      {/* Student Information */}
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="usn" className="flex items-center gap-2">
                              <Badge className="h-4 w-4" />
                              USN (University Seat Number)
                            </Label>
                            <Input
                              id="usn"
                              value={formData.usn}
                              onChange={(e) =>
                                setFormData({ ...formData, usn: e.target.value.toUpperCase() })
                              }
                              placeholder="1AB21CS001"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="studentId" className="flex items-center gap-2">
                              <Badge className="h-4 w-4" />
                              Student ID
                            </Label>
                            <Input
                              id="studentId"
                              value={formData.studentId}
                              onChange={(e) =>
                                setFormData({ ...formData, studentId: e.target.value })
                              }
                              placeholder="Your Student ID"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="collegeId" className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              College Email
                            </Label>
                            <Input
                              id="collegeId"
                              type="email"
                              value={formData.collegeId}
                              onChange={(e) =>
                                setFormData({ ...formData, collegeId: e.target.value })
                              }
                              placeholder="your.email@college.edu"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Social Links</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="github" className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            GitHub Username
                          </Label>
                          <Input
                            id="github"
                            value={formData.github}
                            onChange={(e) =>
                              setFormData({ ...formData, github: e.target.value })
                            }
                            placeholder="yourusername"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="linkedin" className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" />
                            LinkedIn Username
                          </Label>
                          <Input
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e) =>
                              setFormData({ ...formData, linkedin: e.target.value })
                            }
                            placeholder="yourusername"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="twitter" className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            Twitter Handle
                          </Label>
                          <Input
                            id="twitter"
                            value={formData.twitter}
                            onChange={(e) =>
                              setFormData({ ...formData, twitter: e.target.value })
                            }
                            placeholder="@yourusername"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Website
                          </Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) =>
                              setFormData({ ...formData, website: e.target.value })
                            }
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Email Verification
                  </CardTitle>
                  <CardDescription>
                    Verify your email address to secure your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Your email address
                        </p>
                      </div>
                    </div>
                    {user.isEmailVerified ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Verified
                      </Badge>
                    )}
                  </div>

                  {!user.isEmailVerified && (
                    <div className="space-y-3">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                              Email Not Verified
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                              Please verify your email address to access all features and
                              receive important notifications.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleSendVerification}
                        disabled={isSendingVerification}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {isSendingVerification
                          ? "Sending..."
                          : "Send Verification Email"}
                      </Button>
                    </div>
                  )}

                  {user.isEmailVerified && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            Email Verified Successfully!
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Your email has been verified. You have full access to all
                            features.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Assignment Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when new assignments are posted
                        </p>
                      </div>
                      <Badge variant="outline">Email</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Announcement Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive classroom announcements
                        </p>
                      </div>
                      <Badge variant="outline">Email</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Grade Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when assignments are graded
                        </p>
                      </div>
                      <Badge variant="outline">Email</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
