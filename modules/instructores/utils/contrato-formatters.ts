import type {
  ContratoInstructorDto,
  InstructorDto,
} from "../types";

export function formatContractDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return "";

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function addContractDays(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

export function getSuggestedContractStart(
  instructor: InstructorDto,
): string {
  const latestContract = [...instructor.contratos].sort((first, second) =>
    second.fechaFin.localeCompare(first.fechaFin),
  )[0];

  return latestContract ? addContractDays(latestContract.fechaFin, 1) : "";
}

export function getDisplayedContract(
  contracts: readonly ContratoInstructorDto[],
  today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
  }).format(new Date()),
): ContratoInstructorDto | null {
  const current = contracts.find(
    (contract) =>
      contract.fechaInicio <= today && contract.fechaFin >= today,
  );

  if (current) return current;

  const upcoming = [...contracts]
    .filter((contract) => contract.fechaInicio > today)
    .sort((first, second) =>
      first.fechaInicio.localeCompare(second.fechaInicio),
    )[0];

  return upcoming ?? contracts[0] ?? null;
}
