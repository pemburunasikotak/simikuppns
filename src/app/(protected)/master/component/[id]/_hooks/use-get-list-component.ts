import { getListComponent } from "@/api/master/iku";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListComponent = (params: TDetailParams) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.list, "components", params.id],
        queryFn: () => getListComponent(params),
    });
};

export default useGetListComponent;
