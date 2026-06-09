import { getIKUPics } from "@/api/master/iku";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListIKUPic = (ikuId: string) => {
    return useQuery({
        queryKey: [queryKeys.masterData.iku.pic.list, ikuId],
        queryFn: () => getIKUPics(ikuId),
        enabled: !!ikuId,
    });
};

export default useGetListIKUPic;
