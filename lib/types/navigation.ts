import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
  teacherOnly?: boolean;
  subItems?: NavigationItem[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}
