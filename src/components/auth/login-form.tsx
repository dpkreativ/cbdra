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
import { useFormStatus } from "react-dom";
import { loginSchema } from "@/schemas/auth";

export function LoginForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailFieldId = useMemo(() => "email-input", []);
  const passwordFieldId = useMemo(() => "password-input", []);
  const [showPassword, setShowPassword] = useState(false);

  async function handleClientValidation(e: React.FormEvent<HTMLFormElement>) {
    const ok = await form.trigger();
    if (!ok) e.preventDefault();
  }

  return (
    <Form {...form}>
      <form
        action={action}
        onSubmit={handleClientValidation}
        className="space-y-5"
      >
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
                  aria-invalid={!!form.formState.errors.email}
                  aria-describedby={
                    form.formState.errors.email ? "email-error" : undefined
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage id="email-error" />
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
                    aria-invalid={!!form.formState.errors.password}
                    aria-describedby={
                      form.formState.errors.password
                        ? "password-error"
                        : undefined
                    }
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute hover:bg-transparent right-2 top-1/2 -translate-y-1/2"
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

        <SubmitButton disabledByClient={!form.formState.isValid} />
      </form>
    </Form>
  );
}

function SubmitButton({ disabledByClient }: { disabledByClient: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabledByClient}
      aria-busy={pending}
      className="w-full"
    >
      {pending ? "Signing in..." : "Login"}
    </Button>
  );
}
