import NextAuth from "next-auth";

import { DEFAULT_USER_ROLE } from "@/constants";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? DEFAULT_USER_ROLE;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.role = token.role ?? DEFAULT_USER_ROLE;

      return session;
    },
  },
});
