import { beforeEach, describe, expect, it } from "vitest";

import {
  NOVEDAD_COMPETENCIA_TIPO,
} from "@/modules/fichas/constants";
import { fichaService } from "@/modules/fichas/services";
import { instructorService } from "@/modules/instructores/services";
import { PRORROGA_ESTADO } from "@/modules/prorrogas/constants";
import { prorrogaService } from "@/modules/prorrogas/services";
import {
  createTestFicha,
  resetServiceStores,
  TEST_ACTIVE_CONTRACT,
  TEST_LEADER,
} from "@/tests/helpers/service-fixtures";

import { dashboardService } from "./dashboard.service";

describe("DashboardService", () => {
  beforeEach(resetServiceStores);

  it("devuelve una vista vacía cuando no existen fichas", async () => {
    const result = await dashboardService.getGeneralControl();

    expect(result.fichas).toEqual([]);
  });

  it("consolida horas, novedades y prórrogas de una ficha", async () => {
    const ficha = (await createTestFicha("DASH-001")).data;
    const seguimiento = ficha.seguimientos[0];
    const instructor = (
      await instructorService.create({
        nombre: "Instructor Dashboard",
        correo: "dashboard@sena.edu.co",
        ...TEST_ACTIVE_CONTRACT,
      })
    ).data;

    await fichaService.createProgramacion(
      ficha.id,
      seguimiento.id,
      {
        instructorId: instructor.id,
        fechaInicio: "2026-01-05",
        fechaFin: "2026-02-23",
        bloques: [
          {
            dia: "LUNES",
            horaInicio: "07:00",
            horaFin: "13:00",
          },
        ],
      },
      TEST_LEADER,
    );
    await fichaService.createNovedad(
      ficha.id,
      seguimiento.id,
      {
        fecha: "2026-02-02",
        tipo: NOVEDAD_COMPETENCIA_TIPO.OBSERVACION,
        descripcion: "Observación registrada para el tablero",
      },
      TEST_LEADER,
    );
    await prorrogaService.create(
      {
        fichaId: ficha.id,
        fechaFinLectivaNueva: "2026-10-31",
        fechaFinPracticaNueva: "2027-04-30",
        motivo: "Extensión visible en el control general",
      },
      TEST_LEADER,
    );

    const result = await dashboardService.getGeneralControl();
    const dashboardFicha = result.fichas[0];
    const dashboardFollowup = dashboardFicha?.competencias.find(
      (item) => item.nombre === seguimiento.competenciaNombre,
    );

    expect(dashboardFicha).toMatchObject({
      numero: "DASH-001",
      totalNovedades: 1,
      prorroga: {
        estado: PRORROGA_ESTADO.PENDIENTE,
        fechaFinLectivaNueva: "2026-10-31",
        fechaFinPracticaNueva: "2027-04-30",
      },
    });
    expect(dashboardFollowup).toMatchObject({
      horasPlan: 48,
      horasProgramadas: 48,
      horasPendientes: 0,
      novedades: 1,
    });
    expect(dashboardFollowup?.programaciones[0]?.instructorNombre).toBe(
      "Instructor Dashboard",
    );
  });
});
