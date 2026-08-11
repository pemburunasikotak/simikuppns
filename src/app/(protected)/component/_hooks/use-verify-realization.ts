import { verifyRealization } from "@/api/verification";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useVerifyRealization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyRealization,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.masterData.componentRealization.detail],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.verification.dashboard],
      });
    },
  });
};

export default useVerifyRealization;
