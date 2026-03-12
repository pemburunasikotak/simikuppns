import { getDetailComponent } from "@/api/master/component";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailComponent = (params: TDetailParams) => {
    return useQuery({
        queryKey: [queryKeys.masterData.component.detail, params],
        queryFn: () => getDetailComponent(params),
        enabled: !!params.id,
    });
};

export default useGetDetailComponent;
