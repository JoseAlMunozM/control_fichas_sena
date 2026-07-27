import { DEFAULT_LOCALE } from "@/constants";

type DateValue = Date | string | number;

export function formatDate(
  value: DateValue,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
  locale = DEFAULT_LOCALE,
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
