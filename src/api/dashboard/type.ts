import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";


export type TTransactionFilter = TFilterParams;

export type TTransactionItem = {
  id: string;
  name: string;
  no_whatapps?: string;
  package?: string;
  event_date: string;
  total: string;
  updated_at: string;
};

export type TTransactionPaginateResponse = TResponsePaginate<TTransactionItem>;
export type TTransactionDetailResponse = TResponse<TTransactionItem>;
