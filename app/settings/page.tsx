"use client";

import React from "react";
import { useSettings } from "@/lib/context/settings-context";
import { CodeEditor } from "@/components/code-editor";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ theme: e.target.value });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ language: e.target.value });
  };

  const handleEditorThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({
      editor: { ...settings.editor, theme: e.target.value },
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      editor: { ...settings.editor, fontSize: parseInt(e.target.value) },
    });
  };

  const handleTabSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      editor: { ...settings.editor, tabSize: parseInt(e.target.value) },
    });
  };

  const handleWordWrapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      editor: { ...settings.editor, wordWrap: e.target.checked },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid gap-8">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={handleThemeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Editor Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Editor Theme
              </label>
              <select
                value={settings.editor.theme}
                onChange={handleEditorThemeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="vs-dark">Dark</option>
                <option value="vs-light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Font Size: {settings.editor.fontSize}px
              </label>
              <input
                type="range"
                min="8"
                max="24"
                value={settings.editor.fontSize}
                onChange={handleFontSizeChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tab Size: {settings.editor.tabSize} spaces
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={settings.editor.tabSize}
                onChange={handleTabSizeChange}
                className="w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="wordWrap"
                checked={settings.editor.wordWrap}
                onChange={handleWordWrapChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="wordWrap"
                className="ml-2 block text-sm text-gray-700"
              >
                Enable Word Wrap
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <CodeEditor
            value="// Your code here\nfunction example() {\n  console.log('Hello, World!');\n}"
            language="typescript"
            onChange={() => {}}
            height="200px"
          />
        </section>
      </div>
    </div>
  );
}
