export type InstructorActionErrorCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE_EMAIL"
  | "CONTRACT_OVERLAP"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export interface InstructorActionError {
  code: InstructorActionErrorCode;
  message: string;
  fieldErrors?: Readonly<
    Record<string, readonly string[] | undefined>
  >;
}

export type InstructorActionResult<Value> =
  | { success: true; value: Value }
  | { success: false; error: InstructorActionError };
