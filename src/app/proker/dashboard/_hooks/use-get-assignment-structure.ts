import { getAssignmentStructure } from "@/api/proker/manajemenProgram/api";
import { useQuery } from "@/app/_hooks/request/use-query";

const useGetAssignmentStructure = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker/default-programs/assignment-structure", params],
    queryFn: () => getAssignmentStructure(params),
  });
};

export default useGetAssignmentStructure;
