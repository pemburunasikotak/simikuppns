import { TDetailParams } from "@/api/common";
import { editIKU } from "@/api/master/iku/index";
import { TIKUCreateRequest } from "@/api/master/iku/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useEditFacilities = (params: TDetailParams) => {
  return useMutation({
    mutationKey: ["edit-facilities"],
    mutationFn: (req: TIKUCreateRequest) => editIKU(params, req),
  });
};

export default useEditFacilities;
