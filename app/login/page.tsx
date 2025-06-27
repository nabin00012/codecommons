"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useUser, UserRole } from "@/lib/context/user-context";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const isValidRole = (role: string): role is UserRole => {
  return ["student", "teacher", "user", "admin"].includes(role);
};

const defaultPreferences = {
  theme: "system",
  notifications: true,
  language: "en",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, login } = useUser();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.ok) {
        throw new Error("Login failed");
      }

      // The session will be automatically updated by NextAuth
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User is already logged in, redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="cosmic-card shadow-xl border-0">
            <CardHeader className="space-y-3 pb-6">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Sign in to your account to continue
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="h-11 text-base"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium mt-6"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/90 underline-offset-4 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
