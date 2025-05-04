"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Code, Plus, X, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AskQuestionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTag = () => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tag) {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate posting question
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CodeCommons</span>
          </Link>
        </div>
      </header>

      <div className="container py-8 max-w-3xl">
        <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Be specific and provide enough details for others to understand your problem
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title">Question Title</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">A good title is specific and summarizes your problem</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="title"
                    placeholder="e.g., How to implement a binary search tree in Java?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="transition-all border-muted-foreground/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific and imagine you're asking a question to another person
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Explain your problem in detail. What have you tried? What exactly are you stuck on?"
                    className="min-h-[200px] transition-all border-muted-foreground/20 focus:border-primary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include all the information someone would need to answer your question
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="code">Code</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="php">PHP</SelectItem>
                        <SelectItem value="ruby">Ruby</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="swift">Swift</SelectItem>
                        <SelectItem value="kotlin">Kotlin</SelectItem>
                        <SelectItem value="sql">SQL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    id="code"
                    placeholder="Paste your code here..."
                    className="min-h-[150px] font-mono text-sm transition-all border-muted-foreground/20 focus:border-primary"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include only the relevant code that demonstrates your problem
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="e.g., java, algorithms"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="transition-all border-muted-foreground/20 focus:border-primary"
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="icon" className="shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add up to 5 tags to describe what your question is about
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((t) => (
                        <Badge key={t} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                          {t}
                          <button
                            type="button"
                            onClick={() => removeTag(t)}
                            className="text-muted-foreground hover:text-foreground ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="p-4 border rounded-md min-h-[200px] mt-4">
                    {title || description || code || tags.length > 0 ? (
                      <div className="space-y-4">
                        {title && <h3 className="font-semibold text-lg">{title}</h3>}
                        {description && <p className="text-sm">{description}</p>}
                        {code && (
                          <div className="bg-muted p-3 rounded-md">
                            <pre className="text-xs overflow-x-auto font-mono">{code}</pre>
                          </div>
                        )}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((t) => (
                              <Badge key={t} variant="outline" className="px-2 py-0.5 text-xs">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center">Your question preview will appear here...</p>
                    )}
                  </TabsContent>
                  <TabsContent value="guidelines" className="p-4 border rounded-md min-h-[200px] mt-4">
                    <h3 className="text-sm font-medium mb-3">Guidelines for asking questions:</h3>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                      <li>Be specific and clear about your problem</li>
                      <li>Describe what you've already tried</li>
                      <li>Include relevant code snippets if applicable</li>
                      <li>Don't ask for complete solutions to homework assignments</li>
                      <li>Be respectful and open to guidance rather than just answers</li>
                      <li>Format your code properly for readability</li>
                      <li>Check if your question has already been asked before posting</li>
                      <li>Use appropriate tags to categorize your question correctly</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/30 py-4">
                <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gap-1 shadow-sm hover:shadow-md transition-all"
                  disabled={isSubmitting || !title || !description}
                >
                  {isSubmitting ? "Posting..." : "Post Question"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
