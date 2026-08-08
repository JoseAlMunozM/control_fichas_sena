import { describe, expect, it } from "vitest";

import {
  createProrrogaSchema,
  resolveProrrogaSchema,
} from "./prorroga.schema";

const validExtension = {
  fichaId: "ef2dc3e4-650a-4a87-996d-99fc6df33086",
  fechaFinLectivaNueva: "2026-10-31",
  fechaFinPracticaNueva: "2027-04-30",
  motivo: "Ampliación requerida para completar el proceso formativo.",
};

describe("validación de prórrogas", () => {
  it("acepta nuevas fechas ordenadas", () => {
    expect(createProrrogaSchema.safeParse(validExtension).success).toBe(true);
  });

  it("rechaza un fin práctico anterior al lectivo", () => {
    const result = createProrrogaSchema.safeParse({
      ...validExtension,
      fechaFinPracticaNueva: "2026-09-30",
    });

    expect(result.success).toBe(false);
  });

  it("solo permite aprobar o rechazar una solicitud", () => {
    expect(
      resolveProrrogaSchema.safeParse({ estado: "PENDIENTE" }).success,
    ).toBe(false);
    expect(
      resolveProrrogaSchema.safeParse({ estado: "APROBADA" }).success,
    ).toBe(true);
  });
});
