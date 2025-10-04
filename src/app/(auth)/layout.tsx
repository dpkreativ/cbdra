import type { Metadata } from "next";
import Image from "next/image";
import illustration from "@/assets/images/illustration.svg";
import "@/app/globals.css";
import { MarketingHeader } from "@/components/layout/header";
import { MarketingFooter } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Auth - CBDRA",
  description: "Get the help you need during emergencies.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <MarketingHeader />
        <main className="grid md:grid-cols-2 gap-5 pt-20">
          <div className="w-full max-w-md mx-auto px-5 md:pt-20">
            <Image src={illustration} alt="CBDRA" />
          </div>
          {children}
        </main>
        <MarketingFooter />
      </body>
    </html>
  );
}
