import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { TDefaultResponse, TErrorResponse } from "@/commons/types/response";
import { testFormula } from "@/api/master/iku";
import { TIKUFormulaTestRequest } from "@/api/master/iku/type";

const useTestFormula = () => {
    return useMutation({
        mutationFn: ({ id, req }: { id: string, req: TIKUFormulaTestRequest }) => testFormula(id, req),
        onSuccess: (res: TDefaultResponse) => {
            enqueueSnackbar(res.message || "Test berhasil dijalankan", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.message || "Gagal Menjalankan Test Formula", { variant: "error" });
        },
    });
};

export default useTestFormula;
