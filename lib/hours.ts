// Pure helpers (no runtime imports). Times are "HH:MM" in 24h, local to America/Mazatlan (Cabo time).
export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type Day = (typeof DAYS)[number];
export type DayHours = { opens: string; closes: string } | null; // null = closed
export type Hours = Record<Day, DayHours>;

export const TIME_ZONE = "America/Mazatlan";
export const DAY_LABEL: Record<Day, string> = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };

/** "09:00" -> "9 am", "18:30" -> "6:30 pm". */
export function formatTime(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${hh >= 12 ? "pm" : "am"}`;
}
export const formatRange = (d: DayHours) => (d ? `${formatTime(d.opens)} – ${formatTime(d.closes)}` : "Closed");

export function hoursSummary(hours: Hours) {
  const first = hours.monday;
  const same = DAYS.every((d) => JSON.stringify(hours[d]) === JSON.stringify(first));
  return same && first ? `Every day, ${formatTime(first.opens)} to ${formatTime(first.closes)}` : "See opening hours";
}

const WEEKDAY_INDEX: Record<string, number> = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };
const toMinutes = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

function zonedNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: WEEKDAY_INDEX[get("weekday")], minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus = { open: true; closesAt: string } | { open: false; opensAt: string; day: Day; today: boolean } | { open: false; opensAt: null };

export function getOpenStatus(hours: Hours, now: Date = new Date()): OpenStatus {
  const { day, minutes } = zonedNow(now);
  const today = hours[DAYS[day]];
  if (today && minutes >= toMinutes(today.opens) && minutes < toMinutes(today.closes)) return { open: true, closesAt: today.closes };
  for (let offset = 0; offset < 7; offset++) {
    const d = DAYS[(day + offset) % 7];
    const h = hours[d];
    if (!h) continue;
    if (offset === 0 && minutes >= toMinutes(h.opens)) continue; // already past today's opening
    return { open: false, opensAt: h.opens, day: d, today: offset === 0 };
  }
  return { open: false, opensAt: null };
}
