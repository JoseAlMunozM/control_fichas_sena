import type { UserRole } from "@/types";

export interface LoginDto {
  correo: string;
  password: string;
}

export interface SetupDto extends LoginDto {
  nombre: string;
  confirmarPassword: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
