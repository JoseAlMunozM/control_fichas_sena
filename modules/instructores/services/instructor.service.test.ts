import { beforeEach, describe, expect, it } from "vitest";

import { resetServiceStores } from "@/tests/helpers/service-fixtures";

import { instructorService } from "./instructor.service";

describe("InstructorService", () => {
  beforeEach(resetServiceStores);

  it("crea y normaliza un instructor", async () => {
    const result = await instructorService.create({
      nombre: "  Ana Instructor  ",
      correo: "ANA.INSTRUCTOR@SENA.EDU.CO",
      telefono: " 3001234567 ",
      observaciones: "  Disponible  ",
    });

    expect(result.data).toMatchObject({
      nombre: "Ana Instructor",
      correo: "ana.instructor@sena.edu.co",
      telefono: "3001234567",
      estado: true,
      observaciones: "Disponible",
    });
  });

  it("rechaza correos institucionales duplicados", async () => {
    const input = {
      nombre: "Carlos Instructor",
      correo: "carlos@sena.edu.co",
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
});
