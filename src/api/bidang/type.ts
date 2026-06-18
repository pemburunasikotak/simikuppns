import { TResponsePaginate, TResponse } from "@/commons/types/response";
import { TIKUItem } from "../master/iku/type";

export type TBidangItem = {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    ikus: number;
    components: number;
  };
};

export type TGetBidangParams = {
  page?: number;
  limit?: number;
  per_page?: number;
  sort?: string;
  order?: string;
  search?: string;
  search_value?: string;
};

export type TBidangCreateRequest = {
  code: string;
  name: string;
  description: string;
};

export type TBidangUpdateRequest = Partial<TBidangCreateRequest>;

export type TBidangUserAssignment = {
  id: string;
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    nip: string;
    email: string;
    type: string;
  };
};

export type TBidangIkuAssignment = {
  id: string;
  ikuId: string;
  createdAt: string;
  iku: TIKUItem;
};

export type TBidangComponentAssignment = {
  id: string;
  componentId: string;
  createdAt: string;
  component: {
    id: string;
    code: string;
    name: string;
    dataType: string;
    sourceType: string;
    periodType: string;
    hasBreakdown: boolean;
  };
};

export type TBidangDetail = {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  users: TBidangUserAssignment[];
  ikus: TBidangIkuAssignment[];
  components: TBidangComponentAssignment[];
};

export type TBidangListResponse = TResponsePaginate<TBidangItem>;
export type TBidangDetailResponse = TResponse<TBidangDetail>;
