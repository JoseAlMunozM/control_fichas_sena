import "server-only";

import { randomUUID } from "node:crypto";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/constants";

import type {
  CreateInstructorDto,
  InstructorActionErrorCode,
  InstructorDto,
  InstructorEntity,
  InstructorFilters,
  InstructorResponse,
  InstructoresResponse,
  UpdateInstructorDto,
} from "../types";
import {
  createInstructorSchema,
  updateInstructorSchema,
} from "../validators";

const globalForInstructorStore = globalThis as unknown as {
  instructorStore?: InstructorEntity[];
};

function getInstructorStore(): InstructorEntity[] {
  globalForInstructorStore.instructorStore ??= [];

  return globalForInstructorStore.instructorStore;
}

export class InstructorServiceError extends Error {
  constructor(
    public readonly code: Exclude<
      InstructorActionErrorCode,
      "VALIDATION_ERROR" | "INTERNAL_ERROR"
    >,
    message: string,
  ) {
    super(message);
    this.name = "InstructorServiceError";
  }
}

export class InstructorService {
  async findAll(
    filters: InstructorFilters = {},
  ): Promise<InstructoresResponse> {
    const { page, pageSize } = this.getPagination(filters);
    const search = filters.search?.trim().toLocaleLowerCase("es");
    const instructors = getInstructorStore()
      .filter((instructor) => {
        const searchableText = [
          instructor.nombre,
          instructor.correo,
          instructor.telefono ?? "",
        ]
          .join(" ")
          .toLocaleLowerCase("es");

        return (
          (!search || searchableText.includes(search)) &&
          (filters.estado === undefined || instructor.estado === filters.estado)
        );
      })
      .sort((first, second) => first.nombre.localeCompare(second.nombre, "es"));
    const totalItems = instructors.length;

    return {
      data: instructors
        .slice((page - 1) * pageSize, page * pageSize)
        .map((instructor) => this.toDto(instructor)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findById(id: string): Promise<InstructorResponse | null> {
    const instructor = getInstructorStore().find((item) => item.id === id);

    return instructor ? { data: this.toDto(instructor) } : null;
  }

  async create(input: CreateInstructorDto): Promise<InstructorResponse> {
    const data = createInstructorSchema.parse(input);

    this.ensureUniqueEmail(data.correo);

    const now = new Date();
    const instructor: InstructorEntity = {
      id: randomUUID(),
      nombre: data.nombre,
      correo: data.correo,
      telefono: this.normalizeOptional(data.telefono),
      estado: data.estado ?? true,
      observaciones: this.normalizeOptional(data.observaciones),
      createdAt: now,
      updatedAt: now,
    };

    getInstructorStore().push(instructor);

    return { data: this.toDto(instructor) };
  }

  async update(
    id: string,
    input: UpdateInstructorDto,
  ): Promise<InstructorResponse> {
    const data = updateInstructorSchema.parse(input);
    const instructor = this.requireInstructor(id);

    if (data.correo !== undefined) {
      this.ensureUniqueEmail(data.correo, id);
      instructor.correo = data.correo;
    }
    if (data.nombre !== undefined) instructor.nombre = data.nombre;
    if (data.telefono !== undefined) {
      instructor.telefono = this.normalizeOptional(data.telefono);
    }
    if (data.observaciones !== undefined) {
      instructor.observaciones = this.normalizeOptional(data.observaciones);
    }
    if (data.estado !== undefined) instructor.estado = data.estado;
    instructor.updatedAt = new Date();

    return { data: this.toDto(instructor) };
  }

  async delete(id: string): Promise<InstructorResponse> {
    const store = getInstructorStore();
    const index = store.findIndex((instructor) => instructor.id === id);

    if (index < 0) {
      throw new InstructorServiceError(
        "NOT_FOUND",
        "El instructor solicitado no existe.",
      );
    }

    const [instructor] = store.splice(index, 1);

    return { data: this.toDto(instructor) };
  }

  private requireInstructor(id: string): InstructorEntity {
    const instructor = getInstructorStore().find((item) => item.id === id);

    if (!instructor) {
      throw new InstructorServiceError(
        "NOT_FOUND",
        "El instructor solicitado no existe.",
      );
    }

    return instructor;
  }

  private ensureUniqueEmail(correo: string, excludedId?: string): void {
    const normalizedEmail = correo.trim().toLocaleLowerCase("es");
    const exists = getInstructorStore().some(
      (instructor) =>
        instructor.id !== excludedId &&
        instructor.correo.toLocaleLowerCase("es") === normalizedEmail,
    );

    if (exists) {
      throw new InstructorServiceError(
        "DUPLICATE_EMAIL",
        "Ya existe un instructor con ese correo institucional.",
      );
    }
  }

  private normalizeOptional(value: string | null | undefined): string | null {
    const normalized = value?.trim();

    return normalized ? normalized : null;
  }

  private getPagination(filters: InstructorFilters) {
    const maximumPageSize = Math.max(...PAGE_SIZE_OPTIONS);

    return {
      page: Math.max(DEFAULT_PAGE, Math.trunc(filters.page ?? DEFAULT_PAGE)),
      pageSize: Math.min(
        maximumPageSize,
        Math.max(1, Math.trunc(filters.pageSize ?? DEFAULT_PAGE_SIZE)),
      ),
    };
  }

  private toDto(instructor: InstructorEntity): InstructorDto {
    return {
      ...instructor,
      createdAt: instructor.createdAt.toISOString(),
      updatedAt: instructor.updatedAt.toISOString(),
    };
  }
}

export const instructorService = new InstructorService();
