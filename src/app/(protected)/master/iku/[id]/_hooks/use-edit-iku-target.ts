import { editIKUTarget } from "@/api/master/iku";
import { TIKUTargetUpdateRequest } from "@/api/master/iku/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
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
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.message || "Gagal Mengubah Target IKU", { variant: "error" });
        },
    });
};

export default useEditIKUTarget;
