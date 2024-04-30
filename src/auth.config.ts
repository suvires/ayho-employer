import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnApp =
        nextUrl.pathname.startsWith("/offers") ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/create-company") ||
        nextUrl.pathname.startsWith("/edit-company") ||
        nextUrl.pathname.startsWith("/create-offer") ||
        nextUrl.pathname.startsWith("/edit-offer");
      if (isOnApp) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to Sign in page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/offers", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
