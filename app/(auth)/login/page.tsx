import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";

const LoginPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await authService.verifyToken(token);
        if (response?.user) {
          router.push("/dashboard");
        } else {
          // Clear invalid token
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Clear invalid token
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, [router]);

  return <div>{/* Render your login form here */}</div>;
};

export default LoginPage;
