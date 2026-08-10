import Link from "next/link";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui";
import { AUTH_ROUTES, ROUTE_PATHS } from "@/constants";
import { getCurrentSession } from "@/lib/auth/authorization";
import { authService } from "@/modules/auth/services";

const QUICK_LINKS = [
  {
    href: ROUTE_PATHS.dashboard,
    title: "Control general",
    description:
      "Consulta el avance consolidado de las fichas y sus competencias.",
  },
  {
    href: ROUTE_PATHS.fichas,
    title: "Fichas",
    description:
      "Administra jornadas, programación, novedades y líderes.",
  },
  {
    href: ROUTE_PATHS.programas,
    title: "Programas",
    description:
      "Gestiona programas, planes de formación y competencias.",
  },
  {
    href: ROUTE_PATHS.instructores,
    title: "Instructores",
    description:
      "Mantén actualizados los instructores disponibles para asignaciones.",
  },
  {
    href: ROUTE_PATHS.prorrogas,
    title: "Prórrogas",
    description:
      "Registra solicitudes y conserva el histórico de fechas.",
  },
] as const;

export default async function Home() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect(
      (await authService.hasUsers())
        ? AUTH_ROUTES.signIn
        : AUTH_ROUTES.setup,
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
          Control de fichas SENA
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Gestiona la programación y el seguimiento académico desde un solo
          lugar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {QUICK_LINKS.map((item) => (
          <Card
            key={item.href}
            className="flex h-full flex-col"
            description={item.description}
            title={item.title}
          >
            <Link
              className="inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              href={item.href}
            >
              Ir al módulo →
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
