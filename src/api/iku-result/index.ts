import { api } from "@/libs/axios/api";
import { TGetIKUResultParams, TIKUResultListResponse } from "./type";

export const getListIKUResult = async (
    params?: TGetIKUResultParams,
): Promise<TIKUResultListResponse> => {
    const res = await api.get("/api/iku-results", { params });
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
