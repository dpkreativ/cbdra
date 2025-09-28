import { Client, Databases, Account, Users, Storage } from "node-appwrite";
import { requiredEnv } from "@/lib/utils";

/**
 * Admin client for privileged server-side operations.
 * Uses API key; exposes Account, Databases, and Users services.
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(requiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))
    .setProject(requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))
    .setKey(requiredEnv("NEXT_PUBLIC_APPWRITE_API_KEY"));

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    users: new Users(client),
    storage: new Storage(client),
  };
}

/**
 * Session client for acting on behalf of a logged-in user.
 * IMPORTANT: Use setSession(sessionId), not setKey().
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
  };
}
