import type { InstructorEntity } from "./instructor.entity";
import type { ContratoInstructorDto } from "./contrato-instructor.dto";

export type InstructorDto = Omit<
  InstructorEntity,
  "contratos" | "createdAt" | "updatedAt"
> & {
  contratos: readonly ContratoInstructorDto[];
  createdAt: string;
  updatedAt: string;
};
