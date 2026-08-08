import type {
  CreateProgramacionBloqueDto,
  DiaSemana,
} from "../types";

const jsDayByWeekday: Record<DiaSemana, number> = {
  DOMINGO: 0,
  LUNES: 1,
  MARTES: 2,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  SABADO: 6,
};

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

export function calculateBlockHours(
  startDate: string,
  endDate: string,
  block: CreateProgramacionBloqueDto,
): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const targetDay = jsDayByWeekday[block.dia];
  const durationMinutes =
    timeToMinutes(block.horaFin) - timeToMinutes(block.horaInicio);

  if (durationMinutes <= 0 || end < start) return 0;

  let occurrences = 0;
  const current = new Date(start);

  while (current <= end) {
    if (current.getUTCDay() === targetDay) occurrences += 1;
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return (occurrences * durationMinutes) / 60;
}

export function calculateProgrammedHours(
  startDate: string,
  endDate: string,
  blocks: readonly CreateProgramacionBloqueDto[],
): number {
  return blocks.reduce(
    (total, block) => total + calculateBlockHours(startDate, endDate, block),
    0,
  );
}

export function schedulesOverlap(
  firstStartDate: string,
  firstEndDate: string,
  firstBlock: CreateProgramacionBloqueDto,
  secondStartDate: string,
  secondEndDate: string,
  secondBlock: CreateProgramacionBloqueDto,
): boolean {
  if (firstBlock.dia !== secondBlock.dia) return false;

  const overlapStart =
    firstStartDate > secondStartDate ? firstStartDate : secondStartDate;
  const overlapEnd =
    firstEndDate < secondEndDate ? firstEndDate : secondEndDate;

  if (overlapStart > overlapEnd) return false;

  const hasOccurrence =
    calculateBlockHours(overlapStart, overlapEnd, {
      ...firstBlock,
      horaInicio: "00:00",
      horaFin: "01:00",
    }) > 0;
  const timesOverlap =
    firstBlock.horaInicio < secondBlock.horaFin &&
    secondBlock.horaInicio < firstBlock.horaFin;

  return hasOccurrence && timesOverlap;
}
