import z from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string({ error: "Name is required" }).min(1, "Name is required"),
    email: z
      .string({ error: "Email is required" })
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string({ error: "Confirm your password" })
      .min(6, "Password must be at least 6 characters"),
    role: z.string({ error: "Role is required" }).min(1, "Role is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
