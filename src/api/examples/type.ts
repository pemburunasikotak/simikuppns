import { Nullable } from "@/commons/types/common";
import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TFacilitiesFilter = TFilterParams;

export type TFacilities = {
  id: string;
  name: string;
  type: {
    id: string;
    name: string;
  };
};

export type TFacilitiesRequest = Omit<TFacilities, "id" | "type"> & {
  id: string;
};

export type TDetailFacilitiesResponse = TResponse<Nullable<TFacilities>>;
export type TListFacilitiesResponse = TResponsePaginate<TFacilities>;
