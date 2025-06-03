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
  User,
  LayoutDashboard,
  GraduationCap,
  FolderGit2,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationItem, NavigationSection } from "@/lib/types/navigation";
import Link from "next/link";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const isTeacher = user?.role === "teacher";

  const navigation: NavigationSection[] = [
    {
      title: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          current: true,
        },
        {
          name: "Classrooms",
          href: "/dashboard/classrooms",
          icon: GraduationCap,
          current: false,
        },
        {
          name: "Assignments",
          href: "/dashboard/assignments",
          icon: BookOpen,
          current: false,
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          name: "Code Corner",
          href: "/dashboard/codecorner",
          icon: Code2,
          current: false,
        },
        {
          name: "Discussions",
          href: "/dashboard/discussions",
          icon: MessageSquare,
          current: false,
        },
        {
          name: "Projects",
          href: "/dashboard/projects",
          icon: FolderGit2,
          current: false,
        },
      ],
    },
    {
      title: "Teacher",
      items: [
        {
          name: "Teacher Dashboard",
          href: "/dashboard/teacher",
          icon: School,
          current: false,
          teacherOnly: true,
        },
        {
          name: "Manage Projects",
          href: "/dashboard/teacher/projects",
          icon: FolderGit2,
          current: false,
          teacherOnly: true,
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col gap-y-5 bg-background px-6">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          <span className="text-lg font-semibold">CodeCommons</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {navigation.map((section) => (
            <li key={section.title}>
              <div className="text-xs font-semibold leading-6 text-muted-foreground">
                {section.title}
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {section.items
                  .filter((item) => !item.teacherOnly || isTeacher)
                  .map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.current
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
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
