import { useQuery } from "@tanstack/react-query";
import { getDefaultProgramById } from "@/api/proker/manajemenProgram/api";

export const useGetDefaultProgram = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["proker", "default-program", "detail", id],
    queryFn: () => getDefaultProgramById(id),
    enabled,
  });
};

export default useGetDefaultProgram;
