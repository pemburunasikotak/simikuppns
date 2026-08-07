import { updatePeriodLock } from "@/api/settings/period-lock";
import { TPeriodLockUpdateRequest } from "@/api/settings/period-lock/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { TDefaultResponse } from "@/commons/types/response";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

const useUpdatePeriodLock = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<TDefaultResponse, unknown, TPeriodLockUpdateRequest>({
    mutationFn: (data: TPeriodLockUpdateRequest) => updatePeriodLock(data),
    onSuccess: (res) => {
      enqueueSnackbar(res?.message || "Berhasil memperbarui status lock periode", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.settings.periodLocks],
      });
    },
    onError: (err: unknown) => {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      enqueueSnackbar(errorObj?.response?.data?.message || errorObj?.message || "Gagal memperbarui status lock periode", {
        variant: "error",
      });
    },
  });
};

export default useUpdatePeriodLock;
