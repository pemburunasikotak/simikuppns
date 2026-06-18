import { getBidangComponents } from "@/api/bidang";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetBidangComponents = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.bidang.detail, id, "components"],
    queryFn: () => getBidangComponents(id),
    enabled: !!id,
  });
};

export default useGetBidangComponents;
