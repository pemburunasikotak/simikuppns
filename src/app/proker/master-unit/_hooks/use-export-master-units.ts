import { useMutation } from "@tanstack/react-query";
import { exportProkerMasterUnits } from "@/api/proker/masterUnit/api";

export const useExportProkerMasterUnits = () => {
  return useMutation({
    mutationFn: () => exportProkerMasterUnits(),
  });
};
