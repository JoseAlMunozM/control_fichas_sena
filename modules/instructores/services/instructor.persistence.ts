import "server-only";

import type { InstructorEntity } from "../types";

export async function loadInstructores(): Promise<InstructorEntity[]> {
  const { prisma } = await import("@/lib/prisma");
  const instructors = await prisma.instructor.findMany({
    include: {
      contratos: { orderBy: { fechaInicio: "desc" } },
    },
    orderBy: { nombre: "asc" },
  });

  return instructors.map((instructor) => ({
    id: instructor.id,
    nombre: instructor.nombre,
    correo: instructor.correo,
    telefono: instructor.telefono,
    estado: instructor.estado,
    observaciones: instructor.observaciones,
    contratos: instructor.contratos.map((contrato) => ({ ...contrato })),
    createdAt: instructor.createdAt,
    updatedAt: instructor.updatedAt,
  }));
}

export async function saveInstructores(
  instructores: InstructorEntity[],
): Promise<void> {
  const { prisma } = await import("@/lib/prisma");

  await prisma.$transaction(async (transaction) => {
    const ids = instructores.map((instructor) => instructor.id);

    await transaction.instructor.deleteMany({
      where: ids.length > 0 ? { id: { notIn: ids } } : {},
    });

    for (const instructor of instructores) {
      await transaction.instructor.upsert({
        where: { id: instructor.id },
        create: {
          id: instructor.id,
          nombre: instructor.nombre,
          correo: instructor.correo,
          telefono: instructor.telefono,
          estado: instructor.estado,
          observaciones: instructor.observaciones,
          createdAt: instructor.createdAt,
          updatedAt: instructor.updatedAt,
        },
        update: {
          nombre: instructor.nombre,
          correo: instructor.correo,
          telefono: instructor.telefono,
          estado: instructor.estado,
          observaciones: instructor.observaciones,
          updatedAt: instructor.updatedAt,
        },
      });

      const contractIds = instructor.contratos.map(
        (contrato) => contrato.id,
      );

      await transaction.contratoInstructor.deleteMany({
        where: {
          instructorId: instructor.id,
          ...(contractIds.length > 0
            ? { id: { notIn: contractIds } }
            : {}),
        },
      });

      for (const contrato of instructor.contratos) {
        await transaction.contratoInstructor.upsert({
          where: { id: contrato.id },
          create: contrato,
          update: {
            fechaInicio: contrato.fechaInicio,
            fechaFin: contrato.fechaFin,
            updatedAt: contrato.updatedAt,
          },
        });
      }
    }
  });
}
