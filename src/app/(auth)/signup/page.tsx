import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { signup } from "@/actions/auth";

export default function Page() {
  return (
    <div className="px-5 py-20 w-full max-w-md mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className="text-2xl font-bold">Welcome to CBDRA</h1>
        <p>Please create an account to continue.</p>
      </div>
      <SignupForm action={signup} />

      <p className="text-muted-foreground">
        Already have an account?{" "}
        <Link className="text-primary underline font-semibold" href="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
