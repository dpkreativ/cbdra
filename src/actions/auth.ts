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

  redirect(options.redirectTo || "/dashboard");
}

/**
 * Signup with name, email, password, and role.
 * Creates a new user, sets their role in preferences, creates a session, sets cookie, and redirects.
 */
export async function signup(options: AuthOptions, formData: FormData) {
  const name = formData.get("name") ? String(formData.get("name")) : "";
  const email = formData.get("email") ? String(formData.get("email")) : "";
  const password = formData.get("password")
    ? String(formData.get("password"))
    : "";
  const role = formData.get("role") ? String(formData.get("role")) : "user";

  const { users, account } = await createAdminClient();

  // 1) Create the user (server-side)
  const user = await users.create(
    ID.unique(),
    email,
    "",
    password,
    name || undefined
  );

  // 2) Store role in user preferences (optional but useful)
  await users.updatePrefs(user.$id, { role });

  // 3) Create session for the newly created user
  const session = await account.createEmailPasswordSession(email, password);

  // 4) Persist session in secure cookie
  const cookieStore = await cookies();
  cookieStore.set("session", session.secret, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: new Date(session.expire),
    path: "/",
  });

  redirect(options.redirectTo || "/dashboard");
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
