import { createIKUTarget } from "@/api/master/iku";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

const useCreateIKUTarget = () => {
    const queryClient = useQueryClient();
    const params = useParams();

    return useMutation({
        mutationFn: createIKUTarget,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.target.list, params.id],
            });
        },
    });
};

export default useCreateIKUTarget;
