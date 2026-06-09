import { updateUser } from "@/api/user";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.user.list],
      });
    },
  });
};

export default useUpdateUser;
