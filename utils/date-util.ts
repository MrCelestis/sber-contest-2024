export function formatUtcDate(date: Date | number): string {
  const currentYear = new Date().getFullYear();
  const localDate = utcDateToLocal(new Date(date));
  return localDate.toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: currentYear === localDate.getFullYear() ? undefined : "2-digit",
  });
}

export function formatUtcMonth(date: Date | number): string {
  const currentYear = new Date().getFullYear();
  const localDate = utcDateToLocal(new Date(date));
  return localDate.toLocaleString("default", {
    month: "long",
    year: currentYear === localDate.getFullYear() ? undefined : "2-digit",
  });
}

export function formatUtcDateRange(range: [Date, Date] | null) {
  if (!range) {
    return "";
  }
  return range.map(formatUtcDate).join(" - ");
}

export function utcDateToLocal(value: Date): Date {
  return new Date(value.getTime() + value.getTimezoneOffset() * 60 * 1000);
}

export function localDateToUtc(value: Date): Date {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60 * 1000);
}
