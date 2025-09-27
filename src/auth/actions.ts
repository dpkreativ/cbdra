"use server";

import { createAdminClient, createSessionClient } from "@/appwrite/config";
import auth from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSession(formData: FormData) {
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

  redirect("/dashboard");
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (session) {
    try {
      const { account } = await createSessionClient(session);
      await account.deleteSession("current");
    } catch (error) {}
  }

  cookieStore.delete("session");
  auth.user = null;
  auth.sessionCookie = null;
  redirect("/login");
}
