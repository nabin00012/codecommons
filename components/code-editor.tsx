"use client";

import { useState, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useSettings } from "@/lib/context/settings-context";

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
  const { settings } = useSettings();

  const handleEditorChange = (value: string | undefined) => {
    setValue(value || "");
    onChange?.(value);
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    // Configure editor options
    editor.updateOptions({
      fontSize: settings.editor.fontSize,
      tabSize: settings.editor.tabSize,
      wordWrap: settings.editor.wordWrap ? "on" : "off",
      minimap: { enabled: settings.editor.minimap },
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      automaticLayout: true,
    });
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
        onMount={handleEditorDidMount}
        loading={
          <div className="w-full h-full flex items-center justify-center">
            Loading editor...
          </div>
        }
        options={{
          minimap: { enabled: settings.editor.minimap },
          fontSize: settings.editor.fontSize,
          tabSize: settings.editor.tabSize,
          wordWrap: settings.editor.wordWrap ? "on" : "off",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
