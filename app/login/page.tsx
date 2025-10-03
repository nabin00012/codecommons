"use client";"use client";"use client";



import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";import React, { useState, useEffect } from "react";import React, { useState, useEffect } from "react";

import { useUser, UserRole } from "@/lib/context/user-context";

import { motion } from "framer-motion";import { useRouter } from "next/navigation";import { useRouter } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";

import Link from "next/link";import { signIn } from "next-auth/react";import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";import { useUser, UserRole } from "@/lib/context/user-context";import { useUser, UserRole } from "@/lib/context/user-context";

import { Label } from "@/components/ui/label";

import {import { motion } from "framer-motion";import { motion } from "framer-motion";

  Card,

  CardContent,import { ModeToggle } from "@/components/mode-toggle";import { ModeToggle } from "@/components/mode-toggle";

  CardFooter,

  CardHeader,import Link from "next/link";import Link from "next/link";

} from "@/components/ui/card";

import { useToast } from "@/components/ui/use-toast";import { Button } from "@/components/ui/button";import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";import { Input } from "@/components/ui/input";

const defaultPreferences = {

  theme: "system",import { Label } from "@/components/ui/label";import { Label } from "@/components/ui/label";

  notifications: true,

  language: "en",import {import {

};

  Card,  Card,

export default function LoginPage() {

  const [email, setEmail] = useState("");  CardContent,  CardContent,

  const [password, setPassword] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);  CardFooter,  CardFooter,

  const [localLoading, setLocalLoading] = useState(false);

  const [mounted, setMounted] = useState(false);  CardHeader,  CardHeader,

  const router = useRouter();

  const { user } = useUser();} from "@/components/ui/card";} from "@/components/ui/card";

  const { toast } = useToast();

