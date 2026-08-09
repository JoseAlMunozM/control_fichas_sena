import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/constants";
import { getCurrentSession } from "@/lib/auth/authorization";
import { authService } from "@/modules/auth/services";

export default async function Home() {
  const session = await getCurrentSession();

  if (session?.user) {
    redirect(AUTH_ROUTES.afterSignIn);
  }

  redirect(
    (await authService.hasUsers())
      ? AUTH_ROUTES.signIn
      : AUTH_ROUTES.setup,
  );
}
