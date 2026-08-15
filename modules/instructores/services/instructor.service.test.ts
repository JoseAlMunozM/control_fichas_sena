import { beforeEach, describe, expect, it } from "vitest";

import {
  resetServiceStores,
  TEST_ACTIVE_CONTRACT,
} from "@/tests/helpers/service-fixtures";

import { instructorService } from "./instructor.service";

describe("InstructorService", () => {
  beforeEach(resetServiceStores);

  it("crea y normaliza un instructor", async () => {
    const result = await instructorService.create({
      nombre: "  Ana Instructor  ",
      correo: "ANA.INSTRUCTOR@SENA.EDU.CO",
      telefono: " 3001234567 ",
      observaciones: "  Disponible  ",
      ...TEST_ACTIVE_CONTRACT,
    });

    expect(result.data).toMatchObject({
      nombre: "Ana Instructor",
      correo: "ana.instructor@sena.edu.co",
      telefono: "3001234567",
      estado: true,
      observaciones: "Disponible",
    });
    expect(result.data.contratos).toHaveLength(1);
  });

  it("rechaza correos institucionales duplicados", async () => {
    const input = {
      nombre: "Carlos Instructor",
      correo: "carlos@sena.edu.co",
      ...TEST_ACTIVE_CONTRACT,
    };

    await instructorService.create(input);

    await expect(
      instructorService.create({
        ...input,
        nombre: "Otro Instructor",
        correo: "CARLOS@SENA.EDU.CO",
      }),
    ).rejects.toMatchObject({ code: "DUPLICATE_EMAIL" });
  });

  it("crea inactivo un instructor cuyo contrato ya finalizó", async () => {
    const result = await instructorService.create({
      nombre: "Instructor sin vigencia",
      correo: "sin.vigencia@sena.edu.co",
      fechaInicioContrato: "2020-01-01",
      fechaFinContrato: "2020-12-31",
    });

    expect(result.data.estado).toBe(false);
    expect(result.data.contratos).toHaveLength(1);
  });

  it("registra renovaciones y rechaza contratos superpuestos", async () => {
    const instructor = (
      await instructorService.create({
        nombre: "Instructor renovado",
        correo: "renovado@sena.edu.co",
        ...TEST_ACTIVE_CONTRACT,
      })
    ).data;

    const renewed = await instructorService.addContract(instructor.id, {
      fechaInicio: "2100-01-01",
      fechaFin: "2100-12-31",
    });

    expect(renewed.data.contratos).toHaveLength(2);
    expect(renewed.data.estado).toBe(true);
    await expect(
      instructorService.addContract(instructor.id, {
        fechaInicio: "2099-12-31",
        fechaFin: "2100-06-30",
      }),
    ).rejects.toMatchObject({ code: "CONTRACT_OVERLAP" });
  });

  it("inactiva contratos vencidos durante la sincronización", async () => {
    await instructorService.create({
      nombre: "Instructor por vencer",
      correo: "por.vencer@sena.edu.co",
      ...TEST_ACTIVE_CONTRACT,
    });

    const updated = await instructorService.synchronizeContractStatuses(
      new Date("2101-01-01T12:00:00.000Z"),
    );

    expect(updated).toBe(1);
  });
});
