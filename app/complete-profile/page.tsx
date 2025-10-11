"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Phone,
  CreditCard,
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle,
  Mail,
} from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, refreshUser, updateUser } = useUser();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    usn: "",
    studentId: "",
    collegeId: "",
    department: "",
  });

  useEffect(() => {
    // Redirect if user already completed profile
    if (user && user.profileCompleted === true) {
      console.log("Profile already completed, redirecting to dashboard");
      router.replace("/dashboard");
      return;
    }

    // Pre-fill if user has some data
    if (user) {
      setFormData({
        phone: user.phone || "",
        usn: user.usn || "",
        studentId: user.studentId || "",
        collegeId: user.collegeId || "",
        department: user.department || "",
      });
    }
  }, [user?.profileCompleted, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/users/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        // Update user context immediately with the returned user data
        if (data.user) {
          updateUser(data.user);
        }

        // Also refresh to ensure latest data
        await refreshUser();

        toast({
          title: "Success!",
          description: "Your profile has been completed successfully.",
        });

        // Small delay before redirect to ensure context is updated
        setTimeout(() => {
          router.push("/dashboard");
        }, 300);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      // Mark profile as completed even though skipped
      const response = await fetch("/api/users/skip-profile", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        // Update user context immediately
        if (data.user) {
          updateUser(data.user);
        }

        await refreshUser();

        toast({
          title: "Profile Setup Skipped",
          description: "You can complete your profile anytime from settings.",
        });

        setTimeout(() => {
          router.replace("/dashboard");
        }, 300);
      } else {
        // If API fails, just redirect
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error skipping profile:", error);
      // Fallback - just redirect to dashboard
      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4 shadow-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Help us personalize your learning experience
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="h-6 w-6 text-primary" />
              Student Information
            </CardTitle>
            <CardDescription>
              Please fill in your details. Fields marked with * are required.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="h-12"
                />
              </div>

              {/* USN (University Seat Number) */}
              <div className="space-y-2">
                <Label htmlFor="usn" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-purple-500" />
                  USN (University Seat Number) *
                </Label>
                <Input
                  id="usn"
                  type="text"
                  placeholder="e.g., 1CR21CS001"
                  value={formData.usn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usn: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  className="h-12 font-mono"
                />
              </div>

              {/* Student ID (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="studentId" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  Student ID{" "}
                  <span className="text-xs text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Your student ID if different from USN"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  className="h-12"
                />
              </div>

              {/* College ID for Verification */}
              <div className="space-y-2">
                <Label htmlFor="collegeId" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-red-500" />
                  College Email ID *
                </Label>
                <Input
                  id="collegeId"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={formData.collegeId}
                  onChange={(e) =>
                    setFormData({ ...formData, collegeId: e.target.value })
                  }
                  required
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send a verification email to confirm your college
                  identity
                </p>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  Department *
                </Label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                  className="w-full h-12 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Select your department</option>
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="ISE">Information Science & Engineering</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="EEE">Electrical & Electronics</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="CIVIL">Civil Engineering</option>
                  <option value="IT">Information Technology</option>
                  <option value="AI/ML">
                    Artificial Intelligence & Machine Learning
                  </option>
                  <option value="DS">Data Science</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">
                      Why do we need this information?
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>To verify you're a genuine student</li>
                      <li>
                        To connect you with classmates from your department
                      </li>
                      <li>To provide relevant course content and materials</li>
                      <li>To enable communication with teachers</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                  disabled={loading}
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      Complete Profile
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          You can update this information anytime from your profile settings
        </p>
      </div>
    </div>
  );
}
