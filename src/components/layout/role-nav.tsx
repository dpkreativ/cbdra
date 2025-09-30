"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  Users,
  Settings,
  ShieldAlert,
  ClipboardList,
  BarChart3,
  UserCheck,
} from "lucide-react";

type UserRole = "community" | "volunteer" | "admin" | "ngo" | "gov";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  // Community User
  {
    href: "/user/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["community"],
  },
  {
    href: "/user/get-help",
    label: "Report Incident",
    icon: <Megaphone className="w-5 h-5" />,
    roles: ["community"],
  },
  {
    href: "/user/my-reports",
    label: "My Reports",
    icon: <FileText className="w-5 h-5" />,
    roles: ["community"],
  },
  // Volunteer
  {
    href: "/volunteer/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["volunteer"],
  },
  {
    href: "/volunteer/assignments",
    label: "My Assignments",
    icon: <ClipboardList className="w-5 h-5" />,
    roles: ["volunteer"],
  },
  {
    href: "/volunteer/available-incidents",
    label: "Available Incidents",
    icon: <ShieldAlert className="w-5 h-5" />,
    roles: ["volunteer"],
  },
  // Admin
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    href: "/admin/incidents",
    label: "Incidents",
    icon: <ShieldAlert className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Users className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    href: "/admin/resources",
    label: "Resources",
    icon: <UserCheck className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ["admin"],
  },
  // NGO
  {
    href: "/ngo/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["ngo"],
  },
  {
    href: "/ngo/incidents",
    label: "Incidents",
    icon: <ShieldAlert className="w-5 h-5" />,
    roles: ["ngo"],
  },
  {
    href: "/ngo/team",
    label: "Team",
    icon: <Users className="w-5 h-5" />,
    roles: ["ngo"],
  },
  // Government
  {
    href: "/gov/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["gov"],
  },
  {
    href: "/gov/incidents",
    label: "Incidents",
    icon: <ShieldAlert className="w-5 h-5" />,
    roles: ["gov"],
  },
  {
    href: "/gov/reports",
    label: "Reports",
    icon: <FileText className="w-5 h-5" />,
    roles: ["gov"],
  },
];

export function RoleBasedNav({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();

  const navItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
            )}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* Common links */}
      <Link
        href="/profile"
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-4 border-t pt-4",
          pathname === "/profile"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
        )}
      >
        <Settings className="w-5 h-5" />
        <span className="font-medium">Settings</span>
      </Link>
    </nav>
  );
}
