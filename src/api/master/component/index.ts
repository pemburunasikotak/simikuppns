import { api } from "@/libs/axios/api";
import { TDetailParams } from "@/api/common";
import {
    TComponentDetailResponse,
    TComponentListResponse,
    TGetComponentParams,
    TComponentCreateRequest,
    TComponentTargetListResponse,
    TComponentTargetCreateRequest,
    TComponentTargetUpdateRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
    list: "/api/components",
    detail: "/api/components/:id",
    create: "/api/components",
    edit: "/api/components/:id",
    delete: "/api/components/:id",

    //target
    listTarget: "/api/component-targets",
    createTarget: "/api/component-targets",
    editTarget: "/api/component-targets/:id",
    deleteTarget: "/api/component-targets/:id",
};

export const getListComponent = async (
    params?: TGetComponentParams,
): Promise<TComponentListResponse> => {
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
                hasNextPage: false
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

export const getDetailComponent = async (
    params?: TDetailParams,
): Promise<TComponentDetailResponse> => {

    const res = await api.get(`/api/components/${params?.id}`);
    const responseData = res.data;
    if (responseData.data && !responseData.result) {
        if (Array.isArray(responseData.data)) {
            responseData.result = {
                data: responseData.data,
                total: responseData.data.length,
                currentPage: 1,
                totalPage: 1,
                hasPreviousPage: false,
                hasNextPage: false
            };
        } else {
            responseData.result = responseData.data;
        }
    }
    return responseData;
    // return res.data;
};

export const createComponent = async (req: TComponentCreateRequest): Promise<TDefaultResponse> => {
    const res = await api.post(endpoints.create, { ...req });
    return res.data;
};

export const deleteComponent = async (params: TDetailParams): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/components/${params?.id}`);
    return res.data;
};

export const editComponent = async (
    params: TDetailParams,
    req: TComponentCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.put(`/api/components/${params?.id}`, { ...req });
    return res.data;
};

export const getListComponentTarget = async (
    params: { componentId: string },
): Promise<TComponentTargetListResponse> => {
    const res = await api.get(endpoints.listTarget, { params });
    const responseData = res.data;
    if (responseData.data && !responseData.result) {
        responseData.result = responseData.data.data;
    }
    return responseData;
};

export const createComponentTarget = async (
    req: TComponentTargetCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.post(endpoints.createTarget, { ...req });
    return res.data;
};

export const editComponentTarget = async (
    params: TDetailParams,
    req: TComponentTargetUpdateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.put(`/api/component-targets/${params.id}`, { ...req });
    return res.data;
};

export const deleteComponentTarget = async (
    params: TDetailParams,
): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/component-targets/${params?.id}`);
    return res.data;
};

