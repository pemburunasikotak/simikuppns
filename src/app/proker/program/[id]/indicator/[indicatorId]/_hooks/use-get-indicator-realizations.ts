import { useQuery } from "@tanstack/react-query";
import { getIndicatorRealizations } from "@/api/proker/program/api";

const useGetIndicatorRealizations = (programId: string, indicatorId: string) => {
  return useQuery({
    queryKey: ["indicator-realizations", programId, indicatorId],
    queryFn: () => getIndicatorRealizations(programId, indicatorId),
    enabled: !!programId && !!indicatorId,
  });
};

export default useGetIndicatorRealizations;
