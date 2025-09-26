"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Loader2, 
  RefreshCw, 
  Sparkles,
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Rocket
} from "lucide-react";

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const generateRandomEmail = () => {
    const randomNum = Math.floor(Math.random() * 1000000);
    const newEmail = `${randomNum}@jainuniversity.ac.in`;
    setFormData((prev) => ({ ...prev, email: newEmail }));
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (
        formData.role === "student" &&
        !formData.email.endsWith("@jainuniversity.ac.in")
      ) {
        setError("Student accounts must use a @jainuniversity.ac.in email address");
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast({
        title: "Registration successful!",
        description: "Welcome to CodeCommons! Please sign in to continue.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      setError(errorMessage);

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (errorMessage.includes("already exists")) {
        toast({
          title: "Account exists",
          description: "Please try logging in instead.",
          action: (
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="mt-2"
            >
              Go to Login
            </Button>
          ),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4c1d95]">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-20%] h-[60rem] w-[60rem] rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[50rem] w-[50rem] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.15),_transparent_50%)]" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="border-0 bg-white/10 shadow-2xl backdrop-blur-xl">
              <CardHeader className="space-y-6 pb-8">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-white/70 hover:text-white"
                  >
                    Already have an account?
                  </Link>
                </div>

                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200">
                    <ShieldCheck className="h-4 w-4" />
                    Official Campus Platform
                  </div>
                  <h1 className="text-3xl font-bold text-white">
                    Join the Engineering Community
                  </h1>
                  <p className="text-white/70">
                    Connect with peers, faculty, and alumni across all departments at Jain University
                  </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-white">
                      <Users className="h-4 w-4" />
                      1.2K+
                    </div>
                    <p className="text-xs text-white/60">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-white">
                      <BookOpen className="h-4 w-4" />
                      6
                    </div>
                    <p className="text-xs text-white/60">Departments</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-white">
                      <GraduationCap className="h-4 w-4" />
                      70+
                    </div>
                    <p className="text-xs text-white/60">Classrooms</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="h-12 border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-300">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email" className="text-sm font-medium text-white">
                        University Email
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateRandomEmail}
                        className="h-8 px-3 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Generate
                      </Button>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@jainuniversity.ac.in"
                      required
                      className="h-12 border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-300">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        required
                        className="h-12 border-white/20 bg-white/5 pr-12 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/70 hover:bg-transparent hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-300">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        className="h-12 border-white/20 bg-white/5 pr-12 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/70 hover:bg-transparent hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-300">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-white">I am a:</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="relative">
                        <RadioGroupItem
                          value="student"
                          id="student"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="student"
                          className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/5 p-6 text-center transition hover:bg-white/10 peer-checked:border-blue-400 peer-checked:bg-blue-500/20"
                        >
                          <GraduationCap className="h-8 w-8 text-blue-300" />
                          <div>
                            <p className="font-semibold text-white">Student</p>
                            <p className="text-xs text-white/60">Join classrooms and collaborate</p>
                          </div>
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem
                          value="teacher"
                          id="teacher"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="teacher"
                          className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/5 p-6 text-center transition hover:bg-white/10 peer-checked:border-purple-400 peer-checked:bg-purple-500/20"
                        >
                          <Users className="h-8 w-8 text-purple-300" />
                          <div>
                            <p className="font-semibold text-white">Teacher</p>
                            <p className="text-xs text-white/60">Create and manage classrooms</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating your account...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>

              <CardFooter className="space-y-4 pt-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                    <div>
                      <p className="text-sm font-medium text-white">What happens next?</p>
                      <p className="text-xs text-white/70">
                        After registration, you'll set up your academic profile with department, section, and interests.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-xs text-white/50">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-blue-300 hover:text-blue-200 underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-300 hover:text-blue-200 underline">
                    Privacy Policy
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}