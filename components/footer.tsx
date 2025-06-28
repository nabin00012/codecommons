"use client";

import Link from "next/link";
import {
  Code,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeCommons
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn • Code • Collaborate
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              The ultimate platform for student developers to learn programming,
              collaborate on projects, and build their coding skills in a
              supportive community.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com" className="group">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Github className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </div>
              </Link>
              <Link href="https://twitter.com" className="group">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Twitter className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
                </div>
              </Link>
              <Link href="https://linkedin.com" className="group">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
              <Link href="mailto:contact@codecommons.com" className="group">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/classrooms"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Classrooms
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/questions"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Q&A Forum
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/challenges"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Challenges
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Features
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/code-editor"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Code Editor
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/assignments"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Assignments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/community"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/help"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Help & Support
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/#point-system"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Point System
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Stay Updated
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get the latest updates on new features, events, and community
              highlights.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Subscribe
                </Button>
              </div>
              <Badge variant="secondary" className="w-fit">
                <Heart className="h-3 w-3 mr-1 text-red-500" />
                Join 1000+ developers
              </Badge>
            </div>

            <div className="mt-8">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                Contact Us
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Have questions? We're here to help!
              </p>
              <Link
                href="mailto:support@codecommons.com"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                support@codecommons.com
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} CodeCommons. All rights reserved.</span>
              <span>•</span>
              <span>Created with ❤️ by Nabin Chapagain</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        size="sm"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
}
