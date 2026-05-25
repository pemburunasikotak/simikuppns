import { getListComponent } from "@/api/master/iku";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";
import { TGetIKUParams } from "@/api/master/iku/type";
import { TFilterParams } from "@/commons/types/filter";

const useGetListComponent = (params: TFilterParams<TGetIKUParams>) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.list, "components", params],
        queryFn: () => getListComponent(params),
    });
};

export default useGetListComponent;
