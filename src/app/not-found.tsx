"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/app/globals.css";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-6 text-center"
      >
        <Card className="w-full max-w-md shadow-md border border-border/50">
          <CardContent className="flex flex-col items-center space-y-5 p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              We couldn't find that page
            </h1>
            <p className="text-muted-foreground">
              Looks like the page you're searching for isn't here. Don't worry,
              you're still safe with us.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="default" className="px-6">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                className="px-6"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Error code: <span className="font-mono text-foreground">404</span>
        </p>
      </motion.div>
    </main>
  );
}
