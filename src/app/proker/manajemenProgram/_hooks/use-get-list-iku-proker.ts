import { useQuery } from "@tanstack/react-query";
import { getListIkuProker } from "@/api/proker/manajemenProgram/api";

export const useGetListIkuProker = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker", "iku", "list", params],
    queryFn: () => getListIkuProker(params),
  });
};

export default useGetListIkuProker;
