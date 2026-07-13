import { useQuery } from "@tanstack/react-query";
import { getListDefaultProgram } from "@/api/proker/manajemenProgram/api";

export const useGetListDefaultProgram = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker", "default-program", "list", params],
    queryFn: () => getListDefaultProgram(params),
  });
};

export default useGetListDefaultProgram;
