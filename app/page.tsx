"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code, Target, Users, Award } from "lucide-react";
import { ProjectShowcase } from "@/components/project-showcase";
import { DemoQuestions } from "@/components/demo-questions";
import { PointAllocationExplainer } from "@/components/point-allocation-explainer";
import { mockProjects as allMockProjects } from "@/data/mock-projects";

const featureCards = [
  {
    title: "Interactive Q&A",
    description:
      "Ask questions, get answers, and connect with peers in a dedicated space.",
    icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />,
    link: "/dashboard/questions",
  },
  {
    title: "Project Showcasing",
    description:
      "Share your projects with the community and get valuable feedback.",
    icon: <Code className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />,
    link: "/projects",
  },
  {
    title: "Challenges & Competitions",
    description: "Test your skills against others and compete for top spots.",
    icon: <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />,
    link: "/challenges",
  },
  {
    title: "Achievements & Leaderboards",
    description: "Earn badges for your contributions and see where you rank.",
    icon: <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />,
    link: "/leaderboard",
  },
];

const featuredProjects = Object.values(allMockProjects)
  .flat()
  .filter((p) => p.featured);

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeCommons
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4">
              The ultimate platform for student developers to collaborate,
              learn, and showcase their skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white">
              Why CodeCommons?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featureCards.map((feature, index) => (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                >
                  <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 pb-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-base sm:text-lg font-semibold leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Point System Section */}
        <section
          id="point-system"
          className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto max-w-6xl">
            <PointAllocationExplainer />
          </div>
        </section>

        {/* Project Showcase Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <ProjectShowcase
              projects={featuredProjects}
              username="CodeCommons"
            />
          </div>
        </section>

        {/* Demo Questions Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <DemoQuestions />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
