"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  links: { href: string; label: string; icon?: React.ReactNode }[];
}

function SidebarNav({ links }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="py-24">
        <SidebarGroup>
          {/* {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>} */}
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        href={link.href}
                        className={cn("p-6", active && "font-semibold")}
                      >
                        {link.icon && <span className="mr-2">{link.icon}</span>}
                        {link.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export function AdminSidebar() {
  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/resources", label: "Resources" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/settings", label: "Settings" },
  ];
  return <SidebarNav links={links} />;
}

export function UserSidebar() {
  const links = [
    { href: "/user/dashboard", label: "Dashboard" },
    { href: "/user/get-help", label: "Report an Incident" },
    { href: "/user/my-reports", label: "My Reports" },
  ];
  return <SidebarNav links={links} />;
}

export function VolunteerSidebar() {
  const links = [
    { href: "/volunteer/dashboard", label: "Dashboard" },
    { href: "/volunteer/assignments", label: "My Assignments" },
    { href: "/volunteer/profile", label: "My Profile" },
    { href: "/volunteer/resources", label: "Resources" },
    { href: "/volunteer/settings", label: "Settings" },
  ];

  return <SidebarNav links={links} />;
}
