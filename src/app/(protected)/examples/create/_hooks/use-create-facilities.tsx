import { createIKU } from "@/api/master/iku/index";
// import { TIKUCreateRequest } from "@/api/master/iku/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateFacilities = () => {
  return useMutation({
    mutationKey: ["create-facilities"],
    mutationFn: createIKU,
  });
};

export default useCreateFacilities;
