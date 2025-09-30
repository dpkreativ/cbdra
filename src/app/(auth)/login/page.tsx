import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import Image from "next/image";
import mascot from "@/assets/images/mascot-1.svg";

export default async function Page() {
  return (
    <div className="p-5 w-full max-w-md mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Image src={mascot} alt="Mascot" className="w-5" />
          <h2 className="text-2xl font-bold">Welcome Back</h2>
        </div>
        <p className="text-muted-foreground">
          Sign in to access your dashboard and manage incidents
        </p>
      </div>

      {/* Form */}
      <LoginForm />

      {/* Footer */}
      <div className="space-y-4 text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="text-primary underline font-semibold hover:no-underline"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
        <p className="text-muted-foreground">
          <Link
            className="text-primary underline hover:no-underline"
            href="/forgot-password"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
