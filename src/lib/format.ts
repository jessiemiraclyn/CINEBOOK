const IST_OFFSET = '+05:30';
const IST_ZONE = 'Asia/Kolkata';

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function todayIst(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: IST_ZONE }).format(new Date());
}

export function addDaysIst(date: string, days: number): string {
  const base = new Date(`${date}T00:00:00${IST_OFFSET}`);
  return new Intl.DateTimeFormat('en-CA', { timeZone: IST_ZONE }).format(
    new Date(base.getTime() + days * 86_400_000),
  );
}

export function formatShowDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00${IST_OFFSET}`));
}

export function formatShowTime(time: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`1970-01-01T${time.slice(0, 8)}${IST_OFFSET}`));
}

export function showStartsAt(date: string, time: string): Date {
  return new Date(`${date}T${time.slice(0, 8)}${IST_OFFSET}`);
}

export function isShowStarted(date: string, time: string): boolean {
  return showStartsAt(date, time).getTime() <= Date.now();
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_ZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}
