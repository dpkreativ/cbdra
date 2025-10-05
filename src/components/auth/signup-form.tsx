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
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { signupSchema } from "@/schemas/auth";
import { signup } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignupForm() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      role: "community",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameFieldId = useMemo(() => "signup-name-input", []);
  const emailFieldId = useMemo(() => "signup-email-input", []);
  const passwordFieldId = useMemo(() => "signup-password-input", []);
  const confirmPasswordFieldId = useMemo(
    () => "signup-confirm-password-input",
    []
  );
  const roleFieldId = useMemo(() => "signup-role-select", []);

  async function handleSubmit(values: z.infer<typeof signupSchema>) {
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("role", values.role);

    const result = await signup({ redirectTo: "/user/dashboard" }, formData);
    setLoading(false);

    if (result.success) {
      router.push(result.redirectTo ?? "/");
    } else {
      setError(result.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
                    autoComplete="new-password"
                    disabled={loading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    disabled={loading}
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

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={confirmPasswordFieldId}>
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id={confirmPasswordFieldId}
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={loading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    disabled={loading}
                  >
                    {showConfirm ? (
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

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={roleFieldId}>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <SelectTrigger id={roleFieldId} className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community">Community User</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="gov">Govt. Agency</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!form.formState.isValid || loading}
          className="w-full"
        >
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
