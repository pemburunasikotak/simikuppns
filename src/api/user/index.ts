import { authApi } from "@/libs/axios/api";
import { TResponse } from "@/commons/types/response";
import {
  TGetUsersParams,
  TAuthUsersResponse,
  TAuthUserItem,
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
