"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormStatus } from "react-dom";
import { signupSchema } from "@/schemas/auth";

export function SignupForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      role: "user",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const nameFieldId = useMemo(() => "signup-name-input", []);
  const emailFieldId = useMemo(() => "signup-email-input", []);
  const passwordFieldId = useMemo(() => "signup-password-input", []);
  const confirmPasswordFieldId = useMemo(
    () => "signup-confirm-password-input",
    []
  );
  const roleFieldId = useMemo(() => "signup-role-select", []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={nameFieldId}>Name</FormLabel>
              <FormControl>
                <Input
                  id={nameFieldId}
                  placeholder="John Doe"
                  aria-invalid={!!form.formState.errors.name}
                  aria-describedby={
                    form.formState.errors.name ? "signup-name-error" : undefined
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage id="signup-name-error" />
            </FormItem>
          )}
        />

        {/* Email */}
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
                    form.formState.errors.email
                      ? "signup-email-error"
                      : undefined
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage id="signup-email-error" />
            </FormItem>
          )}
        />

        {/* Password */}
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
                        ? "signup-password-error"
                        : undefined
                    }
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage id="signup-password-error" />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={confirmPasswordFieldId}>
                Confirm password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id={confirmPasswordFieldId}
                    type={showConfirm ? "text" : "password"}
                    autoComplete="off"
                    aria-invalid={!!form.formState.errors.confirmPassword}
                    aria-describedby={
                      form.formState.errors.confirmPassword
                        ? "signup-confirm-password-error"
                        : undefined
                    }
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage id="signup-confirm-password-error" />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={roleFieldId}>Role</FormLabel>
              <FormControl>
                {/* If you want to keep your current Select control: */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    id={roleFieldId}
                    className="w-full"
                    aria-invalid={!!form.formState.errors.role}
                    aria-describedby={
                      form.formState.errors.role
                        ? "signup-role-error"
                        : undefined
                    }
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage id="signup-role-error" />
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
      {pending ? "Creating account..." : "Sign up"}
    </Button>
  );
}
