import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TComponentRealizationFilter = TFilterParams;

export type TComponentRealizationItem = {
    idRealization: number;
    idComponent: string;
    idPeriod: string;
    year: number;
    month: number;
    value: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    component?: Record<string, unknown>;
    period?: Record<string, unknown>;
};

export type TComponentRealizationCreateRequest = {
    idComponent: string;
    // idPeriod: string;
    value: number;
    year?: number;
    month?: number;

};

export type TComponentRealizationUpdateRequest = {
    idComponent?: string;
    idPeriod?: string;
    year?: number;
    month?: number;
    value?: number;
};

export type TGetComponentRealizationParams = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
    idComponent?: string;
    idPeriod?: string;
};

export type TComponentRealizationListResponse = TResponsePaginate<TComponentRealizationItem>;
export type TComponentRealizationDetailResponse = TResponse<TComponentRealizationItem>;
