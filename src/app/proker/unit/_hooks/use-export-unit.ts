import { useMutation } from "@tanstack/react-query";
import { exportProkerByUnit } from "@/api/proker/unit/api";

export const useExportProkerByUnit = () => {
  return useMutation({
    mutationFn: async ({ unitId, year, type }: { unitId: string | number; year: string | number; type?: string }) => {
      return await exportProkerByUnit(unitId, year, type);
    },
  });
};
