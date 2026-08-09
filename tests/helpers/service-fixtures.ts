import { fichaService } from "@/modules/fichas/services";
import { programaService } from "@/modules/programas/services";

export const TEST_LEADER = {
  id: "leader-test",
  nombre: "Líder de prueba",
  correo: "lider.prueba@sena.edu.co",
} as const;

type TestStores = {
  fichaStore?: unknown;
  instructorStore?: unknown;
  programaStore?: unknown;
  prorrogaStore?: unknown;
};

export function resetServiceStores(): void {
  const stores = globalThis as unknown as TestStores;

  delete stores.fichaStore;
  delete stores.instructorStore;
  delete stores.programaStore;
  delete stores.prorrogaStore;
}

export async function createTestFicha(numero = "TEST-001") {
  const programas = await programaService.findAll({ pageSize: 50 });
  const programa = programas.data[0];
  const plan = programa?.planes.find((item) => item.estado);

  if (!programa || !plan) {
    throw new Error("No existe un programa activo para las pruebas.");
  }

  return fichaService.create(
    {
      numero,
      programaId: programa.id,
      planId: plan.id,
      municipio: "Popayán",
      sede: "Centro de prueba",
      modalidad: "Presencial",
      jornadas: [
        { dia: "LUNES", horaInicio: "07:00", horaFin: "13:00" },
        { dia: "MARTES", horaInicio: "07:00", horaFin: "13:00" },
        { dia: "MIERCOLES", horaInicio: "07:00", horaFin: "13:00" },
        { dia: "JUEVES", horaInicio: "07:00", horaFin: "13:00" },
        { dia: "VIERNES", horaInicio: "07:00", horaFin: "13:00" },
      ],
      fechaInicio: "2026-01-05",
      fechaFinLectiva: "2026-09-30",
      fechaFinPractica: "2027-03-31",
      observaciones: null,
    },
    TEST_LEADER,
  );
}
