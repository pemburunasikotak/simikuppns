import { useQuery } from "@tanstack/react-query";
import { getProkerGuides } from "@/api/proker/guides/api";
import { TGetProkerGuidesParams } from "@/api/proker/guides/type";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListProkerGuide = (params?: TGetProkerGuidesParams) => {
  return useQuery({
    queryKey: [queryKeys.proker.guides, params],
    queryFn: () => getProkerGuides(params),
  });
};

export default useGetListProkerGuide;
