-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COORDINATOR', 'INSTRUCTOR', 'USER');

-- CreateEnum
CREATE TYPE "CompetenciaTipo" AS ENUM ('TECNICA', 'TRANSVERSAL', 'PRACTICA');

-- CreateEnum
CREATE TYPE "FichaEstado" AS ENUM ('PLANEADA', 'EN_FORMACION', 'ETAPA_PRACTICA', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "SeguimientoCompetenciaEstado" AS ENUM ('PENDIENTE', 'PROGRAMADA', 'EN_EJECUCION', 'FINALIZADA', 'SUSPENDIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "NovedadCompetenciaTipo" AS ENUM ('OBSERVACION', 'REPROGRAMACION', 'CAMBIO_INSTRUCTOR', 'SUSPENSION', 'OTRA');

-- CreateEnum
CREATE TYPE "ProrrogaEstado" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "correo" VARCHAR(254) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programa" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" VARCHAR(1000),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanFormacion" (
    "id" UUID NOT NULL,
    "programaId" UUID NOT NULL,
    "version" VARCHAR(30) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanFormacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanCompetencia" (
    "id" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "norma" VARCHAR(500) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipo" "CompetenciaTipo" NOT NULL,
    "horas" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanCompetencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" UUID NOT NULL,
    "usuarioId" UUID,
    "nombre" VARCHAR(150) NOT NULL,
    "correo" VARCHAR(254) NOT NULL,
    "telefono" VARCHAR(30),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ficha" (
    "id" UUID NOT NULL,
    "numero" VARCHAR(30) NOT NULL,
    "programaId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "sede" VARCHAR(150),
    "modalidad" VARCHAR(100),
    "fechaInicio" DATE NOT NULL,
    "fechaFinLectiva" DATE NOT NULL,
    "fechaFinPractica" DATE NOT NULL,
    "estado" "FichaEstado" NOT NULL DEFAULT 'PLANEADA',
    "instructorLiderId" UUID NOT NULL,
    "observaciones" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ficha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaJornada" (
    "id" UUID NOT NULL,
    "fichaId" UUID NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFin" VARCHAR(5) NOT NULL,

    CONSTRAINT "FichaJornada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaSeguimiento" (
    "id" UUID NOT NULL,
    "fichaId" UUID NOT NULL,
    "competenciaId" UUID,
    "competenciaNombre" VARCHAR(150) NOT NULL,
    "competenciaNorma" VARCHAR(500) NOT NULL,
    "competenciaTipo" "CompetenciaTipo" NOT NULL,
    "horasPlan" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "estado" "SeguimientoCompetenciaEstado" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FichaSeguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramacionCompetencia" (
    "id" UUID NOT NULL,
    "seguimientoId" UUID NOT NULL,
    "instructorId" UUID NOT NULL,
    "instructorNombre" VARCHAR(150) NOT NULL,
    "instructorCorreo" VARCHAR(254) NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "horasProgramadas" DOUBLE PRECISION NOT NULL,
    "registradoPorId" UUID,
    "registradoPorNombre" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramacionCompetencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramacionBloque" (
    "id" UUID NOT NULL,
    "programacionId" UUID NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFin" VARCHAR(5) NOT NULL,

    CONSTRAINT "ProgramacionBloque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NovedadCompetencia" (
    "id" UUID NOT NULL,
    "seguimientoId" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "tipo" "NovedadCompetenciaTipo" NOT NULL,
    "descripcion" VARCHAR(1000) NOT NULL,
    "registradoPorId" UUID,
    "registradoPorNombre" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NovedadCompetencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaLiderAsignacion" (
    "id" UUID NOT NULL,
    "fichaId" UUID NOT NULL,
    "instructorId" UUID NOT NULL,
    "instructorNombre" VARCHAR(150) NOT NULL,
    "instructorCorreo" VARCHAR(254),
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE,
    "motivo" VARCHAR(500),
    "asignadoPorId" UUID,
    "asignadoPorNombre" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FichaLiderAsignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prorroga" (
    "id" UUID NOT NULL,
    "fichaId" UUID NOT NULL,
    "fichaNumero" VARCHAR(30) NOT NULL,
    "programaNombre" VARCHAR(150) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFinLectivaAnterior" DATE NOT NULL,
    "fechaFinPracticaAnterior" DATE NOT NULL,
    "fechaFinLectivaNueva" DATE NOT NULL,
    "fechaFinPracticaNueva" DATE NOT NULL,
    "motivo" VARCHAR(1000) NOT NULL,
    "estado" "ProrrogaEstado" NOT NULL DEFAULT 'PENDIENTE',
    "observacionRespuesta" VARCHAR(1000),
    "solicitadoPorId" UUID,
    "solicitadoPorNombre" VARCHAR(150) NOT NULL,
    "resueltoPorId" UUID,
    "resueltoPorNombre" VARCHAR(150),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prorroga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE INDEX "Usuario_estado_role_idx" ON "Usuario"("estado", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Programa_codigo_key" ON "Programa"("codigo");

-- CreateIndex
CREATE INDEX "Programa_estado_nombre_idx" ON "Programa"("estado", "nombre");

-- CreateIndex
CREATE INDEX "PlanFormacion_programaId_estado_idx" ON "PlanFormacion"("programaId", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "PlanFormacion_programaId_version_key" ON "PlanFormacion"("programaId", "version");

-- CreateIndex
CREATE INDEX "PlanCompetencia_planId_tipo_idx" ON "PlanCompetencia"("planId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "PlanCompetencia_planId_nombre_key" ON "PlanCompetencia"("planId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PlanCompetencia_planId_norma_key" ON "PlanCompetencia"("planId", "norma");

-- CreateIndex
CREATE UNIQUE INDEX "PlanCompetencia_planId_orden_key" ON "PlanCompetencia"("planId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_usuarioId_key" ON "Instructor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_correo_key" ON "Instructor"("correo");

-- CreateIndex
CREATE INDEX "Instructor_estado_nombre_idx" ON "Instructor"("estado", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Ficha_numero_key" ON "Ficha"("numero");

-- CreateIndex
CREATE INDEX "Ficha_programaId_estado_idx" ON "Ficha"("programaId", "estado");

-- CreateIndex
CREATE INDEX "Ficha_instructorLiderId_estado_idx" ON "Ficha"("instructorLiderId", "estado");

-- CreateIndex
CREATE INDEX "Ficha_fechaInicio_fechaFinPractica_idx" ON "Ficha"("fechaInicio", "fechaFinPractica");

-- CreateIndex
CREATE INDEX "FichaJornada_dia_horaInicio_horaFin_idx" ON "FichaJornada"("dia", "horaInicio", "horaFin");

-- CreateIndex
CREATE UNIQUE INDEX "FichaJornada_fichaId_dia_key" ON "FichaJornada"("fichaId", "dia");

-- CreateIndex
CREATE INDEX "FichaSeguimiento_fichaId_estado_idx" ON "FichaSeguimiento"("fichaId", "estado");

-- CreateIndex
CREATE INDEX "FichaSeguimiento_competenciaId_idx" ON "FichaSeguimiento"("competenciaId");

-- CreateIndex
CREATE UNIQUE INDEX "FichaSeguimiento_fichaId_orden_key" ON "FichaSeguimiento"("fichaId", "orden");

-- CreateIndex
CREATE INDEX "ProgramacionCompetencia_seguimientoId_fechaInicio_fechaFin_idx" ON "ProgramacionCompetencia"("seguimientoId", "fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "ProgramacionCompetencia_instructorId_fechaInicio_fechaFin_idx" ON "ProgramacionCompetencia"("instructorId", "fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "ProgramacionBloque_programacionId_dia_idx" ON "ProgramacionBloque"("programacionId", "dia");

-- CreateIndex
CREATE INDEX "NovedadCompetencia_seguimientoId_fecha_idx" ON "NovedadCompetencia"("seguimientoId", "fecha");

-- CreateIndex
CREATE INDEX "FichaLiderAsignacion_fichaId_fechaInicio_idx" ON "FichaLiderAsignacion"("fichaId", "fechaInicio");

-- CreateIndex
CREATE INDEX "FichaLiderAsignacion_instructorId_fechaInicio_idx" ON "FichaLiderAsignacion"("instructorId", "fechaInicio");

-- CreateIndex
CREATE INDEX "Prorroga_fichaId_estado_idx" ON "Prorroga"("fichaId", "estado");

-- CreateIndex
CREATE INDEX "Prorroga_estado_createdAt_idx" ON "Prorroga"("estado", "createdAt");

-- AddForeignKey
ALTER TABLE "PlanFormacion" ADD CONSTRAINT "PlanFormacion_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "Programa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCompetencia" ADD CONSTRAINT "PlanCompetencia_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PlanFormacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ficha" ADD CONSTRAINT "Ficha_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "Programa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ficha" ADD CONSTRAINT "Ficha_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PlanFormacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ficha" ADD CONSTRAINT "Ficha_instructorLiderId_fkey" FOREIGN KEY ("instructorLiderId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaJornada" ADD CONSTRAINT "FichaJornada_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaSeguimiento" ADD CONSTRAINT "FichaSeguimiento_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaSeguimiento" ADD CONSTRAINT "FichaSeguimiento_competenciaId_fkey" FOREIGN KEY ("competenciaId") REFERENCES "PlanCompetencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionCompetencia" ADD CONSTRAINT "ProgramacionCompetencia_seguimientoId_fkey" FOREIGN KEY ("seguimientoId") REFERENCES "FichaSeguimiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionCompetencia" ADD CONSTRAINT "ProgramacionCompetencia_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionCompetencia" ADD CONSTRAINT "ProgramacionCompetencia_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramacionBloque" ADD CONSTRAINT "ProgramacionBloque_programacionId_fkey" FOREIGN KEY ("programacionId") REFERENCES "ProgramacionCompetencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NovedadCompetencia" ADD CONSTRAINT "NovedadCompetencia_seguimientoId_fkey" FOREIGN KEY ("seguimientoId") REFERENCES "FichaSeguimiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NovedadCompetencia" ADD CONSTRAINT "NovedadCompetencia_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaLiderAsignacion" ADD CONSTRAINT "FichaLiderAsignacion_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaLiderAsignacion" ADD CONSTRAINT "FichaLiderAsignacion_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaLiderAsignacion" ADD CONSTRAINT "FichaLiderAsignacion_asignadoPorId_fkey" FOREIGN KEY ("asignadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prorroga" ADD CONSTRAINT "Prorroga_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prorroga" ADD CONSTRAINT "Prorroga_solicitadoPorId_fkey" FOREIGN KEY ("solicitadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prorroga" ADD CONSTRAINT "Prorroga_resueltoPorId_fkey" FOREIGN KEY ("resueltoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
