import { getGuides } from "@/api/guides";
import { TGetGuidesParams } from "@/api/guides/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListGuide = (params?: TGetGuidesParams) => {
  return useQuery({
    queryKey: [queryKeys.guides.list, params],
    queryFn: () => getGuides(params || {}),
  });
};

export default useGetListGuide;
