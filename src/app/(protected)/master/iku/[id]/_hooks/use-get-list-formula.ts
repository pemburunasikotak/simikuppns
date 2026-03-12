import { getListFormula } from "@/api/master/iku";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListFormula = (params: { ikuId: string }) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.list, "formula", params.ikuId],
        queryFn: () => getListFormula({ ikuId: params.ikuId }),
    });
};

export default useGetListFormula;
