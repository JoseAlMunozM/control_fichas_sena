import { DIA_SEMANA_LABELS } from "../constants";
import type { DiaSemana } from "../types";

export function formatFichaDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return "";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatFichaSchedule(
  days: readonly DiaSemana[],
  startTime: string,
  endTime: string,
): string {
  const dayLabels = days.map((day) => DIA_SEMANA_LABELS[day]);
  const daysText =
    dayLabels.length === 5 &&
    days[0] === "LUNES" &&
    days[4] === "VIERNES"
      ? "Lunes a viernes"
      : dayLabels.join(", ");

  return `${daysText} · ${startTime}–${endTime}`;
}
