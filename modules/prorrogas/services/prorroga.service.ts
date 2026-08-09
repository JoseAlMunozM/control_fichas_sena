import "server-only";

import { randomUUID } from "node:crypto";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/constants";
import { FICHA_ESTADO } from "@/modules/fichas/constants";
import { fichaService } from "@/modules/fichas/services";

import { PRORROGA_ESTADO } from "../constants";
import type {
  CreateProrrogaDto,
  ProrrogaActionErrorCode,
  ProrrogaDto,
  ProrrogaEntity,
  ProrrogaFilters,
  ProrrogaResponse,
  ProrrogasResponse,
  ResolveProrrogaDto,
  UpdateProrrogaDto,
} from "../types";
import {
  createProrrogaSchema,
  resolveProrrogaSchema,
  updateProrrogaSchema,
} from "../validators";
import { loadProrrogas, saveProrrogas } from "./prorroga.persistence";

export interface ProrrogaActorIdentity {
  id: string;
  nombre: string;
}

const globalForProrrogaStore = globalThis as unknown as {
  prorrogaStore?: ProrrogaEntity[];
};

function getProrrogaStore(): ProrrogaEntity[] {
  globalForProrrogaStore.prorrogaStore ??= [];

  return globalForProrrogaStore.prorrogaStore;
}

async function refreshProrrogaStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    globalForProrrogaStore.prorrogaStore = await loadProrrogas();
  }
}

async function persistProrrogaStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    await saveProrrogas(getProrrogaStore());
  }
}

export class ProrrogaServiceError extends Error {
  constructor(
    public readonly code: Exclude<
      ProrrogaActionErrorCode,
      "VALIDATION_ERROR" | "INTERNAL_ERROR"
    >,
    message: string,
  ) {
    super(message);
    this.name = "ProrrogaServiceError";
  }
}

