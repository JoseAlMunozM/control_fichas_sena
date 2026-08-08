export const PROGRAMA_FIELD_LIMITS = {
  codigo: {
    min: 1,
    max: 30,
  },
  nombre: {
    min: 3,
    max: 150,
  },
  descripcion: {
    max: 500,
  },
} as const;

export const PROGRAMA_VALIDATION_MESSAGES = {
  codigo: {
    invalidType: "El código debe ser un texto.",
    required: "El código es obligatorio.",
    maxLength: `El código no puede superar los ${PROGRAMA_FIELD_LIMITS.codigo.max} caracteres.`,
  },
  nombre: {
    invalidType: "El nombre debe ser un texto.",
    required: "El nombre es obligatorio.",
    minLength: `El nombre debe tener al menos ${PROGRAMA_FIELD_LIMITS.nombre.min} caracteres.`,
    maxLength: `El nombre no puede superar los ${PROGRAMA_FIELD_LIMITS.nombre.max} caracteres.`,
  },
  descripcion: {
    invalidType: "La descripción debe ser un texto.",
    maxLength: `La descripción no puede superar los ${PROGRAMA_FIELD_LIMITS.descripcion.max} caracteres.`,
  },
  estado: {
    invalidType: "El estado debe ser verdadero o falso.",
  },
} as const;

export const PROGRAMA_QUERY_VALIDATION_MESSAGES = {
  id: {
    invalid: "El identificador del programa no es válido.",
  },
  search: {
    invalidType: "La búsqueda debe ser un texto.",
    required: "El término de búsqueda es obligatorio.",
    maxLength: `La búsqueda no puede superar los ${PROGRAMA_FIELD_LIMITS.nombre.max} caracteres.`,
  },
  page: {
    invalidType: "La página debe ser un número.",
    invalid: "La página debe ser un entero mayor que cero.",
  },
  pageSize: {
    invalidType: "El tamaño de página debe ser un número.",
    invalid: "El tamaño de página debe ser un entero mayor que cero.",
    maximum: "El tamaño de página supera el máximo permitido.",
  },
} as const;
