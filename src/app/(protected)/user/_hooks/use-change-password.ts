import { postChangePassword } from "@/api/auth/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postChangePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.user.list],
      });
    },
  });
};

export default useChangePassword;
