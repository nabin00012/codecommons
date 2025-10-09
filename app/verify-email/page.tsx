"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/users/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setMessage("An error occurred while verifying your email");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Verifying your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="p-4 bg-green-500/10 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                  Success!
                </h3>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                  Verification Failed
                </h3>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  onClick={() => router.push("/profile/edit")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
