import { getDetailIKUTarget } from "@/api/master/iku";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useGetDetailIKUTarget = (params: any) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.target.list, "detail", params.id],
        queryFn: () => getDetailIKUTarget(params),
        enabled: !!params.id,
    });
};

export default useGetDetailIKUTarget;
