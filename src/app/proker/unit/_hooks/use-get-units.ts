import { useQuery } from "@tanstack/react-query";
import { getProkerUnits } from "@/api/proker/unit/api";

export const useGetProkerUnits = () => {
  return useQuery({
    queryKey: ["proker-units"],
    queryFn: async () => {
      return await getProkerUnits();
    },
  });
};
