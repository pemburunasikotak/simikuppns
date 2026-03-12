import { api } from "@/libs/axios/api";
import { TDetailParams } from "@/api/common";
import {
    TComponentDetailResponse,
    TComponentListResponse,
    TGetComponentParams,
    TComponentCreateRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
    list: "/api/components",
    detail: "/api/components/:id",
    create: "/api/components",
    edit: "/api/components/:id",
    delete: "/api/components/:id",
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
            responseData.result = responseData.data;
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
    const res = await api.patch(`/api/components/${params?.id}`, { ...req });
    return res.data;
};

