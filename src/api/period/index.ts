import { api } from "@/libs/axios/api";
import { TDetailParams } from "@/api/common";
import {
    TPeriodDetailResponse,
    TPeriodListResponse,
    TGetPeriodParams,
    TPeriodCreateRequest,
    TPeriodUpdateRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

export const getListPeriod = async (
    params?: TGetPeriodParams,
): Promise<TPeriodListResponse> => {
    const res = await api.get("/api/periods", { params });
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
                hasNextPage: (pagination.page || 1) < (pagination.totalPages || 1)
            };
        }
    }
    return responseData;
};

export const getDetailPeriod = async (
    params?: TDetailParams,
): Promise<TPeriodDetailResponse> => {
    const res = await api.get(`/api/periods/${params?.id}`);
    const responseData = res.data;
    if (responseData.data && !responseData.result) {
        responseData.result = responseData.data;
    }
    return responseData;
};

export const createPeriod = async (
    req: TPeriodCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.post("/api/periods", { ...req });
    return res.data;
};

export const editPeriod = async (
    params: TDetailParams,
    req: TPeriodUpdateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.put(`/api/periods/${params?.id}`, { ...req });
    return res.data;
};

export const deletePeriod = async (
    params: TDetailParams,
): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/periods/${params?.id}`);
    return res.data;
};
