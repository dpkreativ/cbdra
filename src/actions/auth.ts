"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";

interface AuthOptions {
  redirectTo?: string;
}

type AuthResult =
  | { success: true; redirectTo: string }
  | { success: false; message: string };

// Define allowed roles
const ALLOWED_ROLES = ["admin", "community", "volunteer"] as const;
type UserRole = (typeof ALLOWED_ROLES)[number];

function getRedirectPath(role: UserRole, custom?: string) {
  if (custom) return custom;
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "volunteer":
      return "/volunteer/dashboard";
    case "community":
    default:
      return "/user/dashboard";
  }
}

/**
 * Login with email/password.
 * Reads role from prefs, creates a session, sets cookie, and redirects accordingly.
 */
export async function login(
  options: AuthOptions,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    // Store session in cookie
    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
      path: "/",
    });

    // Fetch user to get role
    const user = await account.get();
    const role = (user.prefs.role as UserRole) || "community";

    return {
      success: true,
      redirectTo: getRedirectPath(role, options.redirectTo),
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error?.message || "Login failed" };
  }
}

/**
 * Signup with name, email, password, and role.
 * Creates user, sets role, creates session, sets cookie, and redirects accordingly.
 */
export async function signup(
  options: AuthOptions,
  formData: FormData
): Promise<AuthResult> {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "community") as UserRole;

  try {
    if (!ALLOWED_ROLES.includes(role)) {
      return { success: false, message: "Invalid role selected" };
    }

    const { users, account } = await createAdminClient();

    // Create user
    const user = await users.create(
      ID.unique(),
      email,
      undefined,
      password,
      name || undefined
    );

    // Store role in preferences
    await users.updatePrefs(user.$id, { role });

    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    // Store session in cookie
    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(session.expire),
      path: "/",
    });

    return {
      success: true,
      redirectTo: getRedirectPath(role, options.redirectTo),
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error?.message || "Signup failed" };
  }
}

/**
 * Signout by deleting the current session (if any), clearing the cookie, and redirecting to /login.
 */
export async function signout() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session?.value) return;

  const { account } = await createSessionClient(session.value);

  await account.deleteSession("current");
  cookieStore.delete("session");
  redirect("/login");
}

/**
 * Get the current logged-in user, including role
 */
export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session?.value) return null;

  const { account } = await createSessionClient(session.value);

  try {
    const user = await account.get();
    return {
      ...user,
      role: (user.prefs.role as UserRole) || "community",
    };
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}
