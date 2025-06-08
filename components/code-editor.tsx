"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { useSettings } from "@/lib/context/settings-context";

export interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string | undefined) => void;
  height?: string;
  theme?: string;
}

export function CodeEditor({
  value,
  language,
  onChange,
  height = "500px",
  theme,
}: CodeEditorProps) {
  const { settings } = useSettings();

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      defaultValue={value}
      onChange={onChange}
      theme={theme || settings.editor.theme}
      options={{
        fontSize: settings.editor.fontSize,
        tabSize: settings.editor.tabSize,
        wordWrap: settings.editor.wordWrap ? "on" : "off",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
