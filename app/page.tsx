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
    icon: <Users className="h-8 w-8 text-purple-500" />,
    link: "/dashboard/questions",
  },
  {
    title: "Project Showcasing",
    description:
      "Share your projects with the community and get valuable feedback.",
    icon: <Code className="h-8 w-8 text-purple-500" />,
    link: "/projects",
  },
  {
    title: "Challenges & Competitions",
    description: "Test your skills against others and compete for top spots.",
    icon: <Target className="h-8 w-8 text-purple-500" />,
    link: "/challenges",
  },
  {
    title: "Achievements & Leaderboards",
    description: "Earn badges for your contributions and see where you rank.",
    icon: <Award className="h-8 w-8 text-purple-500" />,
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
        <section className="text-center py-20 md:py-32 lg:py-40">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
              Welcome to CodeCommons
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-8">
              The ultimate platform for student developers to collaborate,
              learn, and showcase their skills.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 bg-white dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Why CodeCommons?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((feature, index) => (
                <Card
                  key={index}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="point-system" className="py-20">
          <div className="container mx-auto px-4">
            <PointAllocationExplainer />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
