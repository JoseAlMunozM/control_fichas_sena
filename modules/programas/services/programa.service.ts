import "server-only";

import { randomUUID } from "node:crypto";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/constants";

import {
  COMPETENCIA_TIPO,
  PROGRAMA_SERVICE_MESSAGES,
} from "../constants";
import type {
  CreatePlanCompetenciaDto,
  CreatePlanFormacionDto,
  CreateProgramaDto,
  PlanFormacionDto,
  PlanFormacionEntity,
  ProgramaDto,
  ProgramaEntity,
  ProgramaErrorCode,
  ProgramaFilters,
  ProgramaResponse,
  ProgramasResponse,
  UpdatePlanCompetenciaDto,
  UpdatePlanFormacionDto,
  UpdateProgramaDto,
} from "../types";
import {
  createPlanCompetenciaSchema,
  createPlanFormacionSchema,
  createProgramaSchema,
  updatePlanCompetenciaSchema,
  updatePlanFormacionSchema,
  updateProgramaSchema,
} from "../validators";
import { loadProgramas, saveProgramas } from "./programa.persistence";

const SEED_DATE = new Date("2026-01-01T12:00:00.000Z");

const globalForProgramaStore = globalThis as unknown as {
  programaStore?: ProgramaEntity[];
};

function createPlan(
  version: string,
  competencias: Array<
    Omit<PlanFormacionEntity["competencias"][number], "id" | "orden">
  >,
): PlanFormacionEntity {
  return {
    id: randomUUID(),
    version,
    estado: true,
    competencias: competencias.map((competencia, index) => ({
      ...competencia,
      id: randomUUID(),
      orden: index + 1,
    })),
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  };
}

function createSeedProgramas(): ProgramaEntity[] {
  return [
    {
      id: randomUUID(),
      codigo: "233101",
      nombre: "Técnico en Sistemas",
      descripcion:
        "Programa de formación con competencias técnicas, transversales y etapa práctica.",
      estado: true,
      planes: [
        createPlan("V1", [
          {
            norma: "Resultado de aprendizaje de la inducción",
            nombre: "Inducción",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Utilizar herramientas informáticas de acuerdo con las necesidades de manejo de información",
            nombre: "TIC",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Razonar cuantitativamente frente a situaciones susceptibles de ser abordadas de manera matemática",
            nombre: "Matemáticas",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Aplicar conocimientos de las ciencias naturales de acuerdo con situaciones del contexto productivo y social",
            nombre: "Física",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Aplicar prácticas de protección ambiental, seguridad y salud en el trabajo",
            nombre: "Medio ambiente y SST",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Desarrollar procesos de comunicación eficaces y efectivos",
            nombre: "Comunicación",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Ejercer derechos fundamentales del trabajo en el marco de la constitución política y los convenios internacionales",
            nombre: "Derechos fundamentales",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Interactuar en el contexto productivo y social de acuerdo con principios éticos",
            nombre: "Ética",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Generar hábitos saludables de vida mediante programas de actividad física",
            nombre: "Actividad física",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Gestionar procesos propios de la cultura emprendedora y empresarial",
            nombre: "Cultura emprendedora",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Interactuar en lengua inglesa de forma oral y escrita dentro de contextos sociales y laborales",
            nombre: "Inglés",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 192,
          },
          {
            norma:
              "Mantener equipos de cómputo según procedimiento técnico",
            nombre: "Mantenimiento de equipos",
            tipo: COMPETENCIA_TIPO.TECNICA,
            horas: 240,
          },
          {
            norma:
              "Implementar la red física de datos según diseño y estándares técnicos",
            nombre: "Redes",
            tipo: COMPETENCIA_TIPO.TECNICA,
            horas: 240,
          },
          {
            norma:
              "Atender requerimientos de los clientes de acuerdo con procedimiento técnico y normativa de procesos de negocio",
            nombre: "Atender requerimientos",
            tipo: COMPETENCIA_TIPO.TECNICA,
            horas: 192,
          },
          {
            norma: "Resultados de aprendizaje de la etapa práctica",
            nombre: "Etapa práctica",
            tipo: COMPETENCIA_TIPO.PRACTICA,
            horas: 864,
          },
        ]),
      ],
      createdAt: SEED_DATE,
      updatedAt: SEED_DATE,
    },
    {
      id: randomUUID(),
      codigo: "233108",
      nombre: "Técnico en Sistemas Teleinformáticos",
      descripcion:
        "Programa de formación en mantenimiento, redes y herramientas informáticas.",
      estado: true,
      planes: [
        createPlan("V1", [
          {
            norma: "Resultado de aprendizaje de la inducción",
            nombre: "Inducción",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Aplicar prácticas de protección ambiental, seguridad y salud en el trabajo",
            nombre: "Medio ambiente y SST",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Desarrollar procesos de comunicación eficaces y efectivos",
            nombre: "Comunicación",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma: "Ejercer los derechos fundamentales del trabajo",
            nombre: "Derechos fundamentales",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Interactuar en el contexto productivo y social de acuerdo con principios éticos",
            nombre: "Ética",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma: "Fomentar la cultura emprendedora",
            nombre: "Emprendimiento",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Generar hábitos saludables de vida mediante programas de actividad física",
            nombre: "Actividad física",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 48,
          },
          {
            norma:
              "Interactuar en lengua inglesa de forma oral y escrita dentro de contextos sociales y laborales",
            nombre: "Inglés",
            tipo: COMPETENCIA_TIPO.TRANSVERSAL,
            horas: 192,
          },
          {
            norma:
              "Mantener equipos de cómputo según procedimiento técnico",
            nombre: "Mantenimiento de equipos",
            tipo: COMPETENCIA_TIPO.TECNICA,
            horas: 336,
          },
          {
            norma:
              "Evaluar red de acuerdo con procedimientos de telecomunicaciones y normativa técnica",
            nombre: "Verificación de redes",
            tipo: COMPETENCIA_TIPO.TECNICA,
            horas: 336,
          },
          {
            norma:
              "Operar herramientas informáticas y digitales de acuerdo con protocolos y manuales técnicos",
            nombre: "Herramientas informáticas",
            tipo: COMPETENCIA_TIPO.TECNICA,
            horas: 240,
          },
          {
            norma: "Resultados de aprendizaje de la etapa práctica",
            nombre: "Etapa práctica",
            tipo: COMPETENCIA_TIPO.PRACTICA,
            horas: 864,
          },
        ]),
      ],
      createdAt: SEED_DATE,
      updatedAt: SEED_DATE,
    },
  ];
}

