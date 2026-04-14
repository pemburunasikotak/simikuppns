import { editComponentTarget } from "@/api/master/component";
import { TComponentTargetUpdateRequest } from "@/api/master/component/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

const useEditComponentTarget = () => {
    const queryClient = useQueryClient();
    const params = useParams();

    return useMutation({
        mutationFn: ({ id, req }: { id: string; req: TComponentTargetUpdateRequest }) => editComponentTarget({ id }, req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.component.target.list, params.id],
            });
        },
    });
};

export default useEditComponentTarget;
