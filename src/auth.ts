import { createSessionClient } from "./appwrite/config";
import { cookies } from "next/headers";

const auth = {
  user: null as unknown | null,
  sessionCookie: null,
  getUser: async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) {
      auth.user = null;
      return auth.user;
    }
    try {
      const { account } = await createSessionClient(session);
      auth.user = await account.get();
    } catch {
      auth.user = null;
      auth.sessionCookie = null;
    }
    return auth.user;
  },
};

export default auth;
