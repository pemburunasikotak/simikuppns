import { Nullable } from "@/commons/types/common";
import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TTransactionFilter = TFilterParams;

export type TTransactionStatus = "cancel" | "success" | "pending";

export type TTransacion = {
  id: string;
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  booking_date?: string;
  bookingDate?: string;
  total_price?: string;
  totalPrice?: string;
  status: TTransactionStatus;
  created_by: string;
  createdBy?: {
    id: string;
    fullname: string;
  }
  province?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  customerAddress: string;
};

export type TTransactionRequest = Omit<TTransacion, "id" | "created_by" | "status"> & {
  status: string;
};

export type TDetailTransactionResponse = TResponse<Nullable<TTransacion>>;
export type TListTransactionResponse = TResponsePaginate<TTransacion>;
