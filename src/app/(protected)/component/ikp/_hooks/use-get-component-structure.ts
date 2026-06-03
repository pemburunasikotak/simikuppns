import { useQuery } from "@/app/_hooks/request/use-query";
import { getComponentStructure } from "@/api/master/component";
import { TComponentStructureResponse } from "@/api/master/component/type";

export const useGetComponentStructure = (id: string, year: number) => {
  return useQuery<TComponentStructureResponse>({
    queryKey: ["component-structure", id, year],
    queryFn: () => getComponentStructure(id, { year }),
    enabled: !!id,
  });
};

export default useGetComponentStructure;
