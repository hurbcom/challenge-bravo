import dayjs from "dayjs";

export function getTomorrowDate(): Date {
  return dayjs()
    .add(1, "day")
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .toDate();
}

export function getTodayDate(): Date {
  return dayjs()
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .toDate();
}
