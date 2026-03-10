import { TResponse } from "@/commons/types/response";
import {
  TGetUsersParams,
  TUserUpdateRequest,
  TUserDetailResponse,
  TUserCreateRequest,
  TUserPaginateResponse,
} from "./type";

export const getUsers = (params: TGetUsersParams): Promise<TUserPaginateResponse> => {
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

export const getUser = (id: string): Promise<TUserDetailResponse> => {
  console.log(id);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St, Anytown, USA",
      is_active: true,
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z",
      roles: [
        {
          id: "1",
          key: "admin",
          name: "Admin",
          description: "Administrator role",
          created_at: "2023-01-01T00:00:00.000Z",
          updated_at: "2023-01-01T00:00:00.000Z",
          permissions: [
            {
              id: "1",
              key: "read",
              name: "read",
              description: "Read permission",
              created_at: "2023-01-01T00:00:00.000Z",
              updated_at: "2023-01-01T00:00:00.000Z",
            },
            {
              id: "2",
              key: "write",
              name: "write",
              description: "Write permission",
              created_at: "2023-01-01T00:00:00.000Z",
              updated_at: "2023-01-01T00:00:00.000Z",
            },
          ],
        },
      ],
    },
  });
};

export const createUser = (data: TUserCreateRequest): Promise<TResponse<null>> => {
  console.log(data);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};

export const updateUser = (id: string, data: TUserUpdateRequest): Promise<TResponse<null>> => {
  console.log(id, data);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};

export const deleteUser = (id: string): Promise<TResponse<null>> => {
  console.log(id);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: null,
  });
};
