export type ProrrogaActionErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "FICHA_NOT_FOUND"
  | "DUPLICATE_PENDING"
  | "INVALID_DATES"
  | "ALREADY_RESOLVED"
  | "INTERNAL_ERROR";

export interface ProrrogaActionError {
  code: ProrrogaActionErrorCode;
  message: string;
  fieldErrors?: Readonly<Record<string, readonly string[] | undefined>>;
}

export type ProrrogaActionResult<Value> =
  | { success: true; value: Value }
  | { success: false; error: ProrrogaActionError };
