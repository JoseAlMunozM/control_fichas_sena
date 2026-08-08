import { beforeEach, describe, expect, it } from "vitest";

import { resetServiceStores } from "@/tests/helpers/service-fixtures";

import { COMPETENCIA_TIPO } from "../constants";
import { programaService } from "./programa.service";

describe("ProgramaService", () => {
  beforeEach(resetServiceStores);

  it("busca programas dentro de los datos iniciales", async () => {
    const result = await programaService.search("Teleinformáticos");

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.codigo).toBe("233108");
  });

  it("rechaza códigos de programa duplicados", async () => {
    await expect(
      programaService.create({
        codigo: "233101",
        nombre: "Programa duplicado",
      }),
    ).rejects.toMatchObject({ code: "DUPLICATE_CODE" });
  });

  it("crea un programa con su plan y competencia", async () => {
    const programa = (
      await programaService.create({
        codigo: "999001",
        nombre: "Programa de prueba",
        descripcion: "Programa creado desde una prueba unitaria",
      })
    ).data;
    const withPlan = (
      await programaService.createPlan(programa.id, {
        version: "V1",
      })
    ).data;
    const plan = withPlan.planes[0];

    const result = await programaService.addCompetencia(
      programa.id,
      plan.id,
      {
        norma: "Norma técnica de prueba",
        nombre: "Competencia de prueba",
        tipo: COMPETENCIA_TIPO.TECNICA,
        horas: 96,
      },
    );
    const createdPlan = result.data.planes[0];

    expect(createdPlan.estado).toBe(true);
    expect(createdPlan.totalHoras).toBe(96);
    expect(createdPlan.competencias[0]).toMatchObject({
      nombre: "Competencia de prueba",
      horas: 96,
      orden: 1,
    });
  });
});
