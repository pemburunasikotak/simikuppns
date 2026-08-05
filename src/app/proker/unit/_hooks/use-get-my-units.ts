import { useQuery } from "@tanstack/react-query";
import { getMyUnits } from "@/api/proker/unit/api";

const useGetMyUnits = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker/unit/my-units", params],
    queryFn: () => getMyUnits(params),
  });
};

export default useGetMyUnits;
