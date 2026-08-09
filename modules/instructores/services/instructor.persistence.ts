import "server-only";

import type { InstructorEntity } from "../types";

export async function loadInstructores(): Promise<InstructorEntity[]> {
  const { prisma } = await import("@/lib/prisma");

  return prisma.instructor.findMany({ orderBy: { nombre: "asc" } });
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
        create: instructor,
        update: {
          nombre: instructor.nombre,
          correo: instructor.correo,
          telefono: instructor.telefono,
          estado: instructor.estado,
          observaciones: instructor.observaciones,
          updatedAt: instructor.updatedAt,
        },
      });
    }
  });
}
