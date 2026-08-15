import type { ContratoInstructorEntity } from "./contrato-instructor.entity";

export interface InstructorEntity {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  estado: boolean;
  observaciones: string | null;
  contratos: ContratoInstructorEntity[];
  createdAt: Date;
  updatedAt: Date;
}
