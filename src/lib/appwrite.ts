import "server-only"; // ⛔ Prevents accidental import into client components
import {
  Client,
  Databases,
  Account,
  Users,
  Storage,
  Teams,
} from "node-appwrite";
import { requiredEnv } from "@/lib/utils";

/**
 * Shared: Centralized error handler
 */
export function handleAppwriteError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "An unexpected error occurred. Please try again.";
}

/**
 * Types for intellisense
 */
export type AppwriteAdminClient = Awaited<ReturnType<typeof createAdminClient>>;
export type AppwriteSessionClient = Awaited<
  ReturnType<typeof createSessionClient>
>;

/**
 * Admin client for privileged server-side operations.
 * ⚠️ Uses API key. Keep this strictly server-side.
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(requiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))
    .setProject(requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))
    .setKey(requiredEnv("APPWRITE_API_KEY"));

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    users: new Users(client),
    storage: new Storage(client),
    teams: new Teams(client),
  };
}

/**
 * Session client for acting on behalf of a logged-in user.
 * Uses `sessionId`, not API key.
 */
export async function createSessionClient(sessionId: string) {
  const client = new Client()
    .setEndpoint(requiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))
    .setProject(requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))
    .setSession(sessionId);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    users: new Users(client),
    storage: new Storage(client),
    teams: new Teams(client),
  };
}

/**
 * Helper: Get a session client from cookie (SSR safe).
 */
import { cookies } from "next/headers";

export async function withSession() {
  const sessionId = (await cookies()).get("session")?.value;
  if (!sessionId) return null;

  try {
    return await createSessionClient(sessionId);
  } catch {
    return null;
  }
}

/**
 * Role management utilities
 * Store roles in user.preferences for now (simple & scalable).
 * Upgrade to Teams if you need multi-role support later.
 */
export type UserRole = "admin" | "volunteer" | "community";

export async function assignRole(userId: string, role: UserRole) {
  const { users } = await createAdminClient();
  await users.updatePrefs(userId, { role });
}

export async function getUserRole(sessionId: string): Promise<UserRole | null> {
  try {
    const { account } = await createSessionClient(sessionId);
    const user = await account.get();
    return (user.prefs.role as UserRole) || null;
  } catch {
    return null;
  }
}

/**
 * Common helpers for reusability
 */
export async function getCurrentUser(sessionId: string) {
  try {
    const { account } = await createSessionClient(sessionId);
    return await account.get();
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export async function uploadFile(bucketId: string, file: File) {
  const { storage } = await createAdminClient();
  return storage.createFile(bucketId, "unique()", file);
}
