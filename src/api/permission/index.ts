import { TResponse } from "@/commons/types/response";
import {
  TPermissionCreateRequest,
  TPermissionDetailResponse,
  TGetPermissionsParams,
  TPermissionListResponse,
  TPermissionUpdateRequest,
} from "./type";

export const getPermissions = (params: TGetPermissionsParams): Promise<TPermissionListResponse> => {
  console.log(params);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: {
      data: [],
      currentPage: 1,
      total: 10,
      totalPage: 4,
      hasPreviousPage: false,
      hasNextPage: true,
    },
  });
};

export const getPermission = (id: string): Promise<TPermissionDetailResponse> => {
  console.log(id);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: {
      name: "View Role",
      key: "view-role",
      id: "145efcff-8ae5-4a6c-9900-05a855000622",
      created_at: null,
      updated_at: null,
      deleted_at: null,
    },
  });
};

export const createPermission = (data: TPermissionCreateRequest): Promise<TResponse<null>> => {
  console.log(data);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};

export const updatePermission = (
  id: string,
  data: TPermissionUpdateRequest,
): Promise<TResponse<null>> => {
  console.log(id, data);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};

export const deletePermission = (id: string): Promise<TResponse<null>> => {
  console.log(id);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};
