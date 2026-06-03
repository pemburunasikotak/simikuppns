import { authApi } from "@/libs/axios/api";
import { TResponse } from "@/commons/types/response";
import {
  TRoleCreateRequest,
  TRoleDetailResponse,
  TRoleGetRequest,
  TRoleListResponse,
  TRoleUpdateRequest,
} from "./type";

export const getRoles = async (params: TRoleGetRequest): Promise<TRoleListResponse> => {
  const { data } = await authApi({
    url: "/api/roles",
    method: "GET",
    params,
  });
  return data;
};

export const getRole = async (id: string): Promise<TRoleDetailResponse> => {
  const { data } = await authApi({
    url: `/api/roles/${id}`,
    method: "GET",
  });
  return data;
};

export const createRole = async (data: TRoleCreateRequest): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: "/api/roles",
    method: "POST",
    data,
  });
  return res;
};

export const updateRole = async (id: string, data: TRoleUpdateRequest): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: `/api/roles/${id}`,
    method: "PUT",
    data,
  });
  return res;
};

export const deleteRole = async (id: string): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: `/api/roles/${id}`,
    method: "DELETE",
  });
  return res;
};

export const assignRole = async (payload: { userId: string; roleId: string }): Promise<unknown> => {
  const { data } = await authApi({
    url: "/api/permissions/assign-role",
    method: "POST",
    data: payload,
  });
  return data;
};
