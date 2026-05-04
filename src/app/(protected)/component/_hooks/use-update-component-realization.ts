import { updateComponentRealization } from "@/api/master/metrics";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateComponentRealization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateComponentRealization,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.masterData.componentRealization.detail],
      });
    },
  });
};

export default useUpdateComponentRealization;
