import { updateUnit } from "@/api/unit";
import { TUnitUpdateRequest } from "@/api/unit/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: TUnitUpdateRequest }) =>
      updateUnit(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.unit.list] });
    },
  });
};

export default useUpdateUnit;
