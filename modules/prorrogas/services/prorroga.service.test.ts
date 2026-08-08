import { beforeEach, describe, expect, it } from "vitest";

import { fichaService } from "@/modules/fichas/services";
import {
  createTestFicha,
  resetServiceStores,
  TEST_LEADER,
} from "@/tests/helpers/service-fixtures";

import { PRORROGA_ESTADO } from "../constants";
import { prorrogaService } from "./prorroga.service";

describe("ProrrogaService", () => {
  beforeEach(resetServiceStores);

  it("mantiene las fechas de la ficha mientras está pendiente", async () => {
    const ficha = (await createTestFicha()).data;

    const result = await prorrogaService.create(
      {
        fichaId: ficha.id,
        fechaFinLectivaNueva: "2026-10-31",
        fechaFinPracticaNueva: "2027-04-30",
        motivo: "Extensión del calendario académico",
      },
      TEST_LEADER,
    );
    const currentFicha = await fichaService.findById(ficha.id);

    expect(result.data.estado).toBe(PRORROGA_ESTADO.PENDIENTE);
    expect(currentFicha?.data.fechaFinLectiva).toBe("2026-09-30");
    expect(currentFicha?.data.fechaFinPractica).toBe("2027-03-31");
  });

  it("actualiza las fechas al aprobar la prórroga", async () => {
    const ficha = (await createTestFicha()).data;
    const prorroga = (
      await prorrogaService.create(
        {
          fichaId: ficha.id,
          fechaFinLectivaNueva: "2026-10-31",
          fechaFinPracticaNueva: "2027-04-30",
          motivo: "Extensión del calendario académico",
        },
        TEST_LEADER,
      )
    ).data;

    const result = await prorrogaService.resolve(
      prorroga.id,
      {
        estado: PRORROGA_ESTADO.APROBADA,
        observacionRespuesta: "Aprobada por coordinación",
      },
      TEST_LEADER,
    );
    const updatedFicha = await fichaService.findById(ficha.id);

    expect(result.data.estado).toBe(PRORROGA_ESTADO.APROBADA);
    expect(updatedFicha?.data.fechaFinLectiva).toBe("2026-10-31");
    expect(updatedFicha?.data.fechaFinPractica).toBe("2027-04-30");
  });
});
