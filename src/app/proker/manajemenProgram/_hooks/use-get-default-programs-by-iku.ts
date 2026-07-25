import { useQuery } from "@tanstack/react-query";
import { getDefaultProgramsByIku } from "@/api/proker/manajemenProgram/api";

export const useGetDefaultProgramsByIku = (ikuId: string, enabled = true) => {
  return useQuery({
    queryKey: ["proker", "default-program", "list-by-iku", ikuId],
    queryFn: () => getDefaultProgramsByIku(ikuId),
    enabled: !!ikuId && enabled,
  });
};

export default useGetDefaultProgramsByIku;
