import { postRegister } from "@/api/auth/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.user.list],
      });
    },
  });
};

export default useRegisterUser;
