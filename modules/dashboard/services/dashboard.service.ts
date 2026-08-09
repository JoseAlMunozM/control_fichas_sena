import "server-only";

import { fichaService } from "@/modules/fichas/services";
import { prorrogaService } from "@/modules/prorrogas/services";

import type {
  DashboardCompetenciaDto,
  DashboardDataDto,
} from "../types";

export class DashboardService {
  async getGeneralControl(): Promise<DashboardDataDto> {
    const [fichasResponse, extensions] = await Promise.all([
      fichaService.findAll({ pageSize: 50 }),
      prorrogaService.findAll({ pageSize: 50 }),
    ]);
    const latestExtensionByFicha = new Map<
      string,
      (typeof extensions.data)[number]
    >();

    extensions.data.forEach((extension) => {
      if (!latestExtensionByFicha.has(extension.fichaId)) {
        latestExtensionByFicha.set(extension.fichaId, extension);
      }
    });

    return {
      fichas: fichasResponse.data.map((ficha) => {
        const competencias = ficha.seguimientos.map(
          (seguimiento): DashboardCompetenciaDto => {
            const horasProgramadas = seguimiento.programaciones.reduce(
              (total, programacion) =>
                total + programacion.horasProgramadas,
              0,
            );

            return {
              key: this.getCompetencyKey(
                ficha.programaCodigo,
                seguimiento.competenciaNombre,
              ),
              nombre: seguimiento.competenciaNombre,
              tipo: seguimiento.competenciaTipo,
              estado: seguimiento.estado,
              horasPlan: seguimiento.horasPlan,
              horasProgramadas,
              horasPendientes: Math.max(
                0,
                seguimiento.horasPlan - horasProgramadas,
              ),
              novedades: seguimiento.novedades.length,
              programaciones: seguimiento.programaciones.map(
                (programacion) => ({
                  id: programacion.id,
                  instructorNombre: programacion.instructorNombre,
                  fechaInicio: programacion.fechaInicio,
                  fechaFin: programacion.fechaFin,
                  bloques: programacion.bloques.map((bloque) => ({
                    ...bloque,
                  })),
                }),
              ),
            };
          },
        );
        const latestExtension = latestExtensionByFicha.get(ficha.id);

        return {
          id: ficha.id,
          numero: ficha.numero,
          programaId: ficha.programaId,
          programaCodigo: ficha.programaCodigo,
          programaNombre: ficha.programaNombre,
          planVersion: ficha.planVersion,
          municipio: ficha.municipio,
          sede: ficha.sede,
          jornadas: ficha.jornadas.map((jornada) => ({ ...jornada })),
          fechaInicio: ficha.fechaInicio,
          fechaFinLectiva: ficha.fechaFinLectiva,
          fechaFinPractica: ficha.fechaFinPractica,
          estado: ficha.estado,
          instructorLiderNombre: ficha.instructorLiderNombre,
          observaciones: ficha.observaciones,
          competencias,
          totalNovedades: competencias.reduce(
            (total, competencia) => total + competencia.novedades,
            0,
          ),
          prorroga: latestExtension
            ? {
                estado: latestExtension.estado,
                fechaFinLectivaNueva:
                  latestExtension.fechaFinLectivaNueva,
                fechaFinPracticaNueva:
                  latestExtension.fechaFinPracticaNueva,
              }
            : null,
        };
      }),
    };
  }

  private getCompetencyKey(programCode: string, name: string): string {
    const normalizedName = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLocaleLowerCase("es");

    return `${programCode}:${normalizedName}`;
  }
}

export const dashboardService = new DashboardService();
