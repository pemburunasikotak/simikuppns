import { getListIKUTarget } from "@/api/master/iku";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListIKUTarget = (params: { ikuId: string }) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.target.list, params.ikuId],
        queryFn: () => getListIKUTarget({ ikuId: params.ikuId }),
    });
};

export default useGetListIKUTarget;
