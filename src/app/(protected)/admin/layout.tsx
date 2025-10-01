import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { AdminHeader } from "@/components/layout/header";
import { AdminSidebar } from "@/components/layout/sidebar-nav";
import { getUser, signout } from "@/actions/auth";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider className="flex flex-col h-screen">
          {/* Fixed header */}
          <AdminHeader user={user} signout={signout} />

          {/* Fixed sidebar */}
          <AdminSidebar />

          {/* Main content (with left margin to account for sidebar) */}
          <main className="overflow-y-auto p-6">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
