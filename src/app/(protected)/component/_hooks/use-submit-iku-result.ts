import { submitIkuResult } from "@/api/master/metrics";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useSubmitIKUResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitIkuResult,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.masterData.componentRealization.detail],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.ikuResult.list],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.ikuResult.detail],
      });
    },
  });
};

export default useSubmitIKUResult;
