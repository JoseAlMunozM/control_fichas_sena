import { describe, expect, it } from "vitest";

import { setupSchema } from "./auth.schema";

describe("auth schemas", () => {
  it("normaliza el correo y exige contraseñas iguales", () => {
    const valid = setupSchema.parse({
      nombre: "Jose Muñoz",
      correo: "  JOSE@SENA.EDU.CO ",
      password: "ControlSena2026",
      confirmarPassword: "ControlSena2026",
    });
    const invalid = setupSchema.safeParse({
      ...valid,
      confirmarPassword: "OtraClave2026",
    });

    expect(valid.correo).toBe("jose@sena.edu.co");
    expect(invalid.success).toBe(false);
  });
});
