import { TErrorResponse } from "@/commons/types/response";
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  UseInfiniteQueryOptions,
  useInfiniteQuery as useInfiniteQueryOriginal,
} from "@tanstack/react-query";

export const useInfiniteQuery = <
  TQueryFnData = unknown,
  TError = TErrorResponse,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
  queryClient?: QueryClient,
) => {
  return useInfiniteQueryOriginal<TQueryFnData, TError, TData, TQueryKey, TPageParam>(
    options,
    queryClient,
  );
};
