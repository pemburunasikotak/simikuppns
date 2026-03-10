import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TPermissionItem = {
  id: string;
  name: string;
  key: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TPermissionCreateRequest = Omit<
  TPermissionItem,
  "id" | "created_at" | "updated_at" | "permissions"
>;

export type TPermissionUpdateRequest = Omit<
  TPermissionItem,
  "created_at" | "updated_at" | "permissions"
>;

export type TGetPermissionsParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  search?: string;
};

export type TPermissionListResponse = TResponsePaginate<TPermissionItem>;

export type TPermissionDetailResponse = TResponse<TPermissionItem>;
