export interface ProgramaEntity {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  createdAt: Date;
  updatedAt: Date;
}
