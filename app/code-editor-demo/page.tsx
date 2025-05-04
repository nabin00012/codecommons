"use client";

import { CodeEditor } from "@/components/code-editor";
import { useState } from "react";

export default function CodeEditorDemo() {
  const [code, setCode] = useState(`// Type your code here
function helloWorld() {
  console.log("Hello, World!");
}`);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Code Editor Demo</h1>
      <div className="mb-4">
        <CodeEditor
          initialValue={code}
          language="typescript"
          onChange={(value) => setCode(value || "")}
          height="400px"
          theme="vs-dark"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Current Code:</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
          {code}
        </pre>
      </div>
    </div>
  );
}
