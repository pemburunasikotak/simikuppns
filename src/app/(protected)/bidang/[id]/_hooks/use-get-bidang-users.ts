import { getBidangUsers } from "@/api/bidang";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetBidangUsers = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.bidang.detail, id, "users"],
    queryFn: () => getBidangUsers(id),
    enabled: !!id,
  });
};

export default useGetBidangUsers;
