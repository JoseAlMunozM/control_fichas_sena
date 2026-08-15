import "server-only";

import { randomUUID } from "node:crypto";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/constants";
import { instructorService } from "@/modules/instructores/services";
import { COMPETENCIA_TIPO } from "@/modules/programas/constants";
import { programaService } from "@/modules/programas/services";

import { DIA_SEMANA, FICHA_ESTADO, SEGUIMIENTO_ESTADO } from "../constants";
import type {
  ChangeFichaLeaderDto,
  CreateFichaDto,
  CreateNovedadCompetenciaDto,
  CreateProgramacionDto,
  DiaSemana,
  FichaActionErrorCode,
  FichaDto,
  FichaEntity,
  FichaFilters,
  FichaResponse,
  FichaSeguimientoEntity,
  FichasResponse,
  JornadaFormacion,
  NovedadCompetenciaEntity,
  ProgramacionCompetenciaEntity,
  SeguimientoCompetenciaEstado,
  UpdateFichaDto,
  UpdateNovedadCompetenciaDto,
  UpdateProgramacionDto,
  UpdateSeguimientoEstadoDto,
} from "../types";
import {
  changeFichaLeaderSchema,
  createNovedadCompetenciaSchema,
  createFichaSchema,
  createProgramacionSchema,
  updateFichaSchema,
  updateNovedadCompetenciaSchema,
  updateProgramacionSchema,
  updateSeguimientoEstadoSchema,
} from "../validators";
import {
  calculateProgrammedHours,
  schedulesOverlap,
} from "../utils";
import { loadFichas, saveFichas } from "./ficha.persistence";

export interface FichaLeaderIdentity {
  id: string;
  nombre: string;
  correo?: string | null;
}

const globalForFichaStore = globalThis as unknown as {
  fichaStore?: FichaEntity[];
};

function getFichaStore(): FichaEntity[] {
  globalForFichaStore.fichaStore ??= [];

  globalForFichaStore.fichaStore.forEach((ficha) => {
    const legacyFicha = ficha as FichaEntity & {
      diasFormacion?: DiaSemana[];
      horaInicio?: string;
      horaFin?: string;
    };

    ficha.jornadas ??= (legacyFicha.diasFormacion ?? []).map((dia) => ({
      dia,
      horaInicio: legacyFicha.horaInicio ?? "07:00",
      horaFin: legacyFicha.horaFin ?? "13:00",
    }));
    ficha.seguimientos.forEach((seguimiento) => {
      seguimiento.programaciones ??= [];
      seguimiento.novedades ??= [];
    });
    ficha.liderHistorial ??= [
      {
        id: randomUUID(),
        instructorId: ficha.instructorLiderId,
        instructorNombre: ficha.instructorLiderNombre,
        instructorCorreo: null,
        fechaInicio: new Date(ficha.fechaInicio),
        fechaFin: null,
        motivo: "Asignación inicial",
        asignadoPorId: ficha.instructorLiderId,
        asignadoPorNombre: ficha.instructorLiderNombre,
        createdAt: new Date(ficha.createdAt),
      },
    ];
  });

  return globalForFichaStore.fichaStore;
}

async function refreshFichaStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    globalForFichaStore.fichaStore = await loadFichas();
  }
}

async function persistFichaStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    await saveFichas(getFichaStore());
  }
}

export class FichaServiceError extends Error {
  constructor(
    public readonly code: Exclude<
      FichaActionErrorCode,
      "VALIDATION_ERROR" | "INTERNAL_ERROR"
    >,
    message: string,
  ) {
    super(message);
    this.name = "FichaServiceError";
  }
}

