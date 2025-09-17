"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const getErrorContent = () => {
    switch (error) {
      case "AccessDenied":
        return {
          title: "Access Denied",
          message:
            "Only @jainuniversity.ac.in email addresses are allowed to sign in with Google.",
          icon: Mail,
          action: "Please use your Jain University email address to continue.",
        };
      case "Configuration":
        return {
          title: "Configuration Error",
          message: "There is a problem with the authentication configuration.",
          icon: AlertTriangle,
          action: "Please contact support if this problem persists.",
        };
      default:
        return {
          title: "Authentication Error",
          message: "An error occurred during authentication.",
          icon: AlertTriangle,
          action:
            "Please try again or contact support if the problem persists.",
        };
    }
  };

  const errorContent = getErrorContent();
  const IconComponent = errorContent.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="cosmic-card shadow-xl border-0">
            <CardHeader className="space-y-3 pb-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-destructive" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-destructive">
                  {errorContent.title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {errorContent.message}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-6">
                  {errorContent.action}
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>

                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Go to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
