import { editIKUTarget } from "@/api/master/iku";
import { TIKUTargetUpdateRequest } from "@/api/master/iku/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

const useEditIKUTarget = () => {
    const queryClient = useQueryClient();
    const params = useParams();

    return useMutation({
        mutationFn: ({ id, req }: { id: string; req: TIKUTargetUpdateRequest }) => editIKUTarget({ id }, req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.target.list, params.id],
            });
        },
    });
};

export default useEditIKUTarget;
