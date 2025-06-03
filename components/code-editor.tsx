"use client";

import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { useSettings } from "@/lib/context/settings-context";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  code,
  language,
  onChange,
  readOnly = false,
  height = "500px",
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const { settings } = useSettings();
  const { resolvedTheme } = useTheme();

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on" as const,
    wordWrap: "on" as const,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly,
    theme: resolvedTheme === "dark" ? "vs-dark" : "light",
  };

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      defaultValue={code}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={editorOptions}
    />
  );
}
