import type { Metadata } from "next";
import { getUser } from "@/actions/auth";
import { MarketingHeader } from "@/components/layout/header";
import { MarketingFooter } from "@/components/layout/footer";
import { LayoutWrapper } from "@/components/layout";

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
    <LayoutWrapper>
      <MarketingHeader user={user} />
      <main>{children}</main>
      <MarketingFooter />
    </LayoutWrapper>
  );
}
