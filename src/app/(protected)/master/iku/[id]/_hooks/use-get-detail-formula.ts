import { getDetailFormula } from "@/api/master/iku";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailFormula = (id?: string) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.list, "formula", "detail", id],
        queryFn: () => getDetailFormula(id!),
        enabled: !!id,
    });
};

export default useGetDetailFormula;
