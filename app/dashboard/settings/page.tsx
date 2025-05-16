"use client";

import { useSettings } from "@/lib/context/settings-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Stars } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and settings.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Customize the appearance of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  updateSettings({
                    theme: value as "light" | "dark" | "cosmic" | "system",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme">
                    <div className="flex items-center gap-2">
                      {settings.theme === "light" && (
                        <Sun className="h-4 w-4" />
                      )}
                      {settings.theme === "dark" && (
                        <Moon className="h-4 w-4" />
                      )}
                      {settings.theme === "cosmic" && (
                        <Stars className="h-4 w-4" />
                      )}
                      {settings.theme === "system" && <span>System</span>}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cosmic">
                    <div className="flex items-center gap-2">
                      <Stars className="h-4 w-4" />
                      <span>Cosmic</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <span>System</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>
              Customize your code editor settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Slider
                value={[settings.editor.fontSize]}
                onValueChange={([value]) =>
                  updateSettings({
                    editor: { ...settings.editor, fontSize: value },
                  })
                }
                min={12}
                max={24}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Tab Size</Label>
              <Slider
                value={[settings.editor.tabSize]}
                onValueChange={([value]) =>
                  updateSettings({
                    editor: { ...settings.editor, tabSize: value },
                  })
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
                  updateSettings({
                    editor: { ...settings.editor, wordWrap: checked },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Minimap</Label>
              <Switch
                checked={settings.editor.minimap}
                onCheckedChange={(checked) =>
                  updateSettings({
                    editor: { ...settings.editor, minimap: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage your notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Notifications</Label>
              <Switch
                checked={settings.notifications.enabled}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      enabled: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Sound</Label>
              <Switch
                checked={settings.notifications.sound}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: {
                      ...settings.notifications,
                      sound: checked,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
