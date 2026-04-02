import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import "dayjs/locale/id";

dayjs.locale("id");
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date?: string | null, format = "DD/MM/YYYY"): string | undefined => {
  if (!date) return undefined;
  return dayjs(date).format(format);
};

/**
 * Format ISO UTC date string to WIB (GMT+7) format
 * Output: "2026-04-02 11:42"
 */
export const formatDateTimeWIB = (date?: string | null): string => {
  if (!date) return "-";
  return dayjs.utc(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm");
};
