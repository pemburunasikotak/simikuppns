import { getUsers } from "@/api/user";
import { TGetUsersParams } from "@/api/user/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListUser = (params?: TGetUsersParams) => {
  return useQuery({
    queryKey: [queryKeys.user.list, params],
    queryFn: () => getUsers(params || {}),
  });
};

export default useGetListUser;
