import { describe, expect, it } from "vitest";

import {
  calculateBlockHours,
  calculateProgrammedHours,
  schedulesOverlap,
} from "./programacion";

describe("utilidades de programación", () => {
  it("calcula las horas recurrentes de un bloque", () => {
    const hours = calculateBlockHours("2026-01-05", "2026-01-26", {
      dia: "LUNES",
      horaInicio: "07:00",
      horaFin: "13:00",
    });

    expect(hours).toBe(24);
  });

  it("suma varios bloques semanales", () => {
    const hours = calculateProgrammedHours(
      "2026-01-05",
      "2026-01-14",
      [
        { dia: "LUNES", horaInicio: "07:00", horaFin: "10:00" },
        { dia: "MIERCOLES", horaInicio: "07:00", horaFin: "10:00" },
      ],
    );

    expect(hours).toBe(12);
  });

  it("detecta bloques que se cruzan", () => {
    const overlaps = schedulesOverlap(
      "2026-01-05",
      "2026-01-26",
      { dia: "LUNES", horaInicio: "07:00", horaFin: "10:00" },
      "2026-01-12",
      "2026-02-02",
      { dia: "LUNES", horaInicio: "09:00", horaFin: "12:00" },
    );

    expect(overlaps).toBe(true);
  });

  it("permite bloques consecutivos sin cruce", () => {
    const overlaps = schedulesOverlap(
      "2026-01-05",
      "2026-01-26",
      { dia: "LUNES", horaInicio: "07:00", horaFin: "09:00" },
      "2026-01-05",
      "2026-01-26",
      { dia: "LUNES", horaInicio: "09:00", horaFin: "13:00" },
    );

    expect(overlaps).toBe(false);
  });
});
