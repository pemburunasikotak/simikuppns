import { useQuery } from "@/app/_hooks/request/use-query";
import { getComponentRealization } from "@/api/master/component";
import { TComponentRealizationResponse } from "@/api/master/component/type";

export const useGetComponentRealization = (id: string, year: number) => {
  return useQuery<TComponentRealizationResponse>({
    queryKey: ["component-realization", id, year],
    queryFn: () => getComponentRealization(id, { year }),
    enabled: !!id,
  });
};

export default useGetComponentRealization;