export class FichaService {
  async findAll(filters: FichaFilters = {}): Promise<FichasResponse> {
    await refreshFichaStore();
    const { page, pageSize } = this.getPagination(filters);
    const filteredFichas = getFichaStore()
      .filter((ficha) => this.matchesFilters(ficha, filters))
      .sort((first, second) => first.numero.localeCompare(second.numero, "es"));
    const totalItems = filteredFichas.length;

    return {
      data: filteredFichas
        .slice((page - 1) * pageSize, page * pageSize)
        .map((ficha) => this.toDto(ficha)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findById(id: string): Promise<FichaResponse | null> {
    await refreshFichaStore();
    const ficha = getFichaStore().find((item) => item.id === id);

    return ficha ? { data: this.toDto(ficha) } : null;
  }

  async create(
    input: CreateFichaDto,
    leader: FichaLeaderIdentity,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = createFichaSchema.parse(input);
    const store = getFichaStore();
    const effectiveLeader = await this.resolveLeaderInstructor(leader);

    this.ensureUniqueNumber(data.numero);

    const programaResponse = await programaService.findById(data.programaId);

    if (!programaResponse) {
      throw new FichaServiceError(
        "PROGRAM_NOT_FOUND",
        "El programa seleccionado no existe.",
      );
    }

    const programa = programaResponse.data;
    const plan = programa.planes.find((item) => item.id === data.planId);

    if (!plan) {
      throw new FichaServiceError(
        "PLAN_NOT_FOUND",
        "El plan seleccionado no pertenece al programa.",
      );
    }

    const now = new Date();
    const ficha: FichaEntity = {
      id: randomUUID(),
      numero: data.numero,
      programaId: programa.id,
      programaCodigo: programa.codigo,
      programaNombre: programa.nombre,
      planId: plan.id,
      planVersion: plan.version,
      municipio: data.municipio,
      sede: this.normalizeOptional(data.sede),
      modalidad: this.normalizeOptional(data.modalidad),
      jornadas: this.cloneJornadas(data.jornadas),
      fechaInicio: this.parseDate(data.fechaInicio),
      fechaFinLectiva: this.parseDate(data.fechaFinLectiva),
      fechaFinPractica: this.parseDate(data.fechaFinPractica),
      estado: FICHA_ESTADO.PLANEADA,
      instructorLiderId: effectiveLeader.id,
      instructorLiderNombre: effectiveLeader.nombre,
      liderHistorial: [
        {
          id: randomUUID(),
          instructorId: effectiveLeader.id,
          instructorNombre: effectiveLeader.nombre,
          instructorCorreo: effectiveLeader.correo ?? null,
          fechaInicio: this.parseDate(data.fechaInicio),
          fechaFin: null,
          motivo: "Asignación inicial",
          asignadoPorId: leader.id,
          asignadoPorNombre: leader.nombre,
          createdAt: now,
        },
      ],
      observaciones: this.normalizeOptional(data.observaciones),
      seguimientos: plan.competencias.map((competencia) => ({
        id: randomUUID(),
        competenciaId: competencia.id,
        competenciaNombre: competencia.nombre,
        competenciaNorma: competencia.norma,
        competenciaTipo: competencia.tipo,
        horasPlan: competencia.horas,
        orden: competencia.orden,
        estado: SEGUIMIENTO_ESTADO.PENDIENTE,
        programaciones: [],
        novedades: [],
      })),
      createdAt: now,
      updatedAt: now,
    };

    store.push(ficha);

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async createProgramacion(
    fichaId: string,
    seguimientoId: string,
    input: CreateProgramacionDto,
    leader: FichaLeaderIdentity,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = createProgramacionSchema.parse(input);
    const ficha = this.requireFicha(fichaId);
    const seguimiento = this.requireSeguimiento(ficha, seguimientoId);
    const instructorResponse = await instructorService.findById(
      data.instructorId,
    );

    if (!instructorResponse || !instructorResponse.data.estado) {
      throw new FichaServiceError(
        "INSTRUCTOR_NOT_FOUND",
        "El instructor seleccionado no está disponible. Verifica que exista y tenga un contrato vigente antes de programarlo.",
      );
    }

    const horasProgramadas = this.validateProgramming(
      ficha,
      seguimiento,
      data,
    );
    const now = new Date();
    const instructor = instructorResponse.data;
    const programacion: ProgramacionCompetenciaEntity = {
      id: randomUUID(),
      instructorId: instructor.id,
      instructorNombre: instructor.nombre,
      instructorCorreo: instructor.correo,
      fechaInicio: this.parseDate(data.fechaInicio),
      fechaFin: this.parseDate(data.fechaFin),
      bloques: data.bloques.map((bloque) => ({
        id: randomUUID(),
        ...bloque,
      })),
      horasProgramadas,
      registradoPorId: leader.id,
      registradoPorNombre: leader.nombre,
      createdAt: now,
      updatedAt: now,
    };

    seguimiento.programaciones.push(programacion);
    if (seguimiento.estado === SEGUIMIENTO_ESTADO.PENDIENTE) {
      seguimiento.estado = SEGUIMIENTO_ESTADO.PROGRAMADA;
    }
    ficha.updatedAt = now;

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async updateProgramacion(
    fichaId: string,
    seguimientoId: string,
    programacionId: string,
    input: UpdateProgramacionDto,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = updateProgramacionSchema.parse(input);
    const ficha = this.requireFicha(fichaId);
    const seguimiento = this.requireSeguimiento(ficha, seguimientoId);
    const programacion = this.requireProgramacion(
      seguimiento,
      programacionId,
    );
    const instructorResponse = await instructorService.findById(
      data.instructorId,
    );

    if (!instructorResponse || !instructorResponse.data.estado) {
      throw new FichaServiceError(
        "INSTRUCTOR_NOT_FOUND",
        "El instructor seleccionado no está disponible. Verifica que exista y tenga un contrato vigente antes de programarlo.",
      );
    }

    const horasProgramadas = this.validateProgramming(
      ficha,
      seguimiento,
      data,
      programacionId,
    );
    const instructor = instructorResponse.data;
    const proposedProgramming: ProgramacionCompetenciaEntity = {
      ...programacion,
      instructorId: instructor.id,
      instructorNombre: instructor.nombre,
      instructorCorreo: instructor.correo,
      fechaInicio: this.parseDate(data.fechaInicio),
      fechaFin: this.parseDate(data.fechaFin),
      bloques: data.bloques.map((bloque) => ({
        id: randomUUID(),
        ...bloque,
      })),
      horasProgramadas,
      updatedAt: new Date(),
    };

    Object.assign(programacion, proposedProgramming);
    ficha.updatedAt = programacion.updatedAt;

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async deleteProgramacion(
    fichaId: string,
    seguimientoId: string,
    programacionId: string,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const ficha = this.requireFicha(fichaId);
    const seguimiento = this.requireSeguimiento(ficha, seguimientoId);
    const index = seguimiento.programaciones.findIndex(
      (item) => item.id === programacionId,
    );

    if (index < 0) {
      throw new FichaServiceError(
        "PROGRAMMING_NOT_FOUND",
        "La programación solicitada no existe.",
      );
    }

    seguimiento.programaciones.splice(index, 1);
    if (
      seguimiento.programaciones.length === 0 &&
      seguimiento.estado === SEGUIMIENTO_ESTADO.PROGRAMADA
    ) {
      seguimiento.estado = SEGUIMIENTO_ESTADO.PENDIENTE;
    }
    ficha.updatedAt = new Date();

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async updateSeguimientoEstado(
    fichaId: string,
    seguimientoId: string,
    input: UpdateSeguimientoEstadoDto,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = updateSeguimientoEstadoSchema.parse(input);
    const ficha = this.requireFicha(fichaId);
    const seguimiento = this.requireSeguimiento(ficha, seguimientoId);
    const totalProgramado = seguimiento.programaciones.reduce(
      (total, programacion) => total + programacion.horasProgramadas,
      0,
    );
    this.validateFollowupStatus(
      data.estado,
      seguimiento.programaciones.length,
      totalProgramado,
      seguimiento.horasPlan,
    );

    seguimiento.estado = data.estado;
    ficha.updatedAt = new Date();

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async createNovedad(
    fichaId: string,
    seguimientoId: string,
    input: CreateNovedadCompetenciaDto,
    leader: FichaLeaderIdentity,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = createNovedadCompetenciaSchema.parse(input);
    const ficha = this.requireFicha(fichaId);
    const seguimiento = this.requireSeguimiento(ficha, seguimientoId);

    this.validateActivityDate(ficha, data.fecha);

    const now = new Date();
    seguimiento.novedades.push({
      id: randomUUID(),
      fecha: this.parseDate(data.fecha),
      tipo: data.tipo,
      descripcion: data.descripcion,
      registradoPorId: leader.id,
      registradoPorNombre: leader.nombre,
      createdAt: now,
      updatedAt: now,
    });
    ficha.updatedAt = now;

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async updateNovedad(
    fichaId: string,
    seguimientoId: string,
    novedadId: string,
    input: UpdateNovedadCompetenciaDto,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = updateNovedadCompetenciaSchema.parse(input);
    const ficha = this.requireFicha(fichaId);
    const seguimiento = this.requireSeguimiento(ficha, seguimientoId);
    const novedad = this.requireNovelty(seguimiento, novedadId);

    this.validateActivityDate(ficha, data.fecha);

    novedad.fecha = this.parseDate(data.fecha);
    novedad.tipo = data.tipo;
    novedad.descripcion = data.descripcion;
    novedad.updatedAt = new Date();
    ficha.updatedAt = novedad.updatedAt;

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async deleteNovedad(
    fichaId: string,
    seguimientoId: string,
    novedadId: string,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const ficha = this.requireFicha(fichaId);
    const seguimiento = this.requireSeguimiento(ficha, seguimientoId);
    const index = seguimiento.novedades.findIndex(
      (novedad) => novedad.id === novedadId,
    );

    if (index < 0) {
      throw new FichaServiceError(
        "ACTIVITY_NOT_FOUND",
        "La novedad solicitada no existe.",
      );
    }

    seguimiento.novedades.splice(index, 1);
    ficha.updatedAt = new Date();

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async update(
    id: string,
    input: UpdateFichaDto,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = updateFichaSchema.parse(input);
    const ficha = this.requireFicha(id);

    if (data.numero !== undefined) {
      this.ensureUniqueNumber(data.numero, id);
    }

    const mergedData = createFichaSchema.parse({
      numero: data.numero ?? ficha.numero,
      programaId: ficha.programaId,
      planId: ficha.planId,
      municipio: data.municipio ?? ficha.municipio,
      sede: data.sede !== undefined ? data.sede : ficha.sede,
      modalidad:
        data.modalidad !== undefined ? data.modalidad : ficha.modalidad,
      jornadas: data.jornadas ?? ficha.jornadas,
      fechaInicio: data.fechaInicio ?? this.formatDate(ficha.fechaInicio),
      fechaFinLectiva:
        data.fechaFinLectiva ?? this.formatDate(ficha.fechaFinLectiva),
      fechaFinPractica:
        data.fechaFinPractica ?? this.formatDate(ficha.fechaFinPractica),
      observaciones:
        data.observaciones !== undefined
          ? data.observaciones
          : ficha.observaciones,
    });
    this.validateExistingProgramming(ficha, mergedData);
    const previousStartDate = this.formatDate(ficha.fechaInicio);

    ficha.numero = mergedData.numero;
    ficha.municipio = mergedData.municipio;
    ficha.sede = this.normalizeOptional(mergedData.sede);
    ficha.modalidad = this.normalizeOptional(mergedData.modalidad);
    ficha.jornadas = this.cloneJornadas(mergedData.jornadas);
    ficha.fechaInicio = this.parseDate(mergedData.fechaInicio);
    ficha.fechaFinLectiva = this.parseDate(mergedData.fechaFinLectiva);
    ficha.fechaFinPractica = this.parseDate(mergedData.fechaFinPractica);
    ficha.observaciones = this.normalizeOptional(mergedData.observaciones);
    if (
      ficha.liderHistorial.length === 1 &&
      ficha.liderHistorial[0].fechaFin === null &&
      this.formatDate(ficha.liderHistorial[0].fechaInicio) ===
        previousStartDate
    ) {
      ficha.liderHistorial[0].fechaInicio = new Date(ficha.fechaInicio);
    }
    if (data.estado !== undefined) ficha.estado = data.estado;
    ficha.updatedAt = new Date();

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async changeLeader(
    fichaId: string,
    input: ChangeFichaLeaderDto,
    actor: FichaLeaderIdentity,
  ): Promise<FichaResponse> {
    await refreshFichaStore();
    const data = changeFichaLeaderSchema.parse(input);
    const ficha = this.requireFicha(fichaId);

    if (
      ficha.estado === FICHA_ESTADO.FINALIZADA ||
      ficha.estado === FICHA_ESTADO.CANCELADA
    ) {
      throw new FichaServiceError(
        "INVALID_LEADER_CHANGE",
        "No puedes cambiar el líder de una ficha finalizada o cancelada.",
      );
    }

    const instructorResponse = await instructorService.findById(
      data.instructorId,
    );

    if (!instructorResponse || !instructorResponse.data.estado) {
      throw new FichaServiceError(
        "INSTRUCTOR_NOT_FOUND",
        "El nuevo instructor líder no está disponible. Verifica que esté registrado y tenga un contrato vigente.",
      );
    }

    if (ficha.instructorLiderId === data.instructorId) {
      throw new FichaServiceError(
        "INVALID_LEADER_CHANGE",
        "El instructor seleccionado ya es el líder actual.",
      );
    }

    const currentAssignment = ficha.liderHistorial.find(
      (assignment) => assignment.fechaFin === null,
    );

    if (!currentAssignment) {
      throw new FichaServiceError(
        "INVALID_LEADER_CHANGE",
        "La ficha no tiene una asignación de líder activa.",
      );
    }

    const fichaStart = this.formatDate(ficha.fechaInicio);
    const fichaEnd = this.formatDate(ficha.fechaFinPractica);
    const currentAssignmentStart = this.formatDate(
      currentAssignment.fechaInicio,
    );

    if (
      data.fechaInicio < fichaStart ||
      data.fechaInicio > fichaEnd ||
      data.fechaInicio <= currentAssignmentStart
    ) {
      throw new FichaServiceError(
        "INVALID_LEADER_CHANGE",
        "La fecha efectiva debe ser posterior al inicio del líder actual y estar dentro de la ficha.",
      );
    }

    const instructor = instructorResponse.data;
    const effectiveDate = this.parseDate(data.fechaInicio);
    const previousEndDate = new Date(effectiveDate);
    previousEndDate.setUTCDate(previousEndDate.getUTCDate() - 1);
    currentAssignment.fechaFin = previousEndDate;

    ficha.liderHistorial.push({
      id: randomUUID(),
      instructorId: instructor.id,
      instructorNombre: instructor.nombre,
      instructorCorreo: instructor.correo,
      fechaInicio: effectiveDate,
      fechaFin: null,
      motivo: data.motivo,
      asignadoPorId: actor.id,
      asignadoPorNombre: actor.nombre,
      createdAt: new Date(),
    });
    ficha.instructorLiderId = instructor.id;
    ficha.instructorLiderNombre = instructor.nombre;
    ficha.updatedAt = new Date();

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  async delete(id: string): Promise<FichaResponse> {
    await refreshFichaStore();
    const store = getFichaStore();
    const index = store.findIndex((ficha) => ficha.id === id);

    if (index < 0) {
      throw new FichaServiceError(
        "NOT_FOUND",
        "La ficha solicitada no existe.",
      );
    }

    const [ficha] = store.splice(index, 1);

    await persistFichaStore();
    return { data: this.toDto(ficha) };
  }

  private requireFicha(id: string): FichaEntity {
    const ficha = getFichaStore().find((item) => item.id === id);

    if (!ficha) {
      throw new FichaServiceError(
        "NOT_FOUND",
        "La ficha solicitada no existe.",
      );
    }

    return ficha;
  }

  private requireSeguimiento(
    ficha: FichaEntity,
    seguimientoId: string,
  ): FichaSeguimientoEntity {
    const seguimiento = ficha.seguimientos.find(
      (item) => item.id === seguimientoId,
    );

    if (!seguimiento) {
      throw new FichaServiceError(
        "FOLLOWUP_NOT_FOUND",
        "El seguimiento de la competencia no existe.",
      );
    }

    return seguimiento;
  }

  private requireProgramacion(
    seguimiento: FichaSeguimientoEntity,
    programacionId: string,
  ): ProgramacionCompetenciaEntity {
    const programacion = seguimiento.programaciones.find(
      (item) => item.id === programacionId,
    );

    if (!programacion) {
      throw new FichaServiceError(
        "PROGRAMMING_NOT_FOUND",
        "La programación solicitada no existe.",
      );
    }

    return programacion;
  }

  private requireNovelty(
    seguimiento: FichaSeguimientoEntity,
    novedadId: string,
  ): NovedadCompetenciaEntity {
    const novedad = seguimiento.novedades.find(
      (item) => item.id === novedadId,
    );

    if (!novedad) {
      throw new FichaServiceError(
        "ACTIVITY_NOT_FOUND",
        "La novedad solicitada no existe.",
      );
    }

    return novedad;
  }

  private validateActivityDate(ficha: FichaEntity, date: string): void {
    if (
      date < this.formatDate(ficha.fechaInicio) ||
      date > this.formatDate(ficha.fechaFinPractica)
    ) {
      throw new FichaServiceError(
        "INVALID_SCHEDULE",
        "La fecha debe estar dentro del periodo de la ficha.",
      );
    }
  }

  private validateProgramming(
    ficha: FichaEntity,
    seguimiento: FichaSeguimientoEntity,
    data: CreateProgramacionDto,
    excludedProgrammingId?: string,
  ): number {
    const allowedEndDate =
      seguimiento.competenciaTipo === COMPETENCIA_TIPO.PRACTICA
        ? this.formatDate(ficha.fechaFinPractica)
        : this.formatDate(ficha.fechaFinLectiva);

    if (
      data.fechaInicio < this.formatDate(ficha.fechaInicio) ||
      data.fechaFin > allowedEndDate
    ) {
      throw new FichaServiceError(
        "INVALID_SCHEDULE",
        `Las fechas deben estar entre ${this.formatDate(ficha.fechaInicio)} y ${allowedEndDate}. Ajusta el rango o aprueba una prórroga antes de programar fuera de ese periodo.`,
      );
    }

    data.bloques.forEach((bloque) => {
      const jornada = ficha.jornadas.find(
        (item) => item.dia === bloque.dia,
      );

      if (!jornada) {
        throw new FichaServiceError(
          "INVALID_SCHEDULE",
          "Uno de los días seleccionados no pertenece a la jornada de la ficha. Edita la ficha o selecciona únicamente días habilitados.",
        );
      }

      if (
        bloque.horaInicio < jornada.horaInicio ||
        bloque.horaFin > jornada.horaFin
      ) {
        throw new FichaServiceError(
          "INVALID_SCHEDULE",
          "Uno de los bloques está fuera del horario permitido para la ficha. Ajusta las horas al intervalo mostrado en Jornada permitida.",
        );
      }
    });

    this.ensureBlocksDoNotOverlap(data);

    const horasProgramadas = calculateProgrammedHours(
      data.fechaInicio,
      data.fechaFin,
      data.bloques,
    );

    if (horasProgramadas <= 0) {
      throw new FichaServiceError(
        "INVALID_SCHEDULE",
        "El rango de fechas no contiene ninguno de los días seleccionados. Amplía el rango o cambia los bloques semanales.",
      );
    }

    const existingHours = seguimiento.programaciones
      .filter((item) => item.id !== excludedProgrammingId)
      .reduce((total, item) => total + item.horasProgramadas, 0);

    if (existingHours + horasProgramadas > seguimiento.horasPlan + 0.001) {
      throw new FichaServiceError(
        "HOURS_EXCEEDED",
        `La programación dejaría ${existingHours + horasProgramadas} horas acumuladas, pero el plan permite ${seguimiento.horasPlan}. Reduce el rango, los días o la duración de los bloques.`,
      );
    }

    this.ensureNoScheduleConflicts(
      ficha,
      data,
      excludedProgrammingId,
    );

    return horasProgramadas;
  }

  private validateExistingProgramming(
    ficha: FichaEntity,
    data: CreateFichaDto,
  ): void {
    for (const seguimiento of ficha.seguimientos) {
      const allowedEndDate =
        seguimiento.competenciaTipo === COMPETENCIA_TIPO.PRACTICA
          ? data.fechaFinPractica
          : data.fechaFinLectiva;

      for (const programacion of seguimiento.programaciones) {
        if (
          this.formatDate(programacion.fechaInicio) < data.fechaInicio ||
          this.formatDate(programacion.fechaFin) > allowedEndDate
        ) {
          throw new FichaServiceError(
            "INVALID_SCHEDULE",
            "No se pueden reducir las fechas porque una programación existente quedaría fuera del periodo. Ajusta primero esa programación.",
          );
        }

        for (const bloque of programacion.bloques) {
          const jornada = data.jornadas.find(
            (item) => item.dia === bloque.dia,
          );

          if (
            !jornada ||
            bloque.horaInicio < jornada.horaInicio ||
            bloque.horaFin > jornada.horaFin
          ) {
            throw new FichaServiceError(
              "INVALID_SCHEDULE",
              "No se puede reducir la jornada porque una programación existente quedaría fuera del horario. Ajusta primero esa programación.",
            );
          }
        }
      }
    }
  }

  private async resolveLeaderInstructor(
    leader: FichaLeaderIdentity,
  ): Promise<FichaLeaderIdentity> {
    if (process.env.NODE_ENV === "test") return leader;

    const instructors = await instructorService.findAll({
      estado: true,
      pageSize: 100,
    });
    const normalizedName = leader.nombre.trim().toLocaleLowerCase("es");
    const normalizedEmail = leader.correo?.trim().toLocaleLowerCase("es");
    const instructor = instructors.data.find(
      (item) =>
        item.id === leader.id ||
        (normalizedEmail && item.correo === normalizedEmail) ||
        item.nombre.trim().toLocaleLowerCase("es") === normalizedName,
    );

    if (!instructor) {
      throw new FichaServiceError(
        "INSTRUCTOR_NOT_FOUND",
        "Registra primero al instructor líder con el mismo nombre de la sesión.",
      );
    }

    return {
      id: instructor.id,
      nombre: instructor.nombre,
      correo: instructor.correo,
    };
  }

  private ensureBlocksDoNotOverlap(data: CreateProgramacionDto): void {
    data.bloques.forEach((block, index) => {
      const hasOverlap = data.bloques.some(
        (otherBlock, otherIndex) =>
          index !== otherIndex &&
          schedulesOverlap(
            data.fechaInicio,
            data.fechaFin,
            block,
            data.fechaInicio,
            data.fechaFin,
            otherBlock,
          ),
      );

      if (hasOverlap) {
          throw new FichaServiceError(
            "INVALID_SCHEDULE",
            "Dos bloques de esta programación se cruzan entre sí. Ajusta sus horas para que no coincidan.",
        );
      }
    });
  }

  private ensureNoScheduleConflicts(
    currentFicha: FichaEntity,
    data: CreateProgramacionDto,
    excludedProgrammingId?: string,
  ): void {
    for (const ficha of getFichaStore()) {
      for (const seguimiento of ficha.seguimientos) {
        if (seguimiento.estado === SEGUIMIENTO_ESTADO.CANCELADA) continue;

        for (const programacion of seguimiento.programaciones) {
          if (programacion.id === excludedProgrammingId) continue;
          if (
            ficha.id !== currentFicha.id &&
            programacion.instructorId !== data.instructorId
          ) {
            continue;
          }

          const hasOverlap = data.bloques.some((block) =>
            programacion.bloques.some((existingBlock) =>
              schedulesOverlap(
                data.fechaInicio,
                data.fechaFin,
                block,
                this.formatDate(programacion.fechaInicio),
                this.formatDate(programacion.fechaFin),
                existingBlock,
              ),
            ),
          );

          if (hasOverlap) {
            const reason =
              ficha.id === currentFicha.id
                ? `La ficha ${ficha.numero} ya tiene otra competencia en ese horario. Cambia el bloque para evitar el cruce.`
                : `El instructor ya tiene formación asignada en la ficha ${ficha.numero} durante ese horario. Selecciona otro instructor o cambia el bloque.`;

            throw new FichaServiceError("SCHEDULE_CONFLICT", reason);
          }
        }
      }
    }
  }

  private validateFollowupStatus(
    status: SeguimientoCompetenciaEstado,
    programmingCount: number,
    programmedHours: number,
    planHours: number,
  ): void {
    if (
      (status === SEGUIMIENTO_ESTADO.PROGRAMADA ||
        status === SEGUIMIENTO_ESTADO.EN_EJECUCION) &&
      programmingCount === 0
    ) {
      throw new FichaServiceError(
        "INVALID_SCHEDULE",
        "No puedes usar este estado sin una programación. Agrega al menos un segmento con instructor, fechas y horario.",
      );
    }

    if (
      status === SEGUIMIENTO_ESTADO.FINALIZADA &&
      Math.abs(programmedHours - planHours) > 0.001
    ) {
      throw new FichaServiceError(
        "INVALID_SCHEDULE",
        `Para finalizar deben estar programadas exactamente ${planHours} horas. Actualmente hay ${programmedHours}; ajusta los segmentos hasta completar el total.`,
      );
    }

    if (
      status === SEGUIMIENTO_ESTADO.PENDIENTE &&
      programmingCount > 0
    ) {
      throw new FichaServiceError(
        "INVALID_SCHEDULE",
        "Una competencia con segmentos no puede volver a Pendiente. Elimina primero todas sus programaciones o selecciona otro estado.",
      );
    }
  }

  private ensureUniqueNumber(numero: string, excludedId?: string): void {
    const normalizedNumber = numero.trim().toLocaleLowerCase("es");
    const exists = getFichaStore().some(
      (ficha) =>
        ficha.id !== excludedId &&
        ficha.numero.toLocaleLowerCase("es") === normalizedNumber,
    );

    if (exists) {
      throw new FichaServiceError(
        "DUPLICATE_NUMBER",
        "Ya existe una ficha con ese número. Busca la ficha existente para editarla o utiliza un número diferente.",
      );
    }
  }

  private matchesFilters(
    ficha: FichaEntity,
    filters: FichaFilters,
  ): boolean {
    const search = filters.search?.trim().toLocaleLowerCase("es");
    const searchableText = [
      ficha.numero,
      ficha.programaCodigo,
      ficha.programaNombre,
      ficha.municipio,
      ficha.sede ?? "",
      ficha.instructorLiderNombre,
    ]
      .join(" ")
      .toLocaleLowerCase("es");

    return (
      (!search || searchableText.includes(search)) &&
      (!filters.programaId || ficha.programaId === filters.programaId) &&
      (!filters.estado || ficha.estado === filters.estado)
    );
  }

  private getPagination(filters: FichaFilters) {
    const maximumPageSize = Math.max(...PAGE_SIZE_OPTIONS);
    const requestedPage = Math.trunc(filters.page ?? DEFAULT_PAGE);
    const requestedPageSize = Math.trunc(
      filters.pageSize ?? DEFAULT_PAGE_SIZE,
    );

    return {
      page: Math.max(DEFAULT_PAGE, requestedPage),
      pageSize: Math.min(
        maximumPageSize,
        Math.max(1, requestedPageSize),
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

  private cloneJornadas(
    jornadas: readonly JornadaFormacion[],
  ): JornadaFormacion[] {
    const dayOrder = Object.values(DIA_SEMANA);

    return jornadas
      .map((jornada) => ({ ...jornada }))
      .sort(
        (first, second) =>
          dayOrder.indexOf(first.dia) - dayOrder.indexOf(second.dia),
      );
  }

  private toDto(ficha: FichaEntity): FichaDto {
    return {
      ...ficha,
      jornadas: this.cloneJornadas(ficha.jornadas),
      liderHistorial: ficha.liderHistorial.map((assignment) => ({
        ...assignment,
        fechaInicio: this.formatDate(assignment.fechaInicio),
        fechaFin: assignment.fechaFin
          ? this.formatDate(assignment.fechaFin)
          : null,
        createdAt: assignment.createdAt.toISOString(),
      })),
      seguimientos: ficha.seguimientos.map((seguimiento) => ({
        ...seguimiento,
        programaciones: seguimiento.programaciones.map((programacion) => ({
          ...programacion,
          bloques: programacion.bloques.map((bloque) => ({ ...bloque })),
          fechaInicio: this.formatDate(programacion.fechaInicio),
          fechaFin: this.formatDate(programacion.fechaFin),
          createdAt: programacion.createdAt.toISOString(),
          updatedAt: programacion.updatedAt.toISOString(),
        })),
        novedades: seguimiento.novedades.map((novedad) => ({
          ...novedad,
          fecha: this.formatDate(novedad.fecha),
          createdAt: novedad.createdAt.toISOString(),
          updatedAt: novedad.updatedAt.toISOString(),
        })),
      })),
      fechaInicio: this.formatDate(ficha.fechaInicio),
      fechaFinLectiva: this.formatDate(ficha.fechaFinLectiva),
      fechaFinPractica: this.formatDate(ficha.fechaFinPractica),
      createdAt: ficha.createdAt.toISOString(),
      updatedAt: ficha.updatedAt.toISOString(),
    };
  }
}

export const fichaService = new FichaService();
