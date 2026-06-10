import { api } from "@/libs/axios/api";
import { TDetailParams } from "@/api/common";
import {
    TComponentRealizationDetailResponse,
    TComponentRealizationListResponse,
    TGetComponentRealizationParams,
    TComponentRealizationCreateRequest,
    TComponentRealizationUpdateRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
    list: "/api/component-realizations",
    create: "/api/component-realizations",
};

export const getListComponentRealization = async (
    params?: TGetComponentRealizationParams,
): Promise<TComponentRealizationListResponse> => {
    const res = await api.get(endpoints.list, { params });
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

export const getDetailComponentRealization = async (
    params?: TDetailParams,
): Promise<TComponentRealizationDetailResponse> => {
    const res = await api.get(`/api/realizations/component/${params?.id}/detail`);
    const responseData = res.data;
    if (responseData.data && !responseData.result) {
        responseData.result = responseData.data;
    }
    return responseData;
};

export const createComponentRealization = async (
    req: TComponentRealizationCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.post(endpoints.create, { ...req });
    return res.data;
};

export const editComponentRealization = async (
    params: TDetailParams,
    req: TComponentRealizationUpdateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.put(`/api/component-realizations/${params?.id}`, { ...req });

    return res.data;
};

export const deleteComponentRealization = async (
    params: TDetailParams,
): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/component-realizations/${params?.id}`);
    return res.data;
};
