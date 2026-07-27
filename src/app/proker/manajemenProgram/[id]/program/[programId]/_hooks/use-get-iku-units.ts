import { getIkuUnits } from "@/api/proker/manajemenProgram/api";
import { useQuery } from "@/app/_hooks/request/use-query";

const useGetIkuUnits = (ikuId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["proker/iku/units", ikuId],
    queryFn: () => getIkuUnits(ikuId),
    enabled: enabled && !!ikuId,
  });
};

export default useGetIkuUnits;
