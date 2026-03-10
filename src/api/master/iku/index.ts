// import { generatePath } from "react-router";
import { api } from "@/libs/axios/api";

import { TDetailParams } from "@/api/common";
import {
    TIKUDetailResponse,
    TIKUListResponse,
    TGetIKUParams,
    TIKUCreateRequest,
    TIKUComponentCreateRequest,
    TIKUComponentListResponse,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
    list: "/api/ikus",
    detail: "/api/ikus/:id",
    create: "/api/ikus",
    edit: "/api/ikus/:id",
    delete: "/api/ikus/:id",

    //component
    listComponent: "/api/ikus/:id/components",
    createComponent: "/api/ikus/:id/components",
    deleteComponent: "/api/ikus/:id/components/:id",
};

export const getListIKU = async (
    params?: TGetIKUParams,
): Promise<TIKUListResponse> => {
    const res = await api.get(endpoints.list, { params });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const getDetailIKU = async (
    params?: TDetailParams,
): Promise<TIKUDetailResponse> => {

    const res = await api.get(`/api/ikus/${params?.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const createIKU = async (req: TIKUCreateRequest): Promise<TDefaultResponse> => {
    const res = await api.post(endpoints.create, { ...req });
    return res.data;
};

export const deleteIKU = async (params: TDetailParams): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/ikus/${params?.id}`);
    return res.data;
};

export const editIKU = async (
    params: TDetailParams,
    req: TIKUCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.patch(`/api/ikus/${params?.id}`, { ...req });
    return res.data;
};

export const getListComponent = async (
    params: TDetailParams,
): Promise<TIKUComponentListResponse> => {
    const res = await api.get(`/api/ikus/${params?.id}/components`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const createComponent = async (
    params: TDetailParams,
    req: TIKUComponentCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.post(`/api/ikus/${params?.id}/components`, { ...req });
    return res.data;
};

export const deleteComponent = async (
    ikuId: string,
    componentId: string,
): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/ikus/${ikuId}/components/${componentId}`);
    return res.data;
};
