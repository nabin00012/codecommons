"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { useSettings } from "@/lib/context/settings-context";

export interface CodeEditorProps {
  value?: string;
  initialValue?: string;
  language: string;
  onChange: (value: string | undefined) => void;
  height?: string;
  theme?: string;
  options?: {
    fontSize?: number;
    tabSize?: number;
    wordWrap?: "off" | "on" | "wordWrapColumn" | "bounded";
    minimap?: { enabled: boolean };
    scrollBeyondLastLine?: boolean;
    automaticLayout?: boolean;
  };
}

export function CodeEditor({
  value,
  initialValue,
  language,
  onChange,
  height = "500px",
  theme,
  options,
}: CodeEditorProps) {
  const { settings } = useSettings();

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={value}
      defaultValue={initialValue}
      onChange={onChange}
      theme={theme || settings.editor.theme}
      options={{
        fontSize: options?.fontSize || settings.editor.fontSize,
        tabSize: options?.tabSize || settings.editor.tabSize,
        wordWrap:
          options?.wordWrap || (settings.editor.wordWrap ? "on" : "off"),
        minimap: options?.minimap || { enabled: false },
        scrollBeyondLastLine: options?.scrollBeyondLastLine || false,
        automaticLayout: options?.automaticLayout || true,
      }}
    />
  );
}
