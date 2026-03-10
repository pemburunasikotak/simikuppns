import { TErrorResponse } from "@/commons/types/response";
import {
  QueryClient,
  UseMutationOptions,
  useMutation as useMutationOrigin,
} from "@tanstack/react-query";

export const useMutation = <
  TData = unknown,
  TError = TErrorResponse,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient,
) => useMutationOrigin<TData, TError, TVariables, TContext>(options, queryClient);
