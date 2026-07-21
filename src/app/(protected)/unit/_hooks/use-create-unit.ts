import { createUnit } from "@/api/unit";
import { TUnitCreateRequest } from "@/api/unit/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { useQueryClient } from "@tanstack/react-query";

const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TUnitCreateRequest) => createUnit(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.unit.list] });
    },
  });
};

export default useCreateUnit;
