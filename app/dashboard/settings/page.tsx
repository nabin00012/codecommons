"use client";

import { useSettings } from "@/lib/context/settings-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Palette, Bell, Code2, Globe, RefreshCw, Save } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();

  const handleThemeChange = (value: string) => {
    updateSettings({ theme: value as "light" | "dark" | "system" });
  };

  const handleNotificationChange = (
    key: keyof typeof settings.notifications,
    value: boolean
  ) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const handleEditorSettingChange = (
    key: keyof typeof settings.editor,
    value: number | boolean
  ) => {
    updateSettings({
      editor: {
        ...settings.editor,
        [key]: value,
      },
    });
  };

  const handleLanguageChange = (value: string) => {
    updateSettings({ language: value });
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
                Settings
              </h1>
              <p className="text-muted-foreground">Customize your experience</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                onClick={resetSettings}
              >
                <RefreshCw className="h-4 w-4" />
                Reset Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                onClick={() => {
                  // Save settings to backend in a real implementation
                  console.log("Settings saved:", settings);
                }}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Theme Settings */}
          <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={handleThemeChange}
                  >
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-primary/20">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Settings */}
          <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(
                          key as keyof typeof settings.notifications,
                          checked
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Editor Settings */}
          <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Slider
                    value={[settings.editor.fontSize]}
                    onValueChange={([value]) =>
                      handleEditorSettingChange("fontSize", value)
                    }
                    min={8}
                    max={24}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tab Size</Label>
                  <Slider
                    value={[settings.editor.tabSize]}
                    onValueChange={([value]) =>
                      handleEditorSettingChange("tabSize", value)
                    }
                    min={2}
                    max={8}
                    step={1}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Word Wrap</Label>
                  <Switch
                    checked={settings.editor.wordWrap}
                    onCheckedChange={(checked) =>
                      handleEditorSettingChange("wordWrap", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Minimap</Label>
                  <Switch
                    checked={settings.editor.minimap}
                    onCheckedChange={(checked) =>
                      handleEditorSettingChange("minimap", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Interface Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-primary/20">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
