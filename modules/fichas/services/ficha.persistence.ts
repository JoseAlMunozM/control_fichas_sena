import "server-only";

import { optionalUuid } from "@/utils";

import type { FichaEntity } from "../types";

const fichaInclude = {
  programa: true,
  plan: true,
  instructorLider: true,
  jornadas: true,
  liderHistorial: { orderBy: { fechaInicio: "asc" as const } },
  seguimientos: {
    orderBy: { orden: "asc" as const },
    include: {
      programaciones: { include: { bloques: true } },
      novedades: { orderBy: { fecha: "desc" as const } },
    },
  },
};

export async function loadFichas(): Promise<FichaEntity[]> {
  const { prisma } = await import("@/lib/prisma");
  const fichas = await prisma.ficha.findMany({ include: fichaInclude });

  return fichas.map((ficha) => ({
    id: ficha.id,
    numero: ficha.numero,
    programaId: ficha.programaId,
    programaCodigo: ficha.programa.codigo,
    programaNombre: ficha.programa.nombre,
    planId: ficha.planId,
    planVersion: ficha.plan.version,
    municipio: ficha.municipio,
    sede: ficha.sede,
    modalidad: ficha.modalidad,
    jornadas: ficha.jornadas.map(({ dia, horaInicio, horaFin }) => ({
      dia,
      horaInicio,
      horaFin,
    })),
    fechaInicio: ficha.fechaInicio,
    fechaFinLectiva: ficha.fechaFinLectiva,
    fechaFinPractica: ficha.fechaFinPractica,
    estado: ficha.estado,
    instructorLiderId: ficha.instructorLiderId,
    instructorLiderNombre: ficha.instructorLider.nombre,
    observaciones: ficha.observaciones,
    liderHistorial: ficha.liderHistorial.map((item) => ({
      id: item.id,
      instructorId: item.instructorId,
      instructorNombre: item.instructorNombre,
      instructorCorreo: item.instructorCorreo,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      motivo: item.motivo,
      asignadoPorId: item.asignadoPorId ?? "",
      asignadoPorNombre: item.asignadoPorNombre,
      createdAt: item.createdAt,
    })),
    seguimientos: ficha.seguimientos.map((seguimiento) => ({
      id: seguimiento.id,
      competenciaId: seguimiento.competenciaId ?? seguimiento.id,
      competenciaNombre: seguimiento.competenciaNombre,
      competenciaNorma: seguimiento.competenciaNorma,
      competenciaTipo: seguimiento.competenciaTipo,
      horasPlan: seguimiento.horasPlan,
      orden: seguimiento.orden,
      estado: seguimiento.estado,
      programaciones: seguimiento.programaciones.map((item) => ({
        id: item.id,
        instructorId: item.instructorId,
        instructorNombre: item.instructorNombre,
        instructorCorreo: item.instructorCorreo,
        fechaInicio: item.fechaInicio,
        fechaFin: item.fechaFin,
        bloques: item.bloques.map((bloque) => ({
          id: bloque.id,
          dia: bloque.dia,
          horaInicio: bloque.horaInicio,
          horaFin: bloque.horaFin,
        })),
        horasProgramadas: item.horasProgramadas,
        registradoPorId: item.registradoPorId ?? "",
        registradoPorNombre: item.registradoPorNombre,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      novedades: seguimiento.novedades.map((item) => ({
        id: item.id,
        fecha: item.fecha,
        tipo: item.tipo,
        descripcion: item.descripcion,
        registradoPorId: item.registradoPorId ?? "",
        registradoPorNombre: item.registradoPorNombre,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    })),
    createdAt: ficha.createdAt,
    updatedAt: ficha.updatedAt,
  }));
}

export async function saveFichas(fichas: FichaEntity[]): Promise<void> {
  const { prisma } = await import("@/lib/prisma");

  await prisma.$transaction(async (transaction) => {
    const ids = fichas.map((ficha) => ficha.id);
    await transaction.ficha.deleteMany({
      where: ids.length > 0 ? { id: { notIn: ids } } : {},
    });

    for (const ficha of fichas) {
      const data = {
        numero: ficha.numero,
        programaId: ficha.programaId,
        planId: ficha.planId,
        municipio: ficha.municipio,
        sede: ficha.sede,
        modalidad: ficha.modalidad,
        fechaInicio: ficha.fechaInicio,
        fechaFinLectiva: ficha.fechaFinLectiva,
        fechaFinPractica: ficha.fechaFinPractica,
        estado: ficha.estado,
        instructorLiderId: ficha.instructorLiderId,
        observaciones: ficha.observaciones,
        updatedAt: ficha.updatedAt,
      };

      await transaction.ficha.upsert({
        where: { id: ficha.id },
        create: { id: ficha.id, ...data, createdAt: ficha.createdAt },
        update: data,
      });
      await transaction.fichaJornada.deleteMany({ where: { fichaId: ficha.id } });
      await transaction.fichaLiderAsignacion.deleteMany({ where: { fichaId: ficha.id } });
      await transaction.fichaSeguimiento.deleteMany({ where: { fichaId: ficha.id } });

      await transaction.fichaJornada.createMany({
        data: ficha.jornadas.map((item) => ({ ...item, fichaId: ficha.id })),
      });

      for (const item of ficha.liderHistorial) {
        await transaction.fichaLiderAsignacion.create({
          data: {
            id: item.id,
            fichaId: ficha.id,
            instructorId: item.instructorId,
            instructorNombre: item.instructorNombre,
            instructorCorreo: item.instructorCorreo,
            fechaInicio: item.fechaInicio,
            fechaFin: item.fechaFin,
            motivo: item.motivo,
            asignadoPorId: optionalUuid(item.asignadoPorId),
            asignadoPorNombre: item.asignadoPorNombre,
            createdAt: item.createdAt,
          },
        });
      }

      for (const seguimiento of ficha.seguimientos) {
        await transaction.fichaSeguimiento.create({
          data: {
            id: seguimiento.id,
            fichaId: ficha.id,
            competenciaId: seguimiento.competenciaId,
            competenciaNombre: seguimiento.competenciaNombre,
            competenciaNorma: seguimiento.competenciaNorma,
            competenciaTipo: seguimiento.competenciaTipo,
            horasPlan: seguimiento.horasPlan,
            orden: seguimiento.orden,
            estado: seguimiento.estado,
            programaciones: {
              create: seguimiento.programaciones.map((item) => ({
                id: item.id,
                instructorId: item.instructorId,
                instructorNombre: item.instructorNombre,
                instructorCorreo: item.instructorCorreo,
                fechaInicio: item.fechaInicio,
                fechaFin: item.fechaFin,
                horasProgramadas: item.horasProgramadas,
                registradoPorId: optionalUuid(item.registradoPorId),
                registradoPorNombre: item.registradoPorNombre,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                bloques: { create: item.bloques.map(({ id, ...block }) => ({ id, ...block })) },
              })),
            },
            novedades: {
              create: seguimiento.novedades.map((item) => ({
                id: item.id,
                fecha: item.fecha,
                tipo: item.tipo,
                descripcion: item.descripcion,
                registradoPorId: optionalUuid(item.registradoPorId),
                registradoPorNombre: item.registradoPorNombre,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              })),
            },
          },
        });
      }
    }
  });
}
