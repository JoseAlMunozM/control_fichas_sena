export const AUTH_FIELD_LIMITS = {
  nombre: 150,
  correo: 254,
  password: 128,
} as const;

export const AUTH_PASSWORD_MIN_LENGTH = 10;

export const AUTH_MESSAGES = {
  invalidCredentials: "El correo o la contraseña no son correctos.",
  setupCompleted: "La configuración inicial ya fue completada.",
  genericError: "No fue posible completar la operación.",
} as const;
