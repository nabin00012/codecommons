"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/context/user-context";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  Trophy,
  Settings,
  HelpCircle,
  Code,
  ChevronRight,
  LogOut,
  Users,
  Folder,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DashboardSidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "My Classrooms",
      icon: BookOpen,
      href: "/dashboard/classrooms",
    },
    {
      title: "Assignments",
      icon: FileText,
      href: "/dashboard/assignments",
    },
    {
      title: "Code Editor",
      icon: Code,
      href: "/dashboard/code-editor",
    },
    {
      title: "Q&A Forum",
      icon: MessageSquare,
      href: "/dashboard/questions",
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: Folder,
    },
    {
      title: "Leaderboard",
      icon: Trophy,
      href: "/leaderboard",
    },
    {
      title: "Community",
      icon: Users,
      href: "/community",
    },
  ];

  const bottomItems = [
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/dashboard/help",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 20 }}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[280px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          !isOpen && "hidden lg:block"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">CodeCommons</span>
            </Link>
          </div>

          {/* User info */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                <img
                  src={user?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{user?.name || "User Name"}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {user?.role || "student"}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {sidebarItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {(item.title === "My Classrooms" ||
                      item.title === "Assignments" ||
                      item.title === "Q&A Forum") && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-medium text-primary">
                        {item.title === "My Classrooms"
                          ? "5"
                          : item.title === "Assignments"
                          ? "3"
                          : "8"}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom items */}
          <div className="border-t px-2 py-4">
            <ul className="space-y-1">
              {bottomItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm lg:flex"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </motion.aside>
    </>
  );
}
