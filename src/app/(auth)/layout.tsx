import type { Metadata } from "next";
import Image from "next/image";
import illustration from "@/assets/images/illustration.svg";

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
    <body>
      <main className="grid md:grid-cols-2 gap-5 place-items-center">
        <div className="w-full max-w-md mx-auto p-5">
          <Image src={illustration} alt="CBDRA" />
        </div>

        {children}
      </main>
    </body>
  );
}
