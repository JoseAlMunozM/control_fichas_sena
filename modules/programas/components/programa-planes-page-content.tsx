"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Select,
} from "@/components/ui";

import {
  deletePlanFormacionAction,
  removePlanCompetenciaAction,
} from "../actions";
import type {
  PlanCompetenciaEntity,
  PlanFormacionDto,
  ProgramaDto,
} from "../types";
import { ProgramaCompetenciaFormModal } from "./programa-competencia-form-modal";
import { ProgramaCompetenciaTable } from "./programa-competencia-table";
import { ProgramaPlanFormModal } from "./programa-plan-form-modal";

type PlanModalState =
  | { mode: "create" }
  | { mode: "edit"; plan: PlanFormacionDto }
  | null;

type CompetenciaModalState =
  | { mode: "create" }
  | { mode: "edit"; competencia: PlanCompetenciaEntity }
  | null;

type DeleteTarget =
  | { type: "plan"; plan: PlanFormacionDto }
  | {
      type: "competencia";
      planId: string;
      competencia: PlanCompetenciaEntity;
    }
  | null;

export interface ProgramaPlanesPageContentProps {
  initialData: ProgramaDto;
}

export function ProgramaPlanesPageContent({
  initialData,
}: ProgramaPlanesPageContentProps) {
  const initialPlan =
    initialData.planes.find((plan) => plan.estado) ??
    initialData.planes[0];
  const [programa, setPrograma] = useState(initialData);
  const [selectedPlanId, setSelectedPlanId] = useState(
    initialPlan?.id ?? "",
  );
  const [planModal, setPlanModal] = useState<PlanModalState>(null);
  const [competenciaModal, setCompetenciaModal] =
    useState<CompetenciaModalState>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<DeleteTarget>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlan =
    programa.planes.find((plan) => plan.id === selectedPlanId) ??
    programa.planes[0];

  const handleProgramUpdated = (updatedPrograma: ProgramaDto) => {
    setPrograma(updatedPrograma);
    setErrorMessage(null);

    if (!updatedPrograma.planes.some((plan) => plan.id === selectedPlanId)) {
      const nextPlan =
        updatedPrograma.planes.find((plan) => plan.estado) ??
        updatedPrograma.planes[0];
      setSelectedPlanId(nextPlan?.id ?? "");
    }
  };

  const handlePlanSaved = (updatedPrograma: ProgramaDto) => {
    handleProgramUpdated(updatedPrograma);
    const activePlan = updatedPrograma.planes.find((plan) => plan.estado);

    if (activePlan) setSelectedPlanId(activePlan.id);
    setPlanModal(null);
  };

  const handleCompetenciaSaved = (updatedPrograma: ProgramaDto) => {
    handleProgramUpdated(updatedPrograma);
    setCompetenciaModal(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result =
        deleteTarget.type === "plan"
          ? await deletePlanFormacionAction(
              programa.id,
              deleteTarget.plan.id,
            )
          : await removePlanCompetenciaAction(
              programa.id,
              deleteTarget.planId,
              deleteTarget.competencia.id,
            );

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      handleProgramUpdated(result.value.data);
      setDeleteTarget(null);
    } catch {
      setErrorMessage("No fue posible completar la eliminación.");
    } finally {
      setIsDeleting(false);
    }
  };

  const planOptions = programa.planes.map((plan) => ({
    label: `${plan.version}${plan.estado ? " · Activo" : ""}`,
    value: plan.id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            href="/programas"
          >
            ← Volver a programas
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {programa.nombre}
            </h1>
            <Badge variant={programa.estado ? "success" : "neutral"}>
              {programa.estado ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Código {programa.codigo} · Administra sus versiones y competencias.
          </p>
        </div>
        <Button onClick={() => setPlanModal({ mode: "create" })}>
          Nueva versión
        </Button>
      </div>

      {errorMessage ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-red-700 dark:text-red-300" role="alert">
              {errorMessage}
            </p>
            <Button
              onClick={() => setErrorMessage(null)}
              size="sm"
              variant="ghost"
            >
              Cerrar
            </Button>
          </div>
        </Card>
      ) : null}

      {selectedPlan ? (
        <>
          <Card
            description="Las fichas nuevas utilizarán la versión activa. Las fichas existentes conservarán su versión asignada."
            title="Plan de formación"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <Select
                containerClassName="max-w-sm"
                label="Versión"
                onChange={(event) => setSelectedPlanId(event.target.value)}
                options={planOptions}
                value={selectedPlan.id}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    setPlanModal({ mode: "edit", plan: selectedPlan })
                  }
                  variant="secondary"
                >
                  Editar versión
                </Button>
                <Button
                  onClick={() =>
                    setDeleteTarget({ type: "plan", plan: selectedPlan })
                  }
                  variant="danger"
                >
                  Eliminar versión
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950/50">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Estado
                </p>
                <div className="mt-2">
                  <Badge variant={selectedPlan.estado ? "success" : "neutral"}>
                    {selectedPlan.estado ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950/50">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Competencias
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedPlan.competencias.length}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950/50">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Horas totales
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedPlan.totalHoras}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Competencias
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Las horas se definen aquí y no se duplicarán en la programación.
              </p>
            </div>
            <Button
              onClick={() => setCompetenciaModal({ mode: "create" })}
            >
              Agregar competencia
            </Button>
          </div>

          <ProgramaCompetenciaTable
            competencias={selectedPlan.competencias}
            disabled={isDeleting}
            onEdit={(competencia) =>
              setCompetenciaModal({ mode: "edit", competencia })
            }
            onRemove={(competencia) =>
              setDeleteTarget({
                type: "competencia",
                planId: selectedPlan.id,
                competencia,
              })
            }
          />
        </>
      ) : (
        <EmptyState
          action={
            <Button onClick={() => setPlanModal({ mode: "create" })}>
              Crear primera versión
            </Button>
          }
          description="Crea una versión para agregar las competencias que recibirán las fichas nuevas."
          title="El programa no tiene planes"
        />
      )}

      {planModal ? (
        <ProgramaPlanFormModal
          key={
            planModal.mode === "edit"
              ? planModal.plan.id
              : "create-plan"
          }
          onClose={() => setPlanModal(null)}
          onSaved={handlePlanSaved}
          plan={planModal.mode === "edit" ? planModal.plan : undefined}
          programaId={programa.id}
        />
      ) : null}

      {competenciaModal && selectedPlan ? (
        <ProgramaCompetenciaFormModal
          key={
            competenciaModal.mode === "edit"
              ? competenciaModal.competencia.id
              : `create-${selectedPlan.id}`
          }
          competencia={
            competenciaModal.mode === "edit"
              ? competenciaModal.competencia
              : undefined
          }
          onClose={() => setCompetenciaModal(null)}
          onSaved={handleCompetenciaSaved}
          planId={selectedPlan.id}
          programaId={programa.id}
        />
      ) : null}

      <ConfirmDialog
        confirmLabel={
          deleteTarget?.type === "plan"
            ? "Eliminar versión"
            : "Quitar competencia"
        }
        description={
          deleteTarget?.type === "plan"
            ? `Se eliminará la versión ${deleteTarget.plan.version} y sus competencias.`
            : deleteTarget?.type === "competencia"
              ? `Se quitará "${deleteTarget.competencia.nombre}" de esta versión del plan.`
              : ""
        }
        isLoading={isDeleting}
        isOpen={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={
          deleteTarget?.type === "plan"
            ? "Eliminar versión del plan"
            : "Quitar competencia"
        }
      />
    </div>
  );
}
