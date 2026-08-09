import "server-only";

import type { ProgramaEntity } from "../types";

const includeProgram = {
  planes: {
    include: { competencias: { orderBy: { orden: "asc" as const } } },
    orderBy: { createdAt: "asc" as const },
  },
};

export async function loadProgramas(): Promise<ProgramaEntity[]> {
  const { prisma } = await import("@/lib/prisma");

  return prisma.programa.findMany({ include: includeProgram }).then((items) =>
    items.map((programa) => ({
      ...programa,
      planes: programa.planes.map((plan) => ({
        ...plan,
        competencias: plan.competencias.map((competencia) => ({
          id: competencia.id,
          norma: competencia.norma,
          nombre: competencia.nombre,
          tipo: competencia.tipo,
          horas: competencia.horas,
          orden: competencia.orden,
        })),
      })),
    })),
  );
}

export async function saveProgramas(programas: ProgramaEntity[]): Promise<void> {
  const { prisma } = await import("@/lib/prisma");

  await prisma.$transaction(async (transaction) => {
    const programaIds = programas.map((programa) => programa.id);

    await transaction.programa.deleteMany({
      where: programaIds.length > 0 ? { id: { notIn: programaIds } } : {},
    });

    for (const programa of programas) {
      await transaction.programa.upsert({
        where: { id: programa.id },
        create: {
          id: programa.id,
          codigo: programa.codigo,
          nombre: programa.nombre,
          descripcion: programa.descripcion,
          estado: programa.estado,
          createdAt: programa.createdAt,
          updatedAt: programa.updatedAt,
        },
        update: {
          codigo: programa.codigo,
          nombre: programa.nombre,
          descripcion: programa.descripcion,
          estado: programa.estado,
          updatedAt: programa.updatedAt,
        },
      });

      const planIds = programa.planes.map((plan) => plan.id);
      await transaction.planFormacion.deleteMany({
        where: {
          programaId: programa.id,
          ...(planIds.length > 0 ? { id: { notIn: planIds } } : {}),
        },
      });

      for (const plan of programa.planes) {
        await transaction.planFormacion.upsert({
          where: { id: plan.id },
          create: {
            id: plan.id,
            programaId: programa.id,
            version: plan.version,
            estado: plan.estado,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
          },
          update: {
            version: plan.version,
            estado: plan.estado,
            updatedAt: plan.updatedAt,
          },
        });

        const competenciaIds = plan.competencias.map((item) => item.id);
        await transaction.planCompetencia.deleteMany({
          where: {
            planId: plan.id,
            ...(competenciaIds.length > 0
              ? { id: { notIn: competenciaIds } }
              : {}),
          },
        });

        for (const competencia of plan.competencias) {
          await transaction.planCompetencia.upsert({
            where: { id: competencia.id },
            create: { ...competencia, planId: plan.id },
            update: {
              norma: competencia.norma,
              nombre: competencia.nombre,
              tipo: competencia.tipo,
              horas: competencia.horas,
              orden: competencia.orden,
            },
          });
        }
      }
    }
  });
}
