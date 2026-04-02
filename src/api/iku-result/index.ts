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
            responseData.result = responseData.data;
        }
    }
    return responseData;
};
