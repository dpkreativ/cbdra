import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get("session")?.value);
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);

    if (req.nextUrl.pathname !== "/login") {
      loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/get-help", "/profile"],
};
