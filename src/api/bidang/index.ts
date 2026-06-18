import { api } from "@/libs/axios/api";
import { TDefaultResponse } from "@/commons/types/response";
import {
  TGetBidangParams,
  TBidangListResponse,
  TBidangCreateRequest,
  TBidangUpdateRequest,
  TBidangDetailResponse,
  TBidangUserAssignment,
  TBidangIkuAssignment,
  TBidangComponentAssignment,
} from "./type";


export const getListBidang = async (
  params?: TGetBidangParams
): Promise<TBidangListResponse> => {
  const res = await api.get("/api/bidang", { params });
  const responseData = res.data;
  if (responseData.data && !responseData.result) {
    if (Array.isArray(responseData.data)) {
      responseData.result = {
        data: responseData.data,
        total: responseData.data.length,
        currentPage: 1,
        totalPage: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    } else {
      const data = responseData.data.data || [];
      const pagination = responseData.data.pagination || {};
      responseData.result = {
        data: data,
        total: pagination.total || 0,
        currentPage: pagination.page || 1,
        totalPage: pagination.totalPages || 1,
        hasPreviousPage: (pagination.page || 1) > 1,
        hasNextPage: (pagination.page || 1) < (pagination.totalPages || 1),
      };
    }
  }
  return responseData;
};

export const createBidang = async (
  data: TBidangCreateRequest
): Promise<TDefaultResponse> => {
  const res = await api.post("/api/bidang", data);
  return res.data;
};

export const getBidangByUser = async (
  userId: string
): Promise<TBidangListResponse> => {
  const res = await api.get(`/api/bidang/by-user/${userId}`);
  const responseData = res.data;
  if (responseData.data && !responseData.result) {
    if (Array.isArray(responseData.data)) {
      responseData.result = {
        data: responseData.data,
        total: responseData.data.length,
        currentPage: 1,
        totalPage: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    } else {
      const data = responseData.data.data || [];
      const pagination = responseData.data.pagination || {};
      responseData.result = {
        data: data,
        total: pagination.total || 0,
        currentPage: pagination.page || 1,
        totalPage: pagination.totalPages || 1,
        hasPreviousPage: (pagination.page || 1) > 1,
        hasNextPage: (pagination.page || 1) < (pagination.totalPages || 1),
      };
    }
  }
  return responseData;
};

export const getDetailBidang = async (
  id: string
): Promise<TBidangDetailResponse> => {
  const res = await api.get(`/api/bidang/${id}`);
  const responseData = res.data;
  if (responseData.data && !responseData.result) {
    responseData.result = responseData.data;
  }
  return responseData;
};

export const updateBidang = async (
  id: string,
  data: TBidangUpdateRequest
): Promise<TDefaultResponse> => {
  const res = await api.put(`/api/bidang/${id}`, data);
  return res.data;
};

export const deleteBidang = async (
  id: string
): Promise<TDefaultResponse> => {
  const res = await api.delete(`/api/bidang/${id}`);
  return res.data;
};

// Users assignment
export const getBidangUsers = async (
  id: string
): Promise<{ success: boolean; data: { assignments: TBidangUserAssignment[] } }> => {
  const res = await api.get(`/api/bidang/${id}/users`);
  return res.data;
};



export const syncBidangUsers = async (
  id: string,
  userIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.put(`/api/bidang/${id}/users`, { userIds });
  return res.data;
};

export const assignBidangUsers = async (
  id: string,
  userIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.post(`/api/bidang/${id}/users/assign`, { userIds });
  return res.data;
};

export const unassignBidangUsers = async (
  id: string,
  userIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.delete(`/api/bidang/${id}/users/unassign`, { data: { userIds } });
  return res.data;
};

// IKUs assignment
export const getBidangIkus = async (
  id: string
): Promise<{ success: boolean; data: { ikus: TBidangIkuAssignment[] } }> => {
  const res = await api.get(`/api/bidang/${id}/ikus`);
  return res.data;
};



export const syncBidangIkus = async (
  id: string,
  ikuIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.put(`/api/bidang/${id}/ikus`, { ikuIds });
  return res.data;
};

export const assignBidangIkus = async (
  id: string,
  ikuIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.post(`/api/bidang/${id}/ikus/assign`, { ikuIds });
  return res.data;
};

export const unassignBidangIkus = async (
  id: string,
  ikuIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.delete(`/api/bidang/${id}/ikus/unassign`, { data: { ikuIds } });
  return res.data;
};

// Components list
export const getBidangComponents = async (
  id: string
): Promise<{ success: boolean; data: { components: TBidangComponentAssignment[] } }> => {
  const res = await api.get(`/api/bidang/${id}/components`);
  return res.data;
};


export const syncBidangComponents = async (
  id: string,
  componentIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.put(`/api/bidang/${id}/components`, { componentIds });
  return res.data;
};

export const assignBidangComponents = async (
  id: string,
  componentIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.post(`/api/bidang/${id}/components/assign`, { componentIds });
  return res.data;
};

export const unassignBidangComponents = async (
  id: string,
  componentIds: string[]
): Promise<TDefaultResponse> => {
  const res = await api.delete(`/api/bidang/${id}/components/unassign`, { data: { componentIds } });
  return res.data;
};


