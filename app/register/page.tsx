"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useUser } from "@/lib/context/user-context";
import { useAuth } from "@/lib/context/AuthContext";
import { ArrowLeft, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { authService } from "@/lib/services/auth";
import { UserRole } from "@/lib/context/user-context";

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login } = useUser();
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as UserRole,
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

  const redirectTo = searchParams.get("redirectTo") || "";

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

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
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
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
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
      // Validate email domain for student role
      if (
        formData.role === "student" &&
        !formData.email.endsWith("@jainuniversity.ac.in")
      ) {
        setError(
          "Student accounts must use a @jainuniversity.ac.in email address"
        );
        return;
      }

      console.log("Submitting registration with:", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      console.log("Registration response:", response);

      // Check if we have a valid response with token
      if (!response?.token) {
        throw new Error("Invalid response from server");
      }

      // Store the token using auth context
      setToken(response.token);

      // Login the user after successful registration
      login({
        id: response._id,
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role as UserRole,
        preferences: {
          theme: "system",
          notifications: true,
          language: "en",
        },
      });

      toast({
        title: "Registration successful!",
        description: "Welcome to Code Commons!",
      });

      // Add a small delay before redirecting to ensure the toast is visible
      setTimeout(() => {
        router.push(redirectTo || "/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      setError(errorMessage);

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });

      // If the error is about an existing user, suggest logging in
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <Card className="border-none shadow-xl cosmic-card">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Already have an account?
              </Link>
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Create an account
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enter your details to create your account
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  autoComplete="name"
                  className="h-11 text-base"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateRandomEmail}
                    className="h-8 px-2 text-xs self-start sm:self-auto"
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
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="h-11 text-base"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="new-password"
                    className="h-11 text-base pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
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
                    autoComplete="new-password"
                    className="h-11 text-base pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Role</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleRoleChange(value as UserRole)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="text-sm cursor-pointer">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher" className="text-sm cursor-pointer">
                      Teacher
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  For developers: Use any email for teacher role. For student
                  role, use @jainuniversity.ac.in email.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <div className="text-xs sm:text-sm text-center text-muted-foreground leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/90 underline-offset-4 hover:underline font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/90 underline-offset-4 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
