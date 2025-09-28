import { login } from "@/actions/auth";
import { LoginForm } from "@/components/auth/login-form";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Page() {
  const searchParams = new URLSearchParams(
    (await headers()).get("x-url") || ""
  );
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  return (
    <div className="p-5 w-full max-w-md mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-2xl font-bold">Stay Safe. Stay Connected</h1>
        <p>Please login to your account to continue.</p>
      </div>
      <LoginForm action={login.bind(null, { redirectTo })} />

      <p className="text-muted-foreground text-center md:text-left">
        Don&apos;t have an account?{" "}
        <Link
          className="text-primary underline font-semibold"
          href={`/signup${
            redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
          }`}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
