import { assignIKUsToUnit, unassignIKUsFromUnit } from "@/api/unit";
import { TAssignIKURequest } from "@/api/unit/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

export const useAssignIKUs = (unitId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TAssignIKURequest) => assignIKUsToUnit(unitId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.unit.ikus, unitId] });
    },
  });
};

export const useUnassignIKUs = (unitId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TAssignIKURequest) => unassignIKUsFromUnit(unitId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.unit.ikus, unitId] });
    },
  });
};
