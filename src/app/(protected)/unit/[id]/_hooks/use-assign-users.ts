import { assignUsersToUnit } from "@/api/unit";
import { TAssignUserRequest } from "@/api/unit/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useAssignUsers = (unitId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TAssignUserRequest) => assignUsersToUnit(unitId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.unit.users, unitId] });
    },
  });
};

export default useAssignUsers;
