import { deleteComponentTarget } from "@/api/master/component";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

const useDeleteComponentTarget = () => {
    const queryClient = useQueryClient();
    const params = useParams();

    return useMutation({
        mutationFn: deleteComponentTarget,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.component.target.list, params.id],
            });
        },
    });
};

export default useDeleteComponentTarget;
