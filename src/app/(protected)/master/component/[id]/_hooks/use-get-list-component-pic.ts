import { getComponentPics } from "@/api/master/component";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListComponentPic = (componentId: string) => {
    return useQuery({
        queryKey: [queryKeys.masterData.component.pic.list, componentId],
        queryFn: () => getComponentPics(componentId),
        enabled: !!componentId,
    });
};

export default useGetListComponentPic;
