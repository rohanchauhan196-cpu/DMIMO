import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Uses the edge-safe config only, so Prisma and bcrypt stay out of the middleware bundle.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage;

  if (isAdminRoute && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
