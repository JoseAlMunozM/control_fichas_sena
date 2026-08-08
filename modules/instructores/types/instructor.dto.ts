import type { InstructorEntity } from "./instructor.entity";

export type InstructorDto = Omit<
  InstructorEntity,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};
