import { useMutation } from "@tanstack/react-query";
import { exportProkerByUnit } from "@/api/proker/unit/api";

export const useExportProkerByUnit = () => {
  return useMutation({
    mutationFn: async ({ unitId, year }: { unitId: string | number; year: string | number }) => {
      return await exportProkerByUnit(unitId, year);
    },
  });
};
