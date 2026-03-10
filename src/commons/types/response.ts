import { AxiosError } from "axios";
import { Nullable } from "./common";

export type TResponse<T> = {
  code: number;
  message: string | null;
  status: boolean | null;
  result: T;
};

export type TPaginationInfo = {
  currentPage: number;
  total: number;
  totalPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type TPagination<T = null> = {
  data: T;
} & TPaginationInfo;

export type TResponsePaginate<T> = TResponse<TPagination<T[]>>;

export type TError = {
  code: number;
  status: boolean;
  errors: boolean;
  message: Nullable<string>;
};

export type TErrorResponse = AxiosError<TError>;
export type TDefaultResponse<T = null> = TResponse<T>;
