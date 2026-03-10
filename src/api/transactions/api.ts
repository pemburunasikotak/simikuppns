// import { generatePath } from "react-router";
import { api } from "@/libs/axios/api";

import { TDetailParams } from "../common";
import {
  TDetailTransactionResponse,
  TListTransactionResponse,
  TTransactionFilter,
  TTransactionRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
  list: "/api/booking",
  detail: "/api/booking/:id",
  create: "/api/booking",
  edit: "/api/booking/:id/update",
};

export const getListTransaction = async (
  params?: TTransactionFilter,
): Promise<TListTransactionResponse> => {
  const res = await api.get(endpoints.list, { params});

  return res.data;
};

export const getDetailTransaction = async (
  params?: TDetailParams,
): Promise<TDetailTransactionResponse> => {

  const res = await api.get(`/api/booking/${params?.id}`);
  return res.data;
};

export const createTransaction = async (req: TTransactionRequest): Promise<TDefaultResponse> => {
  const res = await api.post(endpoints.create, { ...req });
  return res.data;
};

export const editTransaction = async (
  params: TDetailParams,
  req: TTransactionRequest,
): Promise<TDefaultResponse> => {
  const res = await api.patch(`/api/booking/${params?.id}`, {...req });
  return res.data;
};
