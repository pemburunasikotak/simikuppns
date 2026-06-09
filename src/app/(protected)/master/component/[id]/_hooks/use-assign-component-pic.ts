import { assignComponentPics } from "@/api/master/component";
import { TAssignComponentPicRequest } from "@/api/master/component/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router";

const useAssignComponentPic = () => {
    const queryClient = useQueryClient();
    const params = useParams();

    return useMutation({
        mutationFn: ({ componentId, req }: { componentId: string; req: TAssignComponentPicRequest }) =>
            assignComponentPics(componentId, req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.component.pic.list, params.id],
            });
            enqueueSnackbar("Berhasil Memperbarui PIC", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.message || "Gagal Memperbarui PIC", { variant: "error" });
        },
    });
};

export default useAssignComponentPic;
