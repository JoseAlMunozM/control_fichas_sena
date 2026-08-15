import "server-only";

import { randomUUID } from "node:crypto";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/constants";

import type {
  ContratoInstructorEntity,
  CreateContratoInstructorDto,
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
  createContratoInstructorSchema,
  createInstructorSchema,
  updateInstructorSchema,
} from "../validators";
import {
  loadInstructores,
  saveInstructores,
} from "./instructor.persistence";

const globalForInstructorStore = globalThis as unknown as {
  instructorStore?: InstructorEntity[];
};

function getInstructorStore(): InstructorEntity[] {
  globalForInstructorStore.instructorStore ??= [];

  return globalForInstructorStore.instructorStore;
}

async function refreshInstructorStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    globalForInstructorStore.instructorStore = await loadInstructores();
  }
}

async function persistInstructorStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    await saveInstructores(getInstructorStore());
  }
}

function getBogotaDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function isContractCurrent(
  contract: ContratoInstructorEntity,
  referenceDate: string,
): boolean {
  return (
    formatDate(contract.fechaInicio) <= referenceDate &&
    formatDate(contract.fechaFin) >= referenceDate
  );
}

function synchronizeInstructorStates(
  referenceDate: string,
): number {
  let updated = 0;

  getInstructorStore().forEach((instructor) => {
    if (instructor.contratos.length === 0) return;

    const nextState = instructor.contratos.some((contract) =>
      isContractCurrent(contract, referenceDate),
    );

    if (instructor.estado !== nextState) {
      instructor.estado = nextState;
      instructor.updatedAt = new Date();
      updated += 1;
    }
  });

  return updated;
}

async function prepareInstructorStore(
  referenceDate = new Date(),
): Promise<void> {
  await refreshInstructorStore();

  if (synchronizeInstructorStates(getBogotaDateKey(referenceDate)) > 0) {
    await persistInstructorStore();
  }
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
    await prepareInstructorStore();
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
    await prepareInstructorStore();
    const instructor = getInstructorStore().find((item) => item.id === id);

    return instructor ? { data: this.toDto(instructor) } : null;
  }

  async create(input: CreateInstructorDto): Promise<InstructorResponse> {
    await prepareInstructorStore();
    const data = createInstructorSchema.parse(input);

    this.ensureUniqueEmail(data.correo);

    const now = new Date();
    const contract: ContratoInstructorEntity = {
      id: randomUUID(),
      instructorId: "",
      fechaInicio: parseDate(data.fechaInicioContrato),
      fechaFin: parseDate(data.fechaFinContrato),
      createdAt: now,
      updatedAt: now,
    };
    const instructor: InstructorEntity = {
      id: randomUUID(),
      nombre: data.nombre,
      correo: data.correo,
      telefono: this.normalizeOptional(data.telefono),
      estado: isContractCurrent(contract, getBogotaDateKey(now)),
      observaciones: this.normalizeOptional(data.observaciones),
      contratos: [],
      createdAt: now,
      updatedAt: now,
    };

    contract.instructorId = instructor.id;
    instructor.contratos.push(contract);

    getInstructorStore().push(instructor);
    await persistInstructorStore();

    return { data: this.toDto(instructor) };
  }

  async update(
    id: string,
    input: UpdateInstructorDto,
  ): Promise<InstructorResponse> {
    await prepareInstructorStore();
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
    instructor.updatedAt = new Date();
    await persistInstructorStore();

    return { data: this.toDto(instructor) };
  }

  async delete(id: string): Promise<InstructorResponse> {
    await prepareInstructorStore();
    const store = getInstructorStore();
    const index = store.findIndex((instructor) => instructor.id === id);

    if (index < 0) {
      throw new InstructorServiceError(
        "NOT_FOUND",
        "El instructor solicitado no existe.",
      );
    }

    const [instructor] = store.splice(index, 1);
    await persistInstructorStore();

    return { data: this.toDto(instructor) };
  }

  async addContract(
    instructorId: string,
    input: CreateContratoInstructorDto,
  ): Promise<InstructorResponse> {
    await prepareInstructorStore();
    const data = createContratoInstructorSchema.parse(input);
    const instructor = this.requireInstructor(instructorId);

    this.ensureContractDoesNotOverlap(
      instructor,
      data.fechaInicio,
      data.fechaFin,
    );

    const now = new Date();
    instructor.contratos.push({
      id: randomUUID(),
      instructorId,
      fechaInicio: parseDate(data.fechaInicio),
      fechaFin: parseDate(data.fechaFin),
      createdAt: now,
      updatedAt: now,
    });
    instructor.contratos.sort(
      (first, second) =>
        second.fechaInicio.getTime() - first.fechaInicio.getTime(),
    );
    instructor.estado = instructor.contratos.some((contract) =>
      isContractCurrent(contract, getBogotaDateKey(now)),
    );
    instructor.updatedAt = now;

    await persistInstructorStore();

    return { data: this.toDto(instructor) };
  }

  async synchronizeContractStatuses(
    referenceDate = new Date(),
  ): Promise<number> {
    await refreshInstructorStore();
    const updated = synchronizeInstructorStates(
      getBogotaDateKey(referenceDate),
    );

    if (updated > 0) await persistInstructorStore();

    return updated;
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
        "Ya existe un instructor con ese correo institucional. Búscalo en el listado y edita su información en lugar de crear otro.",
      );
    }
  }

  private ensureContractDoesNotOverlap(
    instructor: InstructorEntity,
    startDate: string,
    endDate: string,
  ): void {
    const overlaps = instructor.contratos.some((contract) => {
      const currentStart = formatDate(contract.fechaInicio);
      const currentEnd = formatDate(contract.fechaFin);

      return startDate <= currentEnd && endDate >= currentStart;
    });

    if (overlaps) {
      throw new InstructorServiceError(
        "CONTRACT_OVERLAP",
        "Las fechas del nuevo contrato se superponen con un contrato existente. Revisa el histórico y haz que la renovación comience después de finalizar el contrato anterior.",
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
      contratos: instructor.contratos.map((contrato) => ({
        ...contrato,
        fechaInicio: formatDate(contrato.fechaInicio),
        fechaFin: formatDate(contrato.fechaFin),
        createdAt: contrato.createdAt.toISOString(),
        updatedAt: contrato.updatedAt.toISOString(),
      })),
      createdAt: instructor.createdAt.toISOString(),
      updatedAt: instructor.updatedAt.toISOString(),
    };
  }
}

export const instructorService = new InstructorService();
