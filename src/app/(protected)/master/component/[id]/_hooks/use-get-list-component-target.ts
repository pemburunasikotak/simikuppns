import { getListComponentTarget } from "@/api/master/component";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListComponentTarget = (params: { componentId: string }) => {
    return useQuery({
        queryKey: [queryKeys.masterData.component.target.list, params.componentId],
        queryFn: () => getListComponentTarget({ componentId: params.componentId }),
    });
};

export default useGetListComponentTarget;
