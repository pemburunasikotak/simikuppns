import { assignIndicatorToUnit } from "@/api/proker/manajemenProgram/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export default function useAssignIndicatorToUnit() {
  return useMutation({
    mutationFn: assignIndicatorToUnit,
  });
}
