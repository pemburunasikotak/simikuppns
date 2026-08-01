import { useQuery } from "@tanstack/react-query";
import { getProkerMasterUnits } from "@/api/proker/masterUnit/api";
import { TProkerMasterUnitResponse } from "@/api/proker/masterUnit/type";

export const useGetProkerMasterUnits = (params?: Record<string, unknown>) => {
  return useQuery<TProkerMasterUnitResponse["data"]>({
    queryKey: ["proker-master-units", params],
    queryFn: async () => {
      const response = await getProkerMasterUnits(params);
      return response.data;
    },
  });
};
