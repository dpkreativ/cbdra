"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";

interface AuthOptions {
  redirectTo?: string;
}

/**
 * Login with email/password.
 * Creates a user session, stores it in a secure cookie, and redirects to /dashboard.
 */
export async function login(options: AuthOptions, formData: FormData) {
  const email = formData.get("email") ? String(formData.get("email")) : "";
  const password = formData.get("password")
    ? String(formData.get("password"))
    : "";

  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    return {
      success: true,
      redirectTo: options.redirectTo || "/user/dashboard",
    };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error?.message || "Login failed" };
  }
}

/**
 * Signup with name, email, password, and role.
 * Creates a new user, sets their role in preferences, creates a session, sets cookie, and redirects.
 */
export async function signup(options: AuthOptions, formData: FormData) {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "user");

  try {
    const { users, account } = await createAdminClient();

    // 1) Create the user
    const user = await users.create(
      ID.unique(),
      email,
      undefined,
      password,
      name || undefined
    );

    // 2) Store role in preferences
    await users.updatePrefs(user.$id, { role });

    // 3) Create session
    const session = await account.createEmailPasswordSession(email, password);

    // 4) Store session in cookie
    const cookieStore = await cookies();
    cookieStore.set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    return {
      success: true,
      redirectTo: options.redirectTo || "/user/dashboard",
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
 * Get the current user's session from the cookie
 */
export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session?.value) return null;

  const { account } = await createSessionClient(session.value);

  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}
