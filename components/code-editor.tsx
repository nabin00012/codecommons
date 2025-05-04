"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  height?: string;
  theme?: "vs-dark" | "light";
}

export function CodeEditor({
  initialValue = "",
  language = "typescript",
  onChange,
  height = "500px",
  theme = "vs-dark",
}: CodeEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleEditorChange = (value: string | undefined) => {
    setValue(value || "");
    onChange?.(value);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={initialValue}
        value={value}
        onChange={handleEditorChange}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
