import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { headers } from "next/headers";

export default async function Page() {
  const searchParams = new URLSearchParams(
    (await headers()).get("x-url") || ""
  );
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  return (
    <div className="px-5 py-20 w-full max-w-md mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-2xl font-bold">Welcome to CBDRA</h1>
        <p>Please create an account to continue.</p>
      </div>
      <SignupForm action={signup.bind(null, { redirectTo })} />

      <p className="text-muted-foreground">
        Already have an account?{" "}
        <Link className="text-primary underline font-semibold" href="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
