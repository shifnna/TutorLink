const DAY_INDEX = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function toTimeStr(minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function dateToStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return dateToStr(new Date());
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < todayStr();
}

export function weekdayOf(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return DAY_INDEX[d.getDay()];
}

export function getOccurrenceDates(startDate: string, endDate: string, weekdays: string[]): { date: string; day: string }[] {
  const list: { date: string; day: string }[] = [];
  const weekdaySet = new Set(weekdays);
  let cur = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (cur <= end) {
    const dayName = DAY_INDEX[cur.getDay()];
    if (weekdaySet.has(dayName)) list.push({ date: dateToStr(cur), day: dayName });
    cur.setDate(cur.getDate() + 1);
  }
  return list;
}