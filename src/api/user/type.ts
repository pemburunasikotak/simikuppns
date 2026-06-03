import { TResponse, TResponsePaginate } from "@/commons/types/response";
import { TRoleItem } from "../role/type";

export type TUserItem = {
  id: string;
  name: string;
  email?: string;
  username?: string;
  login_type?: "username" | "email";
  created_at: string;
  updated_at: string;
  roles: Array<TRoleItem>;
};

export type TUserCreateRequest = Omit<TUserItem, "id" | "created_at" | "updated_at" | "roles">;

export type TUserUpdateRequest = Omit<TUserItem, "created_at" | "updated_at" | "roles">;

export type TGetUsersParams = {
  page?: number;
  limit?: number;
  per_page?: number;
  sort?: string;
  order?: string;
  search?: string;
  search_value?: string;
};

export type TUserPaginateResponse = TResponsePaginate<TUserItem>;
export type TUserDetailResponse = TResponse<TUserItem>;

export type TAuthUserItem = {
  id: string;
  email: string;
  name: string;
  nip: string;
  type: string;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TAuthUsersResponse = {
  success: boolean;
  data: TAuthUserItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
