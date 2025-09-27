import { Client, Databases, Account } from "node-appwrite";
import { requiredEnv } from "@/lib/utils";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(requiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))
    .setProject(requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))
    .setKey(requiredEnv("NEXT_PUBLIC_APPWRITE_API_KEY"));
  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
  };
}

export async function createSessionClient(sessionCookie: string) {
  const client = new Client()
    .setEndpoint(requiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))
    .setProject(requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))
    .setKey(sessionCookie);
  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
  };
}
