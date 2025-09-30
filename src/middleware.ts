// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";

// Define protected routes for each role
const ROLE_ROUTES = {
  community: ["/user"],
  volunteer: ["/volunteer"],
  admin: ["/admin"],
  ngo: ["/ngo"],
  gov: ["/gov"],
} as const;

// Routes that require authentication but are role-agnostic
const COMMON_PROTECTED_ROUTES = ["/profile", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("session")?.value;

  // Allow public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check if user has session
  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify session and get user role
  try {
    const { account } = await createSessionClient(sessionCookie);
    const user = await account.get();
    const userRole = (user.prefs.role as string) || "community";

    // Check if user is accessing their allowed routes
    const allowedRoutes =
      ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || [];
    const isAccessingAllowedRoute = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAccessingCommonRoute = COMMON_PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Allow access if accessing allowed route or common route
    if (isAccessingAllowedRoute || isAccessingCommonRoute) {
      return NextResponse.next();
    }

    // Redirect to appropriate dashboard if accessing wrong route
    const redirectMap = {
      community: "/user/dashboard",
      volunteer: "/volunteer/dashboard",
      admin: "/admin/dashboard",
      ngo: "/ngo/dashboard",
      gov: "/gov/dashboard",
    };

    const redirectUrl = new URL(
      redirectMap[userRole as keyof typeof redirectMap] || "/user/dashboard",
      req.url
    );
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Middleware auth error:", error);
    // Invalid session, redirect to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api|_next|_static|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
