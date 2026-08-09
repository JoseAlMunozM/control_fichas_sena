import { DIA_SEMANA, DIA_SEMANA_LABELS } from "../constants";
import type { DiaSemana, JornadaFormacion } from "../types";

const dayOrder = Object.values(DIA_SEMANA);

export function formatFichaDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return "";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatDays(days: readonly DiaSemana[]): string {
  const sortedDays = [...days].sort(
    (first, second) => dayOrder.indexOf(first) - dayOrder.indexOf(second),
  );
  const isMondayToFriday =
    sortedDays.length === 5 &&
    sortedDays.every((day, index) => day === dayOrder[index]);

  return isMondayToFriday
    ? "Lunes a viernes"
    : sortedDays.map((day) => DIA_SEMANA_LABELS[day]).join(", ");
}

export function formatFichaSchedule(
  jornadas: readonly JornadaFormacion[],
): string {
  const groups = new Map<string, DiaSemana[]>();

  jornadas.forEach((jornada) => {
    const key = `${jornada.horaInicio}|${jornada.horaFin}`;
    const days = groups.get(key) ?? [];

    days.push(jornada.dia);
    groups.set(key, days);
  });

  return [...groups.entries()]
    .map(([key, days]) => {
      const [startTime, endTime] = key.split("|");

      return `${formatDays(days)} · ${startTime}–${endTime}`;
    })
    .join(" / ");
}
