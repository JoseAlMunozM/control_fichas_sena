"use client";

import {
  Badge,
  Button,
  Table,
  type TableColumn,
} from "@/components/ui";

import type { InstructorDto } from "../types";

export interface InstructorTableProps {
  instructores: readonly InstructorDto[];
  disabled?: boolean;
  onEdit: (instructor: InstructorDto) => void;
  onDelete: (instructor: InstructorDto) => void;
}

export function InstructorTable({
  disabled = false,
  instructores,
  onDelete,
  onEdit,
}: InstructorTableProps) {
  const columns: readonly TableColumn<InstructorDto>[] = [
    {
      id: "nombre",
      header: "Instructor",
      render: (instructor) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {instructor.nombre}
        </span>
      ),
    },
    {
      id: "correo",
      header: "Correo institucional",
      render: (instructor) => instructor.correo,
    },
    {
      id: "telefono",
      header: "Teléfono",
      render: (instructor) => instructor.telefono ?? "Sin registrar",
    },
    {
      id: "estado",
      header: "Estado",
      render: (instructor) => (
        <Badge variant={instructor.estado ? "success" : "neutral"}>
          {instructor.estado ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "whitespace-nowrap text-right",
      render: (instructor) => (
        <div className="flex justify-end gap-2">
          <Button
            disabled={disabled}
            onClick={() => onEdit(instructor)}
            size="sm"
            variant="ghost"
          >
            Editar
          </Button>
          <Button
            disabled={disabled}
            onClick={() => onDelete(instructor)}
            size="sm"
            variant="danger"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      caption="Listado de instructores"
      columns={columns}
      data={instructores}
      getRowKey={(instructor) => instructor.id}
    />
  );
}
