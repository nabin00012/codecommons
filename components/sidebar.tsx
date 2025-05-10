"use client";

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services/auth";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const isTeacher = user?.role === "teacher";

  const navigation = [
    {
      name: "Classrooms",
      href: "/dashboard/classrooms",
      icon: BookOpen,
      current: pathname.includes("/classrooms"),
    },
    {
      name: "Assignments",
      href: "/dashboard/assignments",
      icon: FileText,
      current: pathname.includes("/assignments"),
    },
    {
      name: "Discussions",
      href: "/dashboard/discussions",
      icon: MessageSquare,
      current: pathname.includes("/discussions"),
    },
    {
      name: "Students",
      href: "/dashboard/students",
      icon: Users,
      current: pathname.includes("/students"),
      teacherOnly: true,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname.includes("/settings"),
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: HelpCircle,
      current: pathname.includes("/help"),
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center border-b px-4">
        <h1 className="text-xl font-semibold">CodeCommons</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          if (item.teacherOnly && !isTeacher) return null;
          return (
            <Button
              key={item.name}
              variant={item.current ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.current && "bg-gray-100"
              )}
              onClick={() => router.push(item.href)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.name}
            </Button>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log out
        </Button>
      </div>
    </div>
  );
}
