import { queryKeys } from "@/commons/constants/query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { TErrorResponse } from "@/commons/types/response";
import { createFormula } from "@/api/master/iku";
import { TIKUFormulaCreateRequest } from "@/api/master/iku/type";

const useCreateFormula = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: TIKUFormulaCreateRequest) => createFormula(req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.list],
            });
            enqueueSnackbar("Berhasil Menambahkan Formula", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.message || "Gagal Menambahkan Formula", { variant: "error" });
        },
    });
};

export default useCreateFormula;
