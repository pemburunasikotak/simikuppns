import { resetUserPassword } from "@/api/user";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

type TResetPasswordInput = {
  id: string;
  password?: string;
  [key: string]: unknown;
};

const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TResetPasswordInput) => resetUserPassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.user.list],
      });
    },
  });
};

export default useChangePassword;
