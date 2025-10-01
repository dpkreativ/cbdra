"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  links: { href: string; label: string; icon?: React.ReactNode }[];
  title?: string;
}

function SidebarNav({ links, title }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        href={link.href}
                        className={cn(active && "font-semibold")}
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
  return <SidebarNav links={links} title="Admin Panel" />;
}

export function UserSidebar() {
  const links = [
    { href: "/user/dashboard", label: "Dashboard" },
    { href: "/user/get-help", label: "Report an Incident" },
    { href: "/user/my-reports", label: "My Reports" },
  ];
  return <SidebarNav links={links} title="User Menu" />;
}