import { useToast } from "@/components/ui/use-toast";import { useToast } from "@/components/ui/use-toast";

  useEffect(() => {

    setMounted(true);import { Separator } from "@/components/ui/separator";import { Separator } from "@/components/ui/separator";

  }, []);



  useEffect(() => {

    if (mounted && user) {const isValidRole = (role: string): role is UserRole => {const isValidRole = (role: string): role is UserRole => {

      console.log("User is already logged in, redirecting to dashboard...");

      router.push("/dashboard");  return ["student", "teacher", "user", "admin"].includes(role);  return ["student", "teacher", "user", "admin"].includes(role);

    }

  }, [mounted, user, router]);};};



  if (!mounted) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center">const defaultPreferences = {const defaultPreferences = {

        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>

      </div>  theme: "system",  theme: "system",

    );

  }  notifications: true,  notifications: true,



  const handleLocalLogin = async (e: React.FormEvent) => {  language: "en",  language: "en",

    e.preventDefault();

    if (!email || !password) {};};

      toast({

        title: "Error",

        description: "Please fill in all fields",

        variant: "destructive",export default function LoginPage() {export default function LoginPage() {

      });

      return;  const [email, setEmail] = useState("");  const [email, setEmail] = useState("");

    }

  const [password, setPassword] = useState("");  const [password, setPassword] = useState("");

    setLocalLoading(true);

    try {  const [googleLoading, setGoogleLoading] = useState(false);  const [loading, setLoading] = useState(false);

      const response = await fetch("/api/auth/login", {

        method: "POST",  const [localLoading, setLocalLoading] = useState(false);  const [googleLoading, setGoogleLoading] = useState(false);

        headers: {

          "Content-Type": "application/json",  const [mounted, setMounted] = useState(false);  const [error, setError] = useState("");

        },

        body: JSON.stringify({  const router = useRouter();  const router = useRouter();

          email,

          password,  const { user } = useUser();  const { user, login } = useUser();

        }),

      });  const { toast } = useToast();  const { toast } = useToast();



      const data = await response.json();



      if (response.ok) {  useEffect(() => {  const handleLogin = async (e: React.FormEvent) => {

        localStorage.setItem("auth-token", data.token);

        document.cookie = `auth-token=${data.token}; path=/; secure; samesite=strict`;    setMounted(true);    e.preventDefault();



        const userWithDefaults = {  }, []);    setError("");

          ...data.user,

          preferences: data.user.preferences || defaultPreferences,    setLoading(true);

          profile: data.user.profile || {},

        };  useEffect(() => {



        localStorage.setItem("user", JSON.stringify(userWithDefaults));    if (mounted && user) {    try {



        toast({      console.log("User is already logged in, redirecting to dashboard...");      if (!email || !password) {

          title: "Success",

          description: "Login successful!",      router.push("/dashboard");        throw new Error("Please enter both email and password");

        });

    }      }

        router.push("/dashboard");

      } else {  }, [mounted, user, router]);

        toast({

          title: "Error",      // Try custom API login first

          description: data.message || "Login failed",

          variant: "destructive",  // Show loading state until mounted to prevent hydration mismatch      const response = await fetch("/api/auth/login", {

        });

      }  if (!mounted) {        method: "POST",

    } catch (error) {

      console.error("Login error:", error);    return (        headers: {

      toast({

        title: "Error",      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center">          "Content-Type": "application/json",

        description: "An unexpected error occurred",

        variant: "destructive",        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>        },

      });

    } finally {      </div>        body: JSON.stringify({ email, password }),

      setLocalLoading(false);

    }    );      });

  };

  }

  const handleGoogleSignIn = async () => {

    setGoogleLoading(true);      const data = await response.json();

    try {

      const result = await signIn("google", {  const handleLocalLogin = async (e: React.FormEvent) => {

        redirect: false,

        callbackUrl: "/onboarding",    e.preventDefault();      if (!response.ok) {

      });

    if (!email || !password) {        throw new Error(data.error || "Login failed");

      if (result?.error) {

        toast({      toast({      }

          title: "Error",

          description: "Google sign-in failed",        title: "Error",

          variant: "destructive",

        });        description: "Please fill in all fields",      if (data.user && data.token) {

      } else if (result?.url) {

        router.push(result.url);        variant: "destructive",        // Store the token

      }

    } catch (error) {      });        if (typeof window !== "undefined") {

      console.error("Google sign-in error:", error);

      toast({      return;          localStorage.setItem("token", data.token);

        title: "Error",

        description: "An unexpected error occurred during Google sign-in",    }        }

        variant: "destructive",

      });

    } finally {

      setGoogleLoading(false);    setLocalLoading(true);        // Update user context

    }

  };    try {        login({



  return (      const response = await fetch("/api/auth/login", {          id: data.user.id || data.user._id,

    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4 sm:p-6 lg:p-8">

      <div className="absolute top-4 right-4 z-10">        method: "POST",          _id: data.user._id || data.user.id,

        <ModeToggle />

      </div>        headers: {          name: data.user.name,

      

      <motion.div          "Content-Type": "application/json",          email: data.user.email,

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}        },          role: data.user.role as UserRole,

        transition={{ duration: 0.5 }}

        className="w-full max-w-md space-y-6"        body: JSON.stringify({          department: data.user.department || "",

      >

        <div className="text-center space-y-2">          email,          section: data.user.section || "",

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">

            Welcome Back          password,          year: data.user.year || "",

          </h1>

          <p className="text-muted-foreground">        }),          specialization: data.user.specialization || "",

            Sign in to your CodeCommons account

          </p>      });          onboardingCompleted: data.user.onboardingCompleted ?? false,

        </div>

          preferences: data.user.preferences || defaultPreferences,

        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">

          <CardHeader className="space-y-1">      const data = await response.json();        });

            <Button

              variant="outline"

              onClick={handleGoogleSignIn}

              disabled={googleLoading}      if (response.ok) {        toast({

              className="w-full"

            >        localStorage.setItem("auth-token", data.token);          title: "Welcome back!",

              {googleLoading ? (

                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />        document.cookie = `auth-token=${data.token}; path=/; secure; samesite=strict`;          description: "You have been successfully logged in.",

              ) : (

                <>        });

                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">

                    <path        const userWithDefaults = {

                      fill="currentColor"

                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"          ...data.user,        // Simple redirect logic

                    />

                    <path          preferences: data.user.preferences || defaultPreferences,        if (email === "admin@jainuniversity.ac.in") {

                      fill="currentColor"

                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"          profile: data.user.profile || {},          router.push("/dashboard");

                    />

                    <path        };        } else {

                      fill="currentColor"

                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"          router.push("/onboarding");

                    />

                    <path        localStorage.setItem("user", JSON.stringify(userWithDefaults));        }

                      fill="currentColor"

                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"      }

                    />

                  </svg>        toast({    } catch (err) {

                  Continue with Google

                </>          title: "Success",      const errorMessage =

              )}

            </Button>          description: "Login successful!",        err instanceof Error ? err.message : "An error occurred";



            <div className="relative">        });      setError(errorMessage);

              <div className="absolute inset-0 flex items-center">

                <Separator className="w-full" />      toast({

              </div>

              <div className="relative flex justify-center text-xs uppercase">        router.push("/dashboard");        title: "Login failed",

                <span className="bg-card px-2 text-muted-foreground">

                  Or continue with      } else {        description: errorMessage,

                </span>

              </div>        toast({        variant: "destructive",

            </div>

          </CardHeader>          title: "Error",      });



          <CardContent>          description: data.message || "Login failed",    } finally {

            <form onSubmit={handleLocalLogin} className="space-y-4">

              <div className="space-y-2">          variant: "destructive",      setLoading(false);

                <Label htmlFor="email">Email</Label>

                <Input        });    }

                  id="email"

                  type="email"      }  };

                  placeholder="your.email@example.com"

                  value={email}    } catch (error) {

                  onChange={(e) => setEmail(e.target.value)}

                  required      console.error("Login error:", error);  const handleGoogleSignIn = async () => {

                  className="bg-background/50"

                />      toast({    setError("");

              </div>

              <div className="space-y-2">        title: "Error",    setGoogleLoading(true);

                <Label htmlFor="password">Password</Label>

                <Input        description: "An unexpected error occurred",

                  id="password"

                  type="password"        variant: "destructive",    try {

                  placeholder="Enter your password"

                  value={password}      });      const result = await signIn("google", {

                  onChange={(e) => setPassword(e.target.value)}

                  required    } finally {        callbackUrl: "/dashboard",

                  className="bg-background/50"

                />      setLocalLoading(false);        redirect: false,

              </div>

              <Button    }      });

                type="submit"

                className="w-full"  };

                disabled={localLoading}

              >      if (result?.error) {

                {localLoading ? (

                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />  const handleGoogleSignIn = async () => {        if (result.error === "AccessDenied") {

                ) : (

                  "Sign In"    setGoogleLoading(true);          throw new Error(

                )}

              </Button>    try {            "Only @jainuniversity.ac.in email addresses are allowed to sign in with Google."

            </form>

          </CardContent>      const result = await signIn("google", {          );



          <CardFooter className="flex flex-col space-y-2">        redirect: false,        }

            <div className="text-sm text-muted-foreground text-center">

              Don&apos;t have an account?{" "}        callbackUrl: "/onboarding",        throw new Error(result.error);

              <Link

                href="/signup"      });      }

                className="text-primary hover:underline font-medium"

              >

                Sign up

              </Link>      if (result?.error) {      if (result?.ok) {

            </div>

          </CardFooter>        toast({        toast({

        </Card>

          title: "Error",          title: "Welcome!",

        <div className="text-center text-xs text-muted-foreground">

          By signing in, you agree to our{" "}          description: "Google sign-in failed",          description: "You have been successfully logged in with Google.",

          <Link href="/terms" className="hover:underline">

            Terms of Service          variant: "destructive",        });

          </Link>{" "}

          and{" "}        });        router.push("/dashboard");

          <Link href="/privacy" className="hover:underline">

            Privacy Policy      } else if (result?.url) {        router.refresh();

          </Link>

        </div>        router.push(result.url);      }

      </motion.div>

    </div>      }    } catch (err) {

  );

}    } catch (error) {      const errorMessage =

      console.error("Google sign-in error:", error);        err instanceof Error

      toast({          ? err.message

        title: "Error",          : "An error occurred during Google sign-in";

        description: "An unexpected error occurred during Google sign-in",      setError(errorMessage);

        variant: "destructive",      toast({

      });        title: "Google sign-in failed",

    } finally {        description: errorMessage,

      setGoogleLoading(false);        variant: "destructive",

    }      });

  };    } finally {

      setGoogleLoading(false);

  return (    }

    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4 sm:p-6 lg:p-8">  };

      <div className="absolute top-4 right-4 z-10">

        <ModeToggle />  const [mounted, setMounted] = useState(false);

      </div>

        useEffect(() => {

      <motion.div    setMounted(true);

        initial={{ opacity: 0, y: 20 }}  }, []);

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5 }}  useEffect(() => {

        className="w-full max-w-md space-y-6"    if (mounted && user) {

      >      console.log("User is already logged in, redirecting to dashboard...");

        <div className="text-center space-y-2">      router.push("/dashboard");

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">    }

            Welcome Back  }, [mounted, user, router]);

          </h1>

          <p className="text-muted-foreground">  return (

            Sign in to your CodeCommons account    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4 sm:p-6 lg:p-8">

          </p>      <div className="absolute top-4 right-4 z-10">

        </div>        <ModeToggle />

      </div>

        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">

          <CardHeader className="space-y-1">      <div className="w-full max-w-sm sm:max-w-md mx-auto">

            <Button        <motion.div

              variant="outline"          initial={{ opacity: 0, y: 20 }}

              onClick={handleGoogleSignIn}          animate={{ opacity: 1, y: 0 }}

              disabled={googleLoading}          transition={{ duration: 0.5 }}

              className="w-full"        >

            >          <Card className="cosmic-card shadow-xl border-0">

              {googleLoading ? (            <CardHeader className="space-y-3 pb-6">

                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />              <div className="text-center">

              ) : (                <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">

                <>                  Welcome Back

                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">                </h1>

                    <path                <p className="text-sm sm:text-base text-muted-foreground">

                      fill="currentColor"                  Sign in to your account to continue

                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"                </p>

                    />              </div>

                    <path            </CardHeader>

                      fill="currentColor"

                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"            <CardContent className="space-y-4">

                    />              {error && (

                    <path                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">

                      fill="currentColor"                  {error}

                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"                </div>

                    />              )}

                    <path

                      fill="currentColor"              {/* Google Sign-in Button */}

                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"              <Button

                    />                type="button"

                  </svg>                variant="outline"

                  Continue with Google                className="w-full h-11 text-base font-medium"

                </>                onClick={handleGoogleSignIn}

              )}                disabled={googleLoading}

            </Button>              >

                {googleLoading ? (

            <div className="relative">                  "Signing in..."

              <div className="absolute inset-0 flex items-center">                ) : (

                <Separator className="w-full" />                  <>

              </div>                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">

              <div className="relative flex justify-center text-xs uppercase">                      <path

                <span className="bg-card px-2 text-muted-foreground">                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"

                  Or continue with                        fill="#4285F4"

                </span>                      />

              </div>                      <path

            </div>                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"

          </CardHeader>                        fill="#34A853"

                      />

          <CardContent>                      <path

            <form onSubmit={handleLocalLogin} className="space-y-4">                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"

              <div className="space-y-2">                        fill="#FBBC05"

                <Label htmlFor="email">Email</Label>                      />

                <Input                      <path

                  id="email"                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"

                  type="email"                        fill="#EA4335"

                  placeholder="your.email@example.com"                      />

                  value={email}                    </svg>

                  onChange={(e) => setEmail(e.target.value)}                    Continue with Google

                  required                  </>

                  className="bg-background/50"                )}

                />              </Button>

              </div>

              <div className="space-y-2">              <div className="relative">

                <Label htmlFor="password">Password</Label>                <div className="absolute inset-0 flex items-center">

                <Input                  <Separator className="w-full" />

                  id="password"                </div>

                  type="password"                <div className="relative flex justify-center text-xs uppercase">

                  placeholder="Enter your password"                  <span className="bg-background px-2 text-muted-foreground">

                  value={password}                    Or continue with

                  onChange={(e) => setPassword(e.target.value)}                  </span>

                  required                </div>

                  className="bg-background/50"              </div>

                />

              </div>              <form onSubmit={handleLogin} className="space-y-4">

              <Button                <div className="space-y-2">

                type="submit"                  <Label htmlFor="email" className="text-sm font-medium">

                className="w-full"                    Email

                disabled={localLoading}                  </Label>

              >                  <Input

                {localLoading ? (                    id="email"

                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />                    type="email"

                ) : (                    value={email}

                  "Sign In"                    onChange={(e) => setEmail(e.target.value)}

                )}                    placeholder="Enter your email"

              </Button>                    required

            </form>                    autoComplete="email"

          </CardContent>                    inputMode="email"

                    className="h-11 text-base"

          <CardFooter className="flex flex-col space-y-2">                  />

            <div className="text-sm text-muted-foreground text-center">                </div>

              Don't have an account?{" "}

              <Link                <div className="space-y-2">

                href="/signup"                  <Label htmlFor="password" className="text-sm font-medium">

                className="text-primary hover:underline font-medium"                    Password

              >                  </Label>

                Sign up                  <Input

              </Link>                    id="password"

            </div>                    type="password"

          </CardFooter>                    value={password}

        </Card>                    onChange={(e) => setPassword(e.target.value)}

                    placeholder="Enter your password"

        <div className="text-center text-xs text-muted-foreground">                    required

          By signing in, you agree to our{" "}                    autoComplete="current-password"

          <Link href="/terms" className="hover:underline">                    className="h-11 text-base"

            Terms of Service                  />

          </Link>{" "}                </div>

          and{" "}

          <Link href="/privacy" className="hover:underline">                <Button

            Privacy Policy                  type="submit"

          </Link>                  className="w-full h-11 text-base font-medium mt-6"

        </div>                  disabled={loading}

      </motion.div>                >

    </div>                  {loading ? "Signing in..." : "Sign In"}

  );                </Button>

}              </form>
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
              <div className="text-xs text-center text-muted-foreground">
                Google sign-in is only available for @jainuniversity.ac.in email
                addresses
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
