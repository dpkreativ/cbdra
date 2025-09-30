import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import mascot from "@/assets/images/mascot-1.svg";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/actions/auth";
import { MarketingHeader } from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Based Disaster Response App",
  description: "Get the help you need during emergencies.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MarketingHeader user={user} />
        <main>{children}</main>
        <footer className="text-center">
          <div className="md:text-left p-5 py-20 w-full max-w-[1200px] mx-auto grid justify-center md:flex gap-20 md:justify-between items-center">
            <div className="grid md:flex items-center gap-5">
              <Image src={mascot} alt="Mascot" className="w-10 mx-auto" />
              <div>
                <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
                  CBDRA
                </h1>
                <p className="text-muted-foreground">
                  Community Based Disaster Response App
                </p>
              </div>
            </div>

            <div className="grid md:flex gap-10 text-muted-foreground">
              <div className="flex flex-col gap-3">
                <Link href="/login">Get Help</Link>
                <Link href="/signup">Join as Volunteer</Link>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/#quick-stats">Quick stats</Link>
                <Link href="/#how-it-works">How it works</Link>
              </div>
            </div>
          </div>
          <p className="text-center p-5">
            © {new Date().getFullYear()} CBDRA. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
