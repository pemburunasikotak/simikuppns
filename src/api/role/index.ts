import { TResponse } from "@/commons/types/response";
import {
  TRoleCreateRequest,
  TRoleDetailResponse,
  TRoleGetRequest,
  TRoleListResponse,
  TRoleUpdateRequest,
} from "./type";

export const getRoles = (params: TRoleGetRequest): Promise<TRoleListResponse> => {
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

export const getRole = (id: string): Promise<TRoleDetailResponse> => {
  console.log(id);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: {
      permissions: [
        {
          name: "View Role",
          key: "view-role",
          id: "145efcff-8ae5-4a6c-9900-05a855000622",
          created_at: null,
          updated_at: null,
          deleted_at: null,
        },
      ],
      name: "Super Admin",
      key: "super-admin",
      id: "410b4d3f-9ea1-4871-81ff-b091cf6c15fb",
      created_at: null,
      updated_at: null,
      deleted_at: null,
    },
  });
};

export const createRole = (data: TRoleCreateRequest): Promise<TResponse<null>> => {
  console.log(data);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};

export const updateRole = (id: string, data: TRoleUpdateRequest): Promise<TResponse<null>> => {
  console.log(id, data);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};

export const deleteRole = (id: string): Promise<TResponse<null>> => {
  console.log(id);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};
