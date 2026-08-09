import { z } from "zod";

import {
  AUTH_FIELD_LIMITS,
  AUTH_PASSWORD_MIN_LENGTH,
} from "../constants";
import type { LoginDto, SetupDto } from "../types";

const correoSchema = z
  .string()
  .trim()
  .max(AUTH_FIELD_LIMITS.correo)
  .pipe(z.email("Ingresa un correo válido."))
  .transform((value) => value.toLocaleLowerCase("es"));

const passwordSchema = z
  .string()
  .min(
    AUTH_PASSWORD_MIN_LENGTH,
    `La contraseña debe tener al menos ${AUTH_PASSWORD_MIN_LENGTH} caracteres.`,
  )
  .max(AUTH_FIELD_LIMITS.password)
  .regex(/[a-z]/, "La contraseña debe incluir una letra minúscula.")
  .regex(/[A-Z]/, "La contraseña debe incluir una letra mayúscula.")
  .regex(/[0-9]/, "La contraseña debe incluir un número.");

export const loginSchema = z
  .object({
    correo: correoSchema,
    password: z.string().min(1, "Ingresa tu contraseña."),
  })
  .strict() satisfies z.ZodType<LoginDto>;

export const setupSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres.")
      .max(AUTH_FIELD_LIMITS.nombre),
    correo: correoSchema,
    password: passwordSchema,
    confirmarPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarPassword"],
  }) satisfies z.ZodType<SetupDto>;