function getProgramaStore(): ProgramaEntity[] {
  globalForProgramaStore.programaStore ??=
    process.env.NODE_ENV === "test" ? createSeedProgramas() : [];

  return globalForProgramaStore.programaStore;
}

async function refreshProgramaStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    globalForProgramaStore.programaStore = await loadProgramas();
  }
}

async function persistProgramaStore(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    await saveProgramas(getProgramaStore());
  }
}

export class ProgramaServiceError extends Error {
  constructor(
    public readonly code: ProgramaErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ProgramaServiceError";
  }
}

export class ProgramaService {
  async findAll(
    filters: ProgramaFilters = {},
  ): Promise<ProgramasResponse> {
    await refreshProgramaStore();
    const { page, pageSize } = this.getPagination(filters);
    const filteredProgramas = getProgramaStore()
      .filter((programa) => this.matchesFilters(programa, filters))
      .sort((first, second) =>
        first.nombre.localeCompare(second.nombre, "es"),
      );
    const totalItems = filteredProgramas.length;

    return {
      data: filteredProgramas
        .slice((page - 1) * pageSize, page * pageSize)
        .map((programa) => this.toDto(programa)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findById(id: string): Promise<ProgramaResponse | null> {
    await refreshProgramaStore();
    const programa = getProgramaStore().find((item) => item.id === id);

    return programa ? { data: this.toDto(programa) } : null;
  }

  async create(input: CreateProgramaDto): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const data = createProgramaSchema.parse(input);
    const store = getProgramaStore();

    this.ensureUniqueCode(data.codigo);

    const now = new Date();
    const programa: ProgramaEntity = {
      id: randomUUID(),
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      estado: data.estado ?? true,
      planes: [],
      createdAt: now,
      updatedAt: now,
    };

    store.push(programa);
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async update(
    id: string,
    input: UpdateProgramaDto,
  ): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const data = updateProgramaSchema.parse(input);
    const programa = this.requirePrograma(id);

    if (data.codigo !== undefined) {
      this.ensureUniqueCode(data.codigo, id);
      programa.codigo = data.codigo;
    }

    if (data.nombre !== undefined) programa.nombre = data.nombre;
    if (data.descripcion !== undefined) {
      programa.descripcion = data.descripcion;
    }
    if (data.estado !== undefined) programa.estado = data.estado;
    programa.updatedAt = new Date();
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async delete(id: string): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const store = getProgramaStore();
    const index = store.findIndex((programa) => programa.id === id);

    if (index < 0) {
      throw new ProgramaServiceError(
        "NOT_FOUND",
        PROGRAMA_SERVICE_MESSAGES.notFound,
      );
    }

    const [programa] = store.splice(index, 1);
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async createPlan(
    programaId: string,
    input: CreatePlanFormacionDto,
  ): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const data = createPlanFormacionSchema.parse(input);
    const programa = this.requirePrograma(programaId);

    this.ensureUniquePlanVersion(programa, data.version);

    const now = new Date();
    const estado = data.estado ?? programa.planes.length === 0;

    if (estado) {
      programa.planes.forEach((plan) => {
        plan.estado = false;
      });
    }

    programa.planes.push({
      id: randomUUID(),
      version: data.version,
      estado,
      competencias: [],
      createdAt: now,
      updatedAt: now,
    });
    programa.updatedAt = now;
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async updatePlan(
    programaId: string,
    planId: string,
    input: UpdatePlanFormacionDto,
  ): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const data = updatePlanFormacionSchema.parse(input);
    const programa = this.requirePrograma(programaId);
    const plan = this.requirePlan(programa, planId);

    if (data.version !== undefined) {
      this.ensureUniquePlanVersion(programa, data.version, planId);
      plan.version = data.version;
    }

    if (data.estado !== undefined) {
      if (data.estado) {
        programa.planes.forEach((item) => {
          item.estado = item.id === planId;
        });
      } else {
        plan.estado = false;
      }
    }

    plan.updatedAt = new Date();
    programa.updatedAt = plan.updatedAt;
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async deletePlan(
    programaId: string,
    planId: string,
  ): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const programa = this.requirePrograma(programaId);
    const index = programa.planes.findIndex((plan) => plan.id === planId);

    if (index < 0) {
      throw new ProgramaServiceError(
        "PLAN_NOT_FOUND",
        PROGRAMA_SERVICE_MESSAGES.planNotFound,
      );
    }

    programa.planes.splice(index, 1);
    programa.updatedAt = new Date();
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async addCompetencia(
    programaId: string,
    planId: string,
    input: CreatePlanCompetenciaDto,
  ): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const data = createPlanCompetenciaSchema.parse(input);
    const programa = this.requirePrograma(programaId);
    const plan = this.requirePlan(programa, planId);

    this.ensureUniqueCompetencia(plan, data.nombre, data.norma);

    plan.competencias.push({
      ...data,
      id: randomUUID(),
      orden: plan.competencias.length + 1,
    });
    plan.updatedAt = new Date();
    programa.updatedAt = plan.updatedAt;
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async updateCompetencia(
    programaId: string,
    planId: string,
    competenciaId: string,
    input: UpdatePlanCompetenciaDto,
  ): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const data = updatePlanCompetenciaSchema.parse(input);
    const programa = this.requirePrograma(programaId);
    const plan = this.requirePlan(programa, planId);
    const competencia = plan.competencias.find(
      (item) => item.id === competenciaId,
    );

    if (!competencia) {
      throw new ProgramaServiceError(
        "COMPETENCY_NOT_FOUND",
        PROGRAMA_SERVICE_MESSAGES.competencyNotFound,
      );
    }

    this.ensureUniqueCompetencia(
      plan,
      data.nombre ?? competencia.nombre,
      data.norma ?? competencia.norma,
      competenciaId,
    );

    Object.assign(competencia, data);
    plan.updatedAt = new Date();
    programa.updatedAt = plan.updatedAt;
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async removeCompetencia(
    programaId: string,
    planId: string,
    competenciaId: string,
  ): Promise<ProgramaResponse> {
    await refreshProgramaStore();
    const programa = this.requirePrograma(programaId);
    const plan = this.requirePlan(programa, planId);
    const index = plan.competencias.findIndex(
      (competencia) => competencia.id === competenciaId,
    );

    if (index < 0) {
      throw new ProgramaServiceError(
        "COMPETENCY_NOT_FOUND",
        PROGRAMA_SERVICE_MESSAGES.competencyNotFound,
      );
    }

    plan.competencias.splice(index, 1);
    plan.competencias.forEach((competencia, orderIndex) => {
      competencia.orden = orderIndex + 1;
    });
    plan.updatedAt = new Date();
    programa.updatedAt = plan.updatedAt;
    await persistProgramaStore();

    return { data: this.toDto(programa) };
  }

  async search(
    search: string,
    filters: Omit<ProgramaFilters, "search"> = {},
  ): Promise<ProgramasResponse> {
    return this.findAll({ ...filters, search });
  }

  async filter(filters: ProgramaFilters): Promise<ProgramasResponse> {
    return this.findAll(filters);
  }

  private requirePrograma(id: string): ProgramaEntity {
    const programa = getProgramaStore().find((item) => item.id === id);

    if (!programa) {
      throw new ProgramaServiceError(
        "NOT_FOUND",
        PROGRAMA_SERVICE_MESSAGES.notFound,
      );
    }

    return programa;
  }

  private requirePlan(
    programa: ProgramaEntity,
    planId: string,
  ): PlanFormacionEntity {
    const plan = programa.planes.find((item) => item.id === planId);

    if (!plan) {
      throw new ProgramaServiceError(
        "PLAN_NOT_FOUND",
        PROGRAMA_SERVICE_MESSAGES.planNotFound,
      );
    }

    return plan;
  }

  private ensureUniqueCode(codigo: string, excludedId?: string): void {
    const normalizedCode = codigo.trim().toLocaleLowerCase("es");
    const exists = getProgramaStore().some(
      (programa) =>
        programa.id !== excludedId &&
        programa.codigo.toLocaleLowerCase("es") === normalizedCode,
    );

    if (exists) {
      throw new ProgramaServiceError(
        "DUPLICATE_CODE",
        PROGRAMA_SERVICE_MESSAGES.duplicateCode,
      );
    }
  }

  private ensureUniquePlanVersion(
    programa: ProgramaEntity,
    version: string,
    excludedId?: string,
  ): void {
    const normalizedVersion = version.trim().toLocaleLowerCase("es");
    const exists = programa.planes.some(
      (plan) =>
        plan.id !== excludedId &&
        plan.version.toLocaleLowerCase("es") === normalizedVersion,
    );

    if (exists) {
      throw new ProgramaServiceError(
        "DUPLICATE_PLAN_VERSION",
        PROGRAMA_SERVICE_MESSAGES.duplicatePlanVersion,
      );
    }
  }

  private ensureUniqueCompetencia(
    plan: PlanFormacionEntity,
    nombre: string,
    norma: string,
    excludedId?: string,
  ): void {
    const normalizedName = nombre.trim().toLocaleLowerCase("es");
    const normalizedNorma = norma.trim().toLocaleLowerCase("es");
    const exists = plan.competencias.some(
      (competencia) =>
        competencia.id !== excludedId &&
        (competencia.nombre.toLocaleLowerCase("es") === normalizedName ||
          competencia.norma.toLocaleLowerCase("es") === normalizedNorma),
    );

    if (exists) {
      throw new ProgramaServiceError(
        "DUPLICATE_COMPETENCY",
        PROGRAMA_SERVICE_MESSAGES.duplicateCompetency,
      );
    }
  }

  private matchesFilters(
    programa: ProgramaEntity,
    filters: ProgramaFilters,
  ): boolean {
    const search = filters.search?.trim().toLocaleLowerCase("es");
    const codigo = filters.codigo?.trim().toLocaleLowerCase("es");
    const nombre = filters.nombre?.trim().toLocaleLowerCase("es");
    const searchableText = [
      programa.codigo,
      programa.nombre,
      programa.descripcion ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase("es");

    return (
      (!search || searchableText.includes(search)) &&
      (!codigo || programa.codigo.toLocaleLowerCase("es").includes(codigo)) &&
      (!nombre || programa.nombre.toLocaleLowerCase("es").includes(nombre)) &&
      (filters.estado === undefined || programa.estado === filters.estado)
    );
  }

  private getPagination(filters: ProgramaFilters) {
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

  private toDto(programa: ProgramaEntity): ProgramaDto {
    return {
      id: programa.id,
      codigo: programa.codigo,
      nombre: programa.nombre,
      descripcion: programa.descripcion,
      estado: programa.estado,
      planes: programa.planes.map((plan) => this.toPlanDto(plan)),
      createdAt: programa.createdAt.toISOString(),
      updatedAt: programa.updatedAt.toISOString(),
    };
  }

  private toPlanDto(plan: PlanFormacionEntity): PlanFormacionDto {
    return {
      id: plan.id,
      version: plan.version,
      estado: plan.estado,
      competencias: plan.competencias.map((competencia) => ({
        ...competencia,
      })),
      totalHoras: plan.competencias.reduce(
        (total, competencia) => total + competencia.horas,
        0,
      ),
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    };
  }
}

export const programaService = new ProgramaService();
