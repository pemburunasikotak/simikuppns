import { getPICs } from "@/api/user";
import { TGetUsersParams } from "@/api/user/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListPic = (params?: TGetUsersParams) => {
  return useQuery({
    queryKey: [queryKeys.user.picList, params],
    queryFn: () => getPICs(params || {}),
  });
};

export default useGetListPic;
