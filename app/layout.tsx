import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/lib/context/user-context";
import { AuthProvider } from "@/lib/context/AuthContext";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { SettingsProvider } from "@/lib/context/settings-context";
import ErrorBoundary from "@/components/error-boundary";
import ClientOnly from "@/components/client-only";
import "@/lib/monaco-config";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeCommons - Learn, Code, Collaborate",
  description:
    "A platform for students to learn programming, collaborate on projects, and build their coding skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <ErrorBoundary>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <UserProvider>
                  <SettingsProvider>
                    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
                      <div className="flex-1">{children}</div>
                      <Analytics />
                    </main>
                  </SettingsProvider>
                </UserProvider>
              </AuthProvider>
              <Toaster />
            </ThemeProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
