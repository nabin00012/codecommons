"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Brain,
  Users,
  Rocket,
  Shield,
  Zap,
  MessageSquare,
  FileCode,
  Database,
  Cloud,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  isNew?: boolean;
}

const featureCategories = [
  { id: "all", label: "All Features", icon: <Rocket className="h-4 w-4" /> },
  {
    id: "development",
    label: "Development",
    icon: <Code2 className="h-4 w-4" />,
  },
  { id: "ai", label: "AI & ML", icon: <Brain className="h-4 w-4" /> },
  { id: "community", label: "Community", icon: <Users className="h-4 w-4" /> },
  { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
];

const allFeatures: Feature[] = [
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Smart Code Editor",
    description:
      "Advanced code editor with syntax highlighting, auto-completion, and real-time collaboration.",
    category: "development",
    isNew: true,
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Code Assistant",
    description:
      "Get intelligent code suggestions and explanations powered by advanced AI models.",
    category: "ai",
    isNew: true,
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Forums",
    description:
      "Engage with other developers, share knowledge, and get help from the community.",
    category: "community",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Real-time Chat",
    description:
      "Instant messaging and video calls for seamless collaboration with team members.",
    category: "community",
  },
  {
    icon: <FileCode className="h-6 w-6" />,
    title: "Code Templates",
    description:
      "Access a library of pre-built code templates and snippets for faster development.",
    category: "development",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Database Integration",
    description:
      "Seamlessly connect and manage your databases with built-in tools and utilities.",
    category: "development",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Security Scanner",
    description:
      "Automated security scanning to identify and fix vulnerabilities in your code.",
    category: "security",
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Cloud Deployment",
    description:
      "One-click deployment to major cloud platforms with automated CI/CD pipelines.",
    category: "development",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Performance Analytics",
    description:
      "Monitor and optimize your application's performance with detailed analytics.",
    category: "development",
  },
];

export function EnhancedFeaturesSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFeatures =
    activeCategory === "all"
      ? allFeatures
      : allFeatures.filter((feature) => feature.category === activeCategory);

  return (
    <div className="space-y-8" id="features">
      <div className="flex flex-wrap justify-center gap-4">
        {featureCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={`gap-2 ${
              activeCategory === category.id ? "cosmic-button" : "cosmic-card"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon}
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="cosmic-card group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary cosmic-glow">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold cosmic-text">
                        {feature.title}
                      </h3>
                      {feature.isNew && (
                        <Badge
                          variant="secondary"
                          className="bg-green-50 text-green-700 border-green-200 cosmic-glow"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
