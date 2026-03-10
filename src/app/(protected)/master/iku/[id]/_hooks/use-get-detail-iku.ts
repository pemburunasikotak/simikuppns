import { getDetailIKU } from "@/api/master/iku";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailIku = (params: TDetailParams) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.detail, "components", params.id],
        queryFn: () => getDetailIKU(params),
        enabled: !!params.id,
    });
};

export default useGetDetailIku;
