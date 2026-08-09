import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AUTH_ROUTES, DEFAULT_USER_ROLE } from "@/constants";
import { loginSchema } from "@/modules/auth/validators";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: AUTH_ROUTES.signIn,
  },
  providers: [
    Credentials({
      credentials: {
        correo: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse({
          correo: credentials.correo,
          password: credentials.password,
        });

        if (!result.success) return null;

        const { authService } = await import("@/modules/auth/services");

        return authService.authenticate(result.data);
      },
    }),
  ],
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
        token.name = user.name;
        token.email = user.email;
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
