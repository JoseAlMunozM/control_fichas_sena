"use client";

import { useState, type FormEvent } from "react";

import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  Pagination,
  SearchInput,
} from "@/components/ui";

import {
  createInstructorAction,
  deleteInstructorAction,
  findAllInstructoresAction,
  updateInstructorAction,
} from "../actions";
import type {
  InstructorDto,
  InstructorFilters,
  InstructoresResponse,
} from "../types";
import {
  InstructorContractModal,
} from "./instructor-contract-modal";
import {
  emptyInstructorForm,
  InstructorForm,
  type InstructorFormErrors,
  type InstructorFormValue,
} from "./instructor-form";
import { InstructorTable } from "./instructor-table";

export interface InstructoresPageContentProps {
  initialData: InstructoresResponse;
}

export function InstructoresPageContent({
  initialData,
}: InstructoresPageContentProps) {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<InstructorFilters>({
    page: initialData.pagination.page,
    pageSize: initialData.pagination.pageSize,
  });
  const [formValue, setFormValue] = useState<InstructorFormValue>({
    ...emptyInstructorForm,
  });
  const [formErrors, setFormErrors] = useState<InstructorFormErrors>({});
  const [editingInstructor, setEditingInstructor] =
    useState<InstructorDto | null>(null);
  const [deletingInstructor, setDeletingInstructor] =
    useState<InstructorDto | null>(null);
  const [contractInstructor, setContractInstructor] =
    useState<InstructorDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = async (nextFilters: InstructorFilters) => {
    setIsLoading(true);

    try {
      const result = await findAllInstructoresAction(nextFilters);

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setData(result.value);
      setFilters({
        ...nextFilters,
        page: result.value.pagination.page,
        pageSize: result.value.pagination.pageSize,
      });
      setErrorMessage(null);
    } catch {
      setErrorMessage("No fue posible cargar los instructores.");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingInstructor(null);
    setFormValue({ ...emptyInstructorForm });
    setFormErrors({});
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEdit = (instructor: InstructorDto) => {
    setEditingInstructor(instructor);
    setFormValue({
      nombre: instructor.nombre,
      correo: instructor.correo,
      telefono: instructor.telefono,
      observaciones: instructor.observaciones,
      fechaInicioContrato: "",
      fechaFinContrato: "",
    });
    setFormErrors({});
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingInstructor(null);
      setErrorMessage(null);
    }
  };

  const updateForm = <Key extends keyof InstructorFormValue>(
    field: Key,
    value: InstructorFormValue[Key],
  ) => {
    setFormValue((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setErrorMessage(null);

    try {
      const result = editingInstructor
        ? await updateInstructorAction(editingInstructor.id, {
            nombre: formValue.nombre,
            correo: formValue.correo,
            telefono: formValue.telefono,
            observaciones: formValue.observaciones,
          })
        : await createInstructorAction(formValue);

      if (!result.success) {
        setErrorMessage(result.error.message);
        setFormErrors(
          Object.fromEntries(
            Object.entries(result.error.fieldErrors ?? {}).map(
              ([field, messages]) => [field, messages?.[0]],
            ),
          ) as InstructorFormErrors,
        );
        return;
      }

      setIsModalOpen(false);
      setEditingInstructor(null);
      await refresh(filters);
    } catch {
      setErrorMessage("No fue posible guardar el instructor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingInstructor) return;

    setIsDeleting(true);

    try {
      const result = await deleteInstructorAction(deletingInstructor.id);

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setDeletingInstructor(null);
      await refresh(filters);
    } catch {
      setErrorMessage("No fue posible eliminar el instructor.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Instructores
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Administra instructores, contratos y disponibilidad para las programaciones.
          </p>
        </div>
        <Button onClick={openCreate}>Nuevo instructor</Button>
      </div>

      {errorMessage && !isModalOpen ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {errorMessage}
          </p>
        </Card>
      ) : null}

      <Card title="Buscar">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <SearchInput
            disabled={isLoading}
            label="Nombre, correo o teléfono"
            onValueChange={(search) =>
              setFilters((current) => ({ ...current, search }))
            }
            value={filters.search ?? ""}
          />
          <Button
            isLoading={isLoading}
            onClick={() => void refresh({ ...filters, page: 1 })}
          >
            Buscar
          </Button>
        </div>
      </Card>

      {data.data.length > 0 ? (
        <InstructorTable
          disabled={isDeleting}
          instructores={data.data}
          onDelete={setDeletingInstructor}
          onEdit={openEdit}
          onManageContracts={setContractInstructor}
        />
      ) : (
        <EmptyState
          action={<Button onClick={openCreate}>Crear instructor</Button>}
          description="Registra instructores antes de programar competencias."
          title="No hay instructores registrados"
        />
      )}

      <Pagination
        currentPage={data.pagination.page}
        disabled={isLoading}
        onPageChange={(page) => void refresh({ ...filters, page })}
        totalPages={data.pagination.totalPages}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
        title={editingInstructor ? "Editar instructor" : "Crear instructor"}
      >
        {errorMessage ? (
          <p
            className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
        <InstructorForm
          errors={formErrors}
          isEditing={editingInstructor !== null}
          isSubmitting={isSubmitting}
          onCancel={closeModal}
          onChange={updateForm}
          onSubmit={handleSubmit}
          value={formValue}
        />
      </Modal>

      {contractInstructor ? (
        <InstructorContractModal
          instructor={contractInstructor}
          onClose={() => setContractInstructor(null)}
          onSaved={() => {
            setContractInstructor(null);
            void refresh(filters);
          }}
        />
      ) : null}

      <ConfirmDialog
        confirmLabel="Eliminar instructor"
        description={
          deletingInstructor
            ? `Se eliminará el instructor ${deletingInstructor.nombre}.`
            : ""
        }
        isLoading={isDeleting}
        isOpen={deletingInstructor !== null}
        onCancel={() => setDeletingInstructor(null)}
        onConfirm={handleDelete}
        title="Eliminar instructor"
      />
    </div>
  );
}
