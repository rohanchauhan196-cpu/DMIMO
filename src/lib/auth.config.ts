import type { NextAuthConfig } from "next-auth";

// Edge-safe Auth.js settings shared by the middleware and the full auth setup.
// Keep database and bcrypt imports out of this file: the middleware bundle must
// stay small (Vercel Hobby caps Edge Functions at 1 MB).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
