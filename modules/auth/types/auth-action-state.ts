import type { SetupDto } from "./auth.dto";

export interface AuthActionState {
  message?: string;
  fieldErrors?: Partial<Record<keyof SetupDto, string[]>>;
}

export type AuthFormAction = (
  state: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;
