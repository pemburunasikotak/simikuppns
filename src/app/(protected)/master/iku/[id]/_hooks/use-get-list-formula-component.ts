import { useQuery } from "@tanstack/react-query";
import { getFormulaComponents } from "@/api/master/iku";

const useGetListFormulaComponent = (id?: string) => {
    return useQuery({
        queryKey: ["iku-formula-components", id],
        queryFn: () => getFormulaComponents(id!),
        enabled: !!id,
    });
};

export default useGetListFormulaComponent;
