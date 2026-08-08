import { z } from "zod";

import { FICHA_LEADER_LIMITS } from "../constants";
import type { ChangeFichaLeaderDto } from "../types";

export const changeFichaLeaderSchema = z
  .object({
    instructorId: z.uuid("Selecciona un instructor válido."),
    fechaInicio: z.iso.date("La fecha efectiva no es válida."),
    motivo: z
      .string()
      .trim()
      .min(3, "El motivo debe tener al menos 3 caracteres.")
      .max(FICHA_LEADER_LIMITS.motivo),
  })
  .strict() satisfies z.ZodType<ChangeFichaLeaderDto>;
