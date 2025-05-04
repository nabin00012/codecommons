"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, Copy, Terminal } from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  className?: string
  showLineNumbers?: boolean
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  className,
  showLineNumbers = true,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative rounded-md border", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-medium">{language}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="relative">
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/30 border-r flex flex-col items-end pr-2 py-3 text-xs text-muted-foreground select-none">
            {value.split("\n").map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "font-mono text-sm p-3 min-h-[200px] w-full bg-background focus:outline-none resize-y",
            showLineNumbers && "pl-14",
          )}
          readOnly={readOnly}
          spellCheck="false"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  )
}
