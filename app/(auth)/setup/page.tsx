import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/constants";
import { getCurrentSession } from "@/lib/auth/authorization";
import {
  AuthCard,
  SetupForm,
} from "@/modules/auth/components";
import { authService } from "@/modules/auth/services";

export const metadata: Metadata = {
  title: "Configuración inicial",
};

export default async function SetupPage() {
  const session = await getCurrentSession();

  if (session?.user) redirect(AUTH_ROUTES.afterSignIn);
  if (await authService.hasUsers()) redirect(AUTH_ROUTES.signIn);

  return (
    <AuthCard
      description="Crea la primera cuenta del instructor líder. No se cargarán datos de ejemplo."
      title="Configuración inicial"
    >
      <SetupForm />
    </AuthCard>
  );
}
