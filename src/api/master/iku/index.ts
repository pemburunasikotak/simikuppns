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
    TIKUFormulaCreateRequest,
    TIKUFormulaTestRequest,
    TIKUFormulaComponentResponse,
    TIKUTargetListResponse,
    TIKUTargetCreateRequest,
    TIKUTargetUpdateRequest,
    TIKUTargetDetailResponse,
    TIKUFormulaItem,
} from "./type";
import { TDefaultResponse, TResponse } from "@/commons/types/response";

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

    //formula
    listFormula: "/api/iku-formulas",
    createFormula: "/api/iku-formulas",
    deleteFormula: "/api/iku-formulas/:id",

    //target
    listTarget: "/api/iku-targets",
    createTarget: "/api/iku-targets",
    detailTarget: "/api/iku-targets/:id",
    editTarget: "/api/iku-targets/:id",
    deleteTarget: "/api/iku-targets/:id",
};

export const getListIKU = async (
    params?: TGetIKUParams,
): Promise<TIKUListResponse> => {
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

export const getDetailIKU = async (
    params?: TDetailParams,
): Promise<TIKUDetailResponse> => {

    const res = await api.get(`/api/ikus/${params?.id}`);
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
    console.log('CEK ID', ikuId, componentId);
    const res = await api.delete(`/api/ikus/${ikuId}/components/${componentId}`);
    return res.data;
};

export const getListFormula = async (
    params: { ikuId: string },
): Promise<TIKUComponentListResponse> => {
    const res = await api.get(`/api/iku-formulas`, { params });
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

export const getDetailFormula = async (
    id: string,
): Promise<TResponse<TIKUFormulaItem>> => {
    const res = await api.get(`/api/iku-formulas/${id}`);
    const responseData = res.data;
    if (responseData.data && !responseData.result) {
        responseData.result = responseData.data;
    }
    return responseData;
};

export const deleteFormula = async (
    id: string,
): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/iku-formulas/${id}`);
    return res.data;
};

export const createFormula = async (
    req: TIKUFormulaCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.post(`/api/iku-formulas`, { ...req });
    return res.data;
};

export const editFormula = async (
    id: string,
    req: TIKUFormulaCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.put(`/api/iku-formulas/${id}`, { ...req });
    return res.data;
};

export const testFormula = async (
    id: string,
    req: TIKUFormulaTestRequest,
): Promise<TDefaultResponse> => {
    const res = await api.post(`/api/iku-formulas/${id}/test`, { ...req });
    return res.data;
};

export const getFormulaComponents = async (
    id: string,
): Promise<TIKUFormulaComponentResponse> => {
    const res = await api.get(`/api/iku-formulas/${id}/components`);
    return res.data;
};

export const getListIKUTarget = async (
    params: { ikuId: string },
): Promise<TIKUTargetListResponse> => {
    const res = await api.get(endpoints.listTarget, { params });
    const responseData = res.data;
    if (responseData.data && !responseData.result) {
        responseData.result = responseData.data.data;
    }
    return responseData;
    // return res.data
};

export const createIKUTarget = async (
    req: TIKUTargetCreateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.post(endpoints.createTarget, { ...req });
    return res.data;
};

export const deleteIKUTarget = async (
    params: TDetailParams,
): Promise<TDefaultResponse> => {
    const res = await api.delete(`/api/iku-targets/${params.id}`);
    return res.data;
};

export const getDetailIKUTarget = async (
    params: TDetailParams,
): Promise<TIKUTargetDetailResponse> => {
    const res = await api.get(`/api/iku-targets/${params.id}`);
    return res.data;
};

export const editIKUTarget = async (
    params: TDetailParams,
    req: TIKUTargetUpdateRequest,
): Promise<TDefaultResponse> => {
    const res = await api.put(`/api/iku-targets/${params.id}`, { ...req });
    return res.data;
};