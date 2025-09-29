"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/auth";
import { loginSchema } from "@/schemas/auth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailFieldId = useMemo(() => "email-input", []);
  const passwordFieldId = useMemo(() => "password-input", []);

  async function handleSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await login({ redirectTo: "/user/dashboard" }, formData);

    setLoading(false);

    if (result.success) {
      router.push(result.redirectTo ?? "/");
    } else {
      setError(result.message ?? "Something went wrong, please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={emailFieldId}>Email</FormLabel>
              <FormControl>
                <Input
                  id={emailFieldId}
                  type="email"
                  autoComplete="email"
                  placeholder="johndoe@mail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={passwordFieldId}>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id={passwordFieldId}
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={!form.formState.isValid || loading}
          className="w-full"
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
