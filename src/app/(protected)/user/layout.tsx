import { UserHeader } from "@/components/layout/header";
import { getUser, signout } from "@/actions/auth";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";
import { UserSidebar } from "@/components/layout/sidebar-nav";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser();

  return {
    title: user?.name ? `CBDRA - ${user.name}` : "CBDRA - User",
    description: "Get the help you need during emergencies.",
  };
}

export default async function UserLayout({
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
        <UserHeader user={user} signout={signout} />
        <SidebarProvider>
          <UserSidebar />
          <main className="p-5 md:p-8 space-y-8 w-full">{children}</main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
