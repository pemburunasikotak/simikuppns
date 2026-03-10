import dayjs from "dayjs";

import "dayjs/locale/id";

dayjs.locale("id");

export const formatDate = (date?: string | null, format = "DD/MM/YYYY"): string | undefined => {
  if (!date) return undefined;
  return dayjs(date).format(format);
};
