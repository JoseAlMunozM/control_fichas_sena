import Link from "next/link";

import { Card } from "@/components/ui";

const QUICK_LINKS = [
  {
    href: "/dashboard",
    title: "Control general",
    description:
      "Consulta el avance consolidado de las fichas y sus competencias.",
  },
  {
    href: "/fichas",
    title: "Fichas",
    description:
      "Administra jornadas, programación, novedades y líderes.",
  },
  {
    href: "/programas",
    title: "Programas",
    description:
      "Gestiona programas, planes de formación y competencias.",
  },
  {
    href: "/prorrogas",
    title: "Prórrogas",
    description:
      "Registra solicitudes y conserva el histórico de fechas.",
  },
] as const;

export default function Home() {
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
