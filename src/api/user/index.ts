import { api, authApi } from "@/libs/axios/api";
import { TResponse } from "@/commons/types/response";
import {
  TGetUsersParams,
  TAuthUsersResponse,
  TAuthUserItem,
  TPICListResponse,
} from "./type";

export const getUsers = async (params: TGetUsersParams): Promise<TAuthUsersResponse> => {
  const { data } = await authApi({
    url: `/api/users`,
    method: "GET",
    params,
  });
  return data;
  // return Promise.resolve({
  //   success: true,
  //   data: [
  //     {
  //       id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //       email: "tjunian@ppns.ac.id",
  //       name: "Tjunian",
  //       nip: "123123123",
  //       type: "EMPLOYEE",
  //       isActive: true,
  //       deletedAt: null,
  //       createdAt: "2026-06-03T01:55:50.956Z",
  //       updatedAt: "2026-06-03T01:55:50.956Z",
  //     },
  //     {
  //       id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
  //       email: "mbar@ppns.ac.id",
  //       name: "Mbar",
  //       nip: "123123124",
  //       type: "EMPLOYEE",
  //       isActive: true,
  //       deletedAt: null,
  //       createdAt: "2026-06-03T01:55:50.956Z",
  //       updatedAt: "2026-06-03T01:55:50.956Z",
  //     },
  //     {
  //       id: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
  //       email: "staff@ppns.ac.id",
  //       name: "Staff Akademik",
  //       nip: "123123125",
  //       type: "STAFF",
  //       isActive: false,
  //       deletedAt: null,
  //       createdAt: "2026-06-03T01:55:50.956Z",
  //       updatedAt: "2026-06-03T01:55:50.956Z",
  //     }
  //   ],
  //   pagination: {
  //     total: 3,
  //     page: params.page || 1,
  //     limit: params.limit || 10,
  //     totalPages: 1,
  //   },
  // });
};

export const getPICs = async (params: TGetUsersParams): Promise<TPICListResponse> => {
  const { data } = await api({
    url: `/api/users/pics`,
    method: "GET",
    params,
  });

  if (data.data && !data.result) {
    const dataObj = data.data;
    const pagination = dataObj.pagination || {};
    const currentPage = pagination.page || dataObj.page || 1;
    const totalPage = pagination.totalPages || Math.ceil((pagination.total || dataObj.total || 0) / (pagination.limit || dataObj.limit || 10)) || 1;

    data.result = {
      data: dataObj.data || [],
      total: pagination.total || dataObj.total || 0,
      currentPage: currentPage,
      totalPage: totalPage,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPage,
    };
  }

  return data;
};

export const getUser = async (id: string): Promise<TResponse<TAuthUserItem>> => {
  const { data } = await authApi({
    url: `/api/users/${id}`,
    method: "GET",
  });
  return data;
};

export const createUser = async (data: unknown): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: "/api/users",
    method: "POST",
    data,
  });
  return res;
};

export const updateUser = async (id: string, data: unknown): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: `/api/users/${id}`,
    method: "PUT",
    data,
  });
  return res;
};

export const deleteUser = async (id: string): Promise<TResponse<null>> => {
  const { data: res } = await authApi({
    url: `/api/users/${id}`,
    method: "DELETE",
  });
  return res;
};

export const resetUserPassword = async (payload: { id: string; password?: string; [key: string]: unknown }): Promise<TResponse<null>> => {
  const { id, ...data } = payload;
  try {
    const { data: res } = await authApi({
      url: `/api/users/${id}/reset-password`,
      method: "POST",
      data: {
        password: data.password,
        newPassword: data.password,
        ...data,
      },
    });
    return res;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response && (err.response.status === 405 || err.response.status === 404)) {
      const { data: res } = await authApi({
        url: `/api/users/${id}/reset-password`,
        method: "PUT",
        data: {
          password: data.password,
          newPassword: data.password,
          ...data,
        },
      });
      return res;
    }
    throw error;
  }
};
