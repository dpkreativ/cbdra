import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get("session")?.value);
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/get-help"],
};
