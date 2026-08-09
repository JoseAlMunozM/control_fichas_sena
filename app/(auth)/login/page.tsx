import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/constants";
import { getCurrentSession } from "@/lib/auth/authorization";
import {
  AuthCard,
  LoginForm,
} from "@/modules/auth/components";
import { authService } from "@/modules/auth/services";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session?.user) redirect(AUTH_ROUTES.afterSignIn);
  if (!(await authService.hasUsers())) redirect(AUTH_ROUTES.setup);

  return (
    <AuthCard
      description="Ingresa con el correo institucional del instructor líder."
      title="Iniciar sesión"
    >
      <LoginForm />
    </AuthCard>
  );
}
