export interface InstructorEntity {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  estado: boolean;
  observaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}
