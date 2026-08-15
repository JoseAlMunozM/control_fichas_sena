CREATE TABLE "ContratoInstructor" (
    "id" UUID NOT NULL,
    "instructorId" UUID NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContratoInstructor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContratoInstructor_instructorId_fechaInicio_fechaFin_key"
ON "ContratoInstructor"("instructorId", "fechaInicio", "fechaFin");

CREATE INDEX "ContratoInstructor_instructorId_fechaInicio_fechaFin_idx"
ON "ContratoInstructor"("instructorId", "fechaInicio", "fechaFin");

CREATE INDEX "ContratoInstructor_fechaFin_idx"
ON "ContratoInstructor"("fechaFin");

ALTER TABLE "ContratoInstructor"
ADD CONSTRAINT "ContratoInstructor_instructorId_fkey"
FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
