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
  Code2,
  Calendar,
  Users2,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services/auth";
import { ModeToggle } from "@/components/mode-toggle";

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
      name: "Projects",
      href: "/dashboard/projects",
      icon: Code2,
      current: pathname.includes("/projects"),
    },
    {
      name: "CodeCorner",
      href: "/dashboard/codecorner",
      icon: Code,
      current: pathname.includes("/codecorner"),
    },
    {
      name: "Community",
      href: "/dashboard/community",
      icon: Users,
      current: pathname.includes("/community"),
      subItems: [
        {
          name: "Discussions",
          href: "/dashboard/community/discussions",
          icon: MessageSquare,
        },
        {
          name: "Events",
          href: "/dashboard/community/events",
          icon: Calendar,
        },
        {
          name: "Groups",
          href: "/dashboard/community/groups",
          icon: Users2,
        },
      ],
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
            <div key={item.name}>
              <Button
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
              {item.subItems && item.current && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Button
                      key={subItem.name}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => router.push(subItem.href)}
                    >
                      <subItem.icon className="mr-2 h-4 w-4" />
                      {subItem.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t p-4 flex flex-col gap-4">
        <ModeToggle />
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
