import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";

describe("password utilities", () => {
  it("verifica la contraseña correcta y rechaza otra", async () => {
    const hash = await hashPassword("ControlSena2026");

    await expect(verifyPassword("ControlSena2026", hash)).resolves.toBe(true);
    await expect(verifyPassword("ContraseñaIncorrecta1", hash)).resolves.toBe(
      false,
    );
  });
});
