import { createIKUTarget } from "@/api/master/iku";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
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
            enqueueSnackbar("Berhasil Menambahkan Target", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.message || "Gagal Menambahkan Target", { variant: "error" });
        },
    });
};

export default useCreateIKUTarget;
