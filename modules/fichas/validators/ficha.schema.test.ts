import { describe, expect, it } from "vitest";

import { createFichaSchema } from "./ficha.schema";

const validFicha = {
  numero: "TEST-100",
  programaId: "550e8400-e29b-41d4-a716-446655440000",
  planId: "550e8400-e29b-41d4-a716-446655440001",
  municipio: "Popayán",
  sede: "Centro",
  modalidad: "Presencial",
  jornadas: [
    { dia: "MIERCOLES" as const, horaInicio: "13:00", horaFin: "21:00" },
    { dia: "SABADO" as const, horaInicio: "07:00", horaFin: "13:00" },
  ],
  fechaInicio: "2026-01-05",
  fechaFinLectiva: "2026-09-30",
  fechaFinPractica: "2027-03-31",
  observaciones: null,
};

describe("createFichaSchema", () => {
  it("acepta horarios diferentes según el día", () => {
    expect(createFichaSchema.safeParse(validFicha).success).toBe(true);
  });

  it("rechaza jornadas con días duplicados", () => {
    const result = createFichaSchema.safeParse({
      ...validFicha,
      jornadas: [
        ...validFicha.jornadas,
        { dia: "SABADO", horaInicio: "14:00", horaFin: "18:00" },
      ],
    });

    expect(result.success).toBe(false);
  });
});
