"use client";

import { useUser } from "@/lib/context/user-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function UserNavigation() {
  const { user } = useUser();
  const { theme } = useTheme();

  if (user) {
    return null; // Don't show login button if user is logged in
  }

  return (
    <Link href="/login">
      <Button
        variant="ghost"
        size="sm"
        className={`hidden sm:inline-flex ${
          theme === "cosmic"
            ? "text-gray-300 hover:text-fuchsia-400 hover:bg-fuchsia-900/20"
            : theme === "dark"
            ? "text-gray-300 hover:text-blue-400 hover:bg-blue-900/20"
            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        Login
      </Button>
    </Link>
  );
}

interface MobileUserNavigationProps {
  onNavigate?: () => void;
}

export function MobileUserNavigation({
  onNavigate,
}: MobileUserNavigationProps) {
  const { user } = useUser();
  const { theme } = useTheme();

  if (user) {
    return null; // Don't show login button if user is logged in
  }

  return (
    <Link
      href="/login"
      className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
        theme === "cosmic"
          ? "text-gray-300 hover:text-fuchsia-400 hover:bg-fuchsia-900/20"
          : theme === "dark"
          ? "text-gray-300 hover:text-blue-400 hover:bg-blue-900/20"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
      }`}
      onClick={onNavigate}
    >
      Login
    </Link>
  );
}
