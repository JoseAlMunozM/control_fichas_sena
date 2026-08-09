import "server-only";

import { optionalUuid } from "@/utils";

import type { ProrrogaEntity } from "../types";

export async function loadProrrogas(): Promise<ProrrogaEntity[]> {
  const { prisma } = await import("@/lib/prisma");
  const items = await prisma.prorroga.findMany({
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => ({
    ...item,
    solicitadoPorId: item.solicitadoPorId ?? "",
  }));
}

export async function saveProrrogas(items: ProrrogaEntity[]): Promise<void> {
  const { prisma } = await import("@/lib/prisma");

  await prisma.$transaction(async (transaction) => {
    const ids = items.map((item) => item.id);
    await transaction.prorroga.deleteMany({
      where: ids.length > 0 ? { id: { notIn: ids } } : {},
    });

    for (const item of items) {
      const data = {
        fichaId: item.fichaId,
        fichaNumero: item.fichaNumero,
        programaNombre: item.programaNombre,
        municipio: item.municipio,
        fechaInicio: item.fechaInicio,
        fechaFinLectivaAnterior: item.fechaFinLectivaAnterior,
        fechaFinPracticaAnterior: item.fechaFinPracticaAnterior,
        fechaFinLectivaNueva: item.fechaFinLectivaNueva,
        fechaFinPracticaNueva: item.fechaFinPracticaNueva,
        motivo: item.motivo,
        estado: item.estado,
        observacionRespuesta: item.observacionRespuesta,
        solicitadoPorId: optionalUuid(item.solicitadoPorId),
        solicitadoPorNombre: item.solicitadoPorNombre,
        resueltoPorId: optionalUuid(item.resueltoPorId),
        resueltoPorNombre: item.resueltoPorNombre,
        resolvedAt: item.resolvedAt,
        updatedAt: item.updatedAt,
      };

      await transaction.prorroga.upsert({
        where: { id: item.id },
        create: { id: item.id, ...data, createdAt: item.createdAt },
        update: data,
      });
    }
  });
}
