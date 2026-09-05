import { updateGuide } from "@/api/guides";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGuide,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.guides.list],
      });
    },
  });
};

export default useUpdateGuide;
