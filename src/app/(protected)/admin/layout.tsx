import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { getUser } from "@/actions/auth";
import { AdminHeader } from "@/components/layout/header";
import { AdminSidebar } from "@/components/layout/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  console.log(user);
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminHeader />
        <div className="flex h-full">
          <AdminSidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
