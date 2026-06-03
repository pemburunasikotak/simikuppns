import { authApi } from "@/libs/axios/api";
import { TResponse } from "@/commons/types/response";
import {
  TPermissionCreateRequest,
  TPermissionDetailResponse,
  TGetPermissionsParams,
  TPermissionListResponse,
  TPermissionUpdateRequest,
} from "./type";

export const getPermissions = async (params: TGetPermissionsParams): Promise<TPermissionListResponse> => {
  const { data } = await authApi({
    url: "/api/permissions",
    method: "GET",
    params,
  });
  return data;
};

export const getPermission = async (id: string): Promise<TPermissionDetailResponse> => {
  const { data } = await authApi({
    url: `/api/permissions/${id}`,
    method: "GET",
  });
  return data;
};

export const createPermission = async (data: TPermissionCreateRequest): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: "/api/permissions",
    method: "POST",
    data,
  });
  return res;
};

export const updatePermission = async (
  id: string,
  data: TPermissionUpdateRequest,
): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: `/api/permissions/${id}`,
    method: "PUT",
    data,
  });
  return res;
};

export const deletePermission = async (id: string): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: `/api/permissions/${id}`,
    method: "DELETE",
  });
  return res;
};
