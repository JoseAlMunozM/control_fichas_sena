import { beforeEach, describe, expect, it } from "vitest";

import { instructorService } from "@/modules/instructores/services";
import {
  createTestFicha,
  resetServiceStores,
  TEST_LEADER,
} from "@/tests/helpers/service-fixtures";

import { fichaService } from "./ficha.service";

describe("FichaService", () => {
  beforeEach(resetServiceStores);

  it("crea una ficha con las competencias del plan", async () => {
    const result = await createTestFicha();

    expect(result.data.numero).toBe("TEST-001");
    expect(result.data.instructorLiderNombre).toBe(TEST_LEADER.nombre);
    expect(result.data.seguimientos.length).toBeGreaterThan(0);
    expect(
      result.data.seguimientos.every(
        (seguimiento) => seguimiento.estado === "PENDIENTE",
      ),
    ).toBe(true);
  });

  it("rechaza números de ficha duplicados", async () => {
    await createTestFicha("DUPLICADA-001");

    await expect(createTestFicha("DUPLICADA-001")).rejects.toMatchObject({
      code: "DUPLICATE_NUMBER",
    });
  });

  it("programa las horas exactas de una competencia", async () => {
    const ficha = (await createTestFicha()).data;
    const seguimiento = ficha.seguimientos[0];
    const instructor = (
      await instructorService.create({
        nombre: "Instructor Programación",
        correo: "programacion@sena.edu.co",
      })
    ).data;

    const result = await fichaService.createProgramacion(
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

    const updatedFollowup = result.data.seguimientos.find(
      (item) => item.id === seguimiento.id,
    );

    expect(updatedFollowup?.estado).toBe("PROGRAMADA");
    expect(updatedFollowup?.programaciones[0]?.horasProgramadas).toBe(48);
  });
});
