export type ProrrogaEstado = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface ProrrogaEntity {
  id: string;
  fichaId: string;
  fichaNumero: string;
  programaNombre: string;
  municipio: string;
  fechaInicio: Date;
  fechaFinLectivaAnterior: Date;
  fechaFinPracticaAnterior: Date;
  fechaFinLectivaNueva: Date;
  fechaFinPracticaNueva: Date;
  motivo: string;
  estado: ProrrogaEstado;
  observacionRespuesta: string | null;
  solicitadoPorId: string;
  solicitadoPorNombre: string;
  resueltoPorId: string | null;
  resueltoPorNombre: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
