"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/context/user-context";
import { Code, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const navItems = [
    { name: "Features", href: "/features" },
    { name: "Questions", href: "/questions" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Point System", href: "/point-system" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        theme === "cosmic"
          ? "bg-gradient-to-r from-[#0f172a]/80 via-[#1e1b4b]/80 to-[#4c1d95]/80 backdrop-blur-lg"
          : theme === "dark"
          ? "bg-gray-900/80 backdrop-blur-lg"
          : "bg-white/80 backdrop-blur-lg"
      } border-b ${
        theme === "cosmic"
          ? "border-white/10"
          : theme === "dark"
          ? "border-gray-800"
          : "border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Code
              className={`h-6 w-6 ${
                theme === "cosmic"
                  ? "text-fuchsia-400"
                  : theme === "dark"
                  ? "text-blue-400"
                  : "text-blue-600"
              }`}
            />
            <span
              className={`text-xl font-bold ${
                theme === "cosmic"
                  ? "text-white"
                  : theme === "dark"
                  ? "text-gray-100"
                  : "text-gray-900"
              }`}
            >
              CodeCommons
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? theme === "cosmic"
                      ? "text-fuchsia-400"
                      : theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                    : theme === "cosmic"
                    ? "text-gray-300 hover:text-fuchsia-400"
                    : theme === "dark"
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user ? (
              <Button
                variant="ghost"
                className={`${
                  theme === "cosmic"
                    ? "text-gray-300 hover:text-fuchsia-400"
                    : theme === "dark"
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  className={`${
                    theme === "cosmic"
                      ? "text-gray-300 hover:text-fuchsia-400"
                      : theme === "dark"
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? theme === "cosmic"
                        ? "text-fuchsia-400 bg-fuchsia-900/20"
                        : theme === "dark"
                        ? "text-blue-400 bg-blue-900/20"
                        : "text-blue-600 bg-blue-50"
                      : theme === "cosmic"
                      ? "text-gray-300 hover:text-fuchsia-400 hover:bg-fuchsia-900/20"
                      : theme === "dark"
                      ? "text-gray-300 hover:text-blue-400 hover:bg-blue-900/20"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
