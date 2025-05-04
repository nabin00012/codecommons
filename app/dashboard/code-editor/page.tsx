"use client";

import { CodeEditor } from "@/components/code-editor";
import { useState } from "react";
import { useUser } from "@/lib/context/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Save,
  Terminal,
  Code2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Theme = "vs-dark" | "light";

export default function CodeEditorPage() {
  const { user } = useUser();
  const [code, setCode] = useState(`// Welcome to the Code Editor, ${
    user?.name?.split(" ")[0] || "User"
  }!
// Start coding here...

function helloWorld() {
  console.log("Hello, World!");
}`);

  const [language, setLanguage] = useState("typescript");
  const [theme, setTheme] = useState<Theme>("vs-dark");
  const [output, setOutput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRunCode = () => {
    try {
      // In a real implementation, you would send this to a backend service
      // For now, we'll just show a mock output
      setOutput("Running code...\nHello, World!");
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Code Editor
              </h1>
              <p className="text-muted-foreground">
                Write, run, and test your code in real-time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </motion.div>

        <div
          className={cn(
            "grid gap-6",
            isFullscreen ? "fixed inset-0 p-6 bg-background z-50" : ""
          )}
        >
          <div className="grid gap-6 md:grid-cols-12">
            {/* Editor Section */}
            <div className="md:col-span-8">
              <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
                <CardHeader className="border-b border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        Editor
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm border-primary/20">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="typescript">
                              TypeScript
                            </SelectItem>
                            <SelectItem value="javascript">
                              JavaScript
                            </SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="cpp">C++</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={theme}
                          onValueChange={(value) => setTheme(value as Theme)}
                        >
                          <SelectTrigger className="w-[100px] bg-background/50 backdrop-blur-sm border-primary/20">
                            <SelectValue placeholder="Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vs-dark">Dark</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                        onClick={handleRunCode}
                      >
                        <Play className="h-4 w-4" />
                        Run
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <CodeEditor
                    initialValue={code}
                    language={language}
                    onChange={(value) => setCode(value || "")}
                    height={isFullscreen ? "calc(100vh - 200px)" : "500px"}
                    theme={theme}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Output Panel */}
            <div className="md:col-span-4">
              <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm h-full">
                <CardHeader className="border-b border-primary/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      Output
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                      onClick={() => setOutput("")}
                    >
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/30 p-4 rounded-lg overflow-auto h-[calc(100vh-300px)] font-mono text-sm backdrop-blur-sm">
                    {output || "Run your code to see the output here..."}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
