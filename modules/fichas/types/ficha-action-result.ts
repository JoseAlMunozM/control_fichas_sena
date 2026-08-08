export type FichaActionErrorCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE_NUMBER"
  | "PROGRAM_NOT_FOUND"
  | "PLAN_NOT_FOUND"
  | "INSTRUCTOR_NOT_FOUND"
  | "INVALID_LEADER_CHANGE"
  | "FOLLOWUP_NOT_FOUND"
  | "PROGRAMMING_NOT_FOUND"
  | "INVALID_SCHEDULE"
  | "SCHEDULE_CONFLICT"
  | "HOURS_EXCEEDED"
  | "ACTIVITY_NOT_FOUND"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export interface FichaActionError {
  code: FichaActionErrorCode;
  message: string;
  fieldErrors?: Readonly<
    Record<string, readonly string[] | undefined>
  >;
}

export type FichaActionResult<Value> =
  | { success: true; value: Value }
  | { success: false; error: FichaActionError };
