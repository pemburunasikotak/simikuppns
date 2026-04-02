import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TPeriodFilter = TFilterParams;

export type TPeriodItem = {
    idPeriod: string;
    year: number;
    periodType: string;
    periodValue: number;
    periodName: string;
    level: number;
    parentId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
};

export type TPeriodCreateRequest = {
    year: number;
    periodType: string;
    periodValue: number;
    periodName: string;
    level: number;
    parentId?: string | null;
};

export type TPeriodUpdateRequest = {
    year?: number;
    periodType?: string;
    periodValue?: number;
    periodName?: string;
    level?: number;
    parentId?: string | null;
};

export type TGetPeriodParams = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
    year?: number;
    periodType?: string;
};

export type TPeriodListResponse = TResponsePaginate<TPeriodItem>;
export type TPeriodDetailResponse = TResponse<TPeriodItem>;
