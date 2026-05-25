import { getListComponent } from "@/api/master/iku";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";
import { TComponentFilter } from "@/api/master/component/type";

const useGetListComponent = (params: TComponentFilter) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.list, "components", params.id],
        queryFn: () => getListComponent(params),
    });
};

export default useGetListComponent;
