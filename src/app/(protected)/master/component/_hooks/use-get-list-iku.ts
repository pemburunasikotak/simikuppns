import { getListComponent } from "@/api/master/component";
import { TGetComponentParams } from "@/api/master/component/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListComponent = (params?: TGetComponentParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.component.list, params],
    queryFn: () => getListComponent(params),
  });
};

export default useGetListComponent;
