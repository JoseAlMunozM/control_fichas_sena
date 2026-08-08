import { describe, expect, it } from "vitest";

import { createProgramacionSchema } from "./programacion.schema";

const validProgramming = {
  instructorId: "9f941af0-67df-41f2-999a-3727d9342cb5",
  fechaInicio: "2026-01-05",
  fechaFin: "2026-01-26",
  bloques: [
    { dia: "LUNES" as const, horaInicio: "07:00", horaFin: "13:00" },
  ],
};

describe("validación de programación", () => {
  it("acepta una programación válida", () => {
    expect(createProgramacionSchema.safeParse(validProgramming).success).toBe(
      true,
    );
  });

  it("rechaza una hora final anterior a la inicial", () => {
    const result = createProgramacionSchema.safeParse({
      ...validProgramming,
      bloques: [
        { dia: "LUNES", horaInicio: "13:00", horaFin: "07:00" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rechaza un rango de fechas invertido", () => {
    const result = createProgramacionSchema.safeParse({
      ...validProgramming,
      fechaInicio: "2026-02-01",
      fechaFin: "2026-01-01",
    });

    expect(result.success).toBe(false);
  });
});
