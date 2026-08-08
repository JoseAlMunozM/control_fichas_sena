import type { ProgramaErrorCode } from "./programa-error";

export type ProgramaActionErrorCode =
  | ProgramaErrorCode
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface ProgramaActionError {
  code: ProgramaActionErrorCode;
  message: string;
  fieldErrors?: Readonly<
    Record<string, readonly string[] | undefined>
  >;
}

export type ProgramaActionResult<Value> =
  | {
      success: true;
      value: Value;
    }
  | {
      success: false;
      error: ProgramaActionError;
    };
