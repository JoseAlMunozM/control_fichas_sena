export function isRequired(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function hasMinLength(value: string, minimum: number): boolean {
  return value.trim().length >= minimum;
}

export function hasMaxLength(value: string, maximum: number): boolean {
  return value.trim().length <= maximum;
}