export class ProrrogaService {
  async findAll(
    filters: ProrrogaFilters = {},
  ): Promise<ProrrogasResponse> {
    await refreshProrrogaStore();
    const { page, pageSize } = this.getPagination(filters);
    const prorrogas = getProrrogaStore()
      .filter((prorroga) => this.matchesFilters(prorroga, filters))
      .sort(
        (first, second) =>
          second.createdAt.getTime() - first.createdAt.getTime(),
      );
    const totalItems = prorrogas.length;

    return {
      data: prorrogas
        .slice((page - 1) * pageSize, page * pageSize)
        .map((prorroga) => this.toDto(prorroga)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findById(id: string): Promise<ProrrogaResponse | null> {
    await refreshProrrogaStore();
    const prorroga = getProrrogaStore().find((item) => item.id === id);

    return prorroga ? { data: this.toDto(prorroga) } : null;
  }

  async create(
    input: CreateProrrogaDto,
    actor: ProrrogaActorIdentity,
  ): Promise<ProrrogaResponse> {
    await refreshProrrogaStore();
    const data = createProrrogaSchema.parse(input);
    const fichaResponse = await fichaService.findById(data.fichaId);

    if (!fichaResponse) {
      throw new ProrrogaServiceError(
        "FICHA_NOT_FOUND",
        "La ficha seleccionada no existe.",
      );
    }

    const ficha = fichaResponse.data;

    if (
      ficha.estado === FICHA_ESTADO.FINALIZADA ||
      ficha.estado === FICHA_ESTADO.CANCELADA
    ) {
      throw new ProrrogaServiceError(
        "INVALID_DATES",
        "No puedes solicitar una prórroga para una ficha finalizada o cancelada.",
      );
    }

    this.ensureNoPendingRequest(ficha.id);
    this.validateExtensionDates(
      ficha.fechaFinLectiva,
      ficha.fechaFinPractica,
      data.fechaFinLectivaNueva,
      data.fechaFinPracticaNueva,
    );

    const now = new Date();
    const prorroga: ProrrogaEntity = {
      id: randomUUID(),
      fichaId: ficha.id,
      fichaNumero: ficha.numero,
      programaNombre: ficha.programaNombre,
      municipio: ficha.municipio,
      fechaInicio: this.parseDate(ficha.fechaInicio),
      fechaFinLectivaAnterior: this.parseDate(ficha.fechaFinLectiva),
      fechaFinPracticaAnterior: this.parseDate(ficha.fechaFinPractica),
      fechaFinLectivaNueva: this.parseDate(data.fechaFinLectivaNueva),
      fechaFinPracticaNueva: this.parseDate(data.fechaFinPracticaNueva),
      motivo: data.motivo,
      estado: PRORROGA_ESTADO.PENDIENTE,
      observacionRespuesta: null,
      solicitadoPorId: actor.id,
      solicitadoPorNombre: actor.nombre,
      resueltoPorId: null,
      resueltoPorNombre: null,
      resolvedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    getProrrogaStore().push(prorroga);

    await persistProrrogaStore();
    return { data: this.toDto(prorroga) };
  }

  async update(
    id: string,
    input: UpdateProrrogaDto,
  ): Promise<ProrrogaResponse> {
    await refreshProrrogaStore();
    const data = updateProrrogaSchema.parse(input);
    const prorroga = this.requireProrroga(id);

    this.ensurePending(prorroga);
    this.validateExtensionDates(
      this.formatDate(prorroga.fechaFinLectivaAnterior),
      this.formatDate(prorroga.fechaFinPracticaAnterior),
      data.fechaFinLectivaNueva,
      data.fechaFinPracticaNueva,
    );

    prorroga.fechaFinLectivaNueva = this.parseDate(
      data.fechaFinLectivaNueva,
    );
    prorroga.fechaFinPracticaNueva = this.parseDate(
      data.fechaFinPracticaNueva,
    );
    prorroga.motivo = data.motivo;
    prorroga.updatedAt = new Date();

    await persistProrrogaStore();
    return { data: this.toDto(prorroga) };
  }

  async resolve(
    id: string,
    input: ResolveProrrogaDto,
    actor: ProrrogaActorIdentity,
  ): Promise<ProrrogaResponse> {
    await refreshProrrogaStore();
    const data = resolveProrrogaSchema.parse(input);
    const prorroga = this.requireProrroga(id);

    this.ensurePending(prorroga);

    if (data.estado === PRORROGA_ESTADO.APROBADA) {
      const fichaResponse = await fichaService.findById(prorroga.fichaId);

      if (!fichaResponse) {
        throw new ProrrogaServiceError(
          "FICHA_NOT_FOUND",
          "La ficha asociada ya no existe.",
        );
      }

      this.validateExtensionDates(
        fichaResponse.data.fechaFinLectiva,
        fichaResponse.data.fechaFinPractica,
        this.formatDate(prorroga.fechaFinLectivaNueva),
        this.formatDate(prorroga.fechaFinPracticaNueva),
      );
      await fichaService.update(prorroga.fichaId, {
        fechaFinLectiva: this.formatDate(prorroga.fechaFinLectivaNueva),
        fechaFinPractica: this.formatDate(prorroga.fechaFinPracticaNueva),
      });
    }

    const now = new Date();
    prorroga.estado = data.estado;
    prorroga.observacionRespuesta = this.normalizeOptional(
      data.observacionRespuesta,
    );
    prorroga.resueltoPorId = actor.id;
    prorroga.resueltoPorNombre = actor.nombre;
    prorroga.resolvedAt = now;
    prorroga.updatedAt = now;

    await persistProrrogaStore();
    return { data: this.toDto(prorroga) };
  }

  async delete(id: string): Promise<ProrrogaResponse> {
    await refreshProrrogaStore();
    const store = getProrrogaStore();
    const index = store.findIndex((prorroga) => prorroga.id === id);

    if (index < 0) {
      throw new ProrrogaServiceError(
        "NOT_FOUND",
        "La prórroga solicitada no existe.",
      );
    }

    this.ensurePending(store[index]);
    const [prorroga] = store.splice(index, 1);

    await persistProrrogaStore();
    return { data: this.toDto(prorroga) };
  }

  private requireProrroga(id: string): ProrrogaEntity {
    const prorroga = getProrrogaStore().find((item) => item.id === id);

    if (!prorroga) {
      throw new ProrrogaServiceError(
        "NOT_FOUND",
        "La prórroga solicitada no existe.",
      );
    }

    return prorroga;
  }

  private ensurePending(prorroga: ProrrogaEntity): void {
    if (prorroga.estado !== PRORROGA_ESTADO.PENDIENTE) {
      throw new ProrrogaServiceError(
        "ALREADY_RESOLVED",
        "La prórroga ya fue resuelta y conserva su histórico.",
      );
    }
  }

  private ensureNoPendingRequest(fichaId: string): void {
    const exists = getProrrogaStore().some(
      (prorroga) =>
        prorroga.fichaId === fichaId &&
        prorroga.estado === PRORROGA_ESTADO.PENDIENTE,
    );

    if (exists) {
      throw new ProrrogaServiceError(
        "DUPLICATE_PENDING",
        "La ficha ya tiene una solicitud de prórroga pendiente.",
      );
    }
  }

  private validateExtensionDates(
    currentLectiveEnd: string,
    currentPracticeEnd: string,
    newLectiveEnd: string,
    newPracticeEnd: string,
  ): void {
    if (
      newLectiveEnd <= currentLectiveEnd ||
      newPracticeEnd <= currentPracticeEnd ||
      newPracticeEnd < newLectiveEnd
    ) {
      throw new ProrrogaServiceError(
        "INVALID_DATES",
        "Las nuevas fechas deben ampliar los finales lectivo y práctico actuales.",
      );
    }
  }

  private matchesFilters(
    prorroga: ProrrogaEntity,
    filters: ProrrogaFilters,
  ): boolean {
    const search = filters.search?.trim().toLocaleLowerCase("es");
    const searchableText = [
      prorroga.fichaNumero,
      prorroga.programaNombre,
      prorroga.municipio,
      prorroga.motivo,
      prorroga.solicitadoPorNombre,
    ]
      .join(" ")
      .toLocaleLowerCase("es");

    return (
      (!search || searchableText.includes(search)) &&
      (!filters.estado || prorroga.estado === filters.estado) &&
      (!filters.fichaId || prorroga.fichaId === filters.fichaId)
    );
  }

  private getPagination(filters: ProrrogaFilters) {
    const maximumPageSize = Math.max(...PAGE_SIZE_OPTIONS);

    return {
      page: Math.max(DEFAULT_PAGE, Math.trunc(filters.page ?? DEFAULT_PAGE)),
      pageSize: Math.min(
        maximumPageSize,
        Math.max(1, Math.trunc(filters.pageSize ?? DEFAULT_PAGE_SIZE)),
      ),
    };
  }

  private parseDate(value: string): Date {
    return new Date(`${value}T00:00:00.000Z`);
  }

  private formatDate(value: Date): string {
    return value.toISOString().slice(0, 10);
  }

  private normalizeOptional(value: string | null | undefined): string | null {
    const normalized = value?.trim();

    return normalized ? normalized : null;
  }

  private toDto(prorroga: ProrrogaEntity): ProrrogaDto {
    return {
      ...prorroga,
      fechaInicio: this.formatDate(prorroga.fechaInicio),
      fechaFinLectivaAnterior: this.formatDate(
        prorroga.fechaFinLectivaAnterior,
      ),
      fechaFinPracticaAnterior: this.formatDate(
        prorroga.fechaFinPracticaAnterior,
      ),
      fechaFinLectivaNueva: this.formatDate(prorroga.fechaFinLectivaNueva),
      fechaFinPracticaNueva: this.formatDate(prorroga.fechaFinPracticaNueva),
      resolvedAt: prorroga.resolvedAt?.toISOString() ?? null,
      createdAt: prorroga.createdAt.toISOString(),
      updatedAt: prorroga.updatedAt.toISOString(),
    };
  }
}

export const prorrogaService = new ProrrogaService();
