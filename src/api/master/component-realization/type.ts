import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TComponentRealizationFilter = TFilterParams;

export type TComponentRealizationItem = {
    idRealization: string; // Changed from number to string based on JSON
    idComponent: string;
    idPeriod: string;
    year: number;
    month: number;
    value: number | string;
    createdAt?: string | null;
    updatedAt?: string | null;
    component?: Record<string, unknown>;
    period?: Record<string, unknown>;
};

export type TDocument = {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
    createdAt?: string;
    updatedAt?: string;
};

export type TRealizationDocument = {
    id: string;
    documentId: string;
    realizationId: string;
    document?: TDocument;
    createdAt?: string;
};

export type TRealizationDetail = {
    metric: Record<string, unknown>;
    realization: TComponentRealizationItem & { documents: TRealizationDocument[] };
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
export type TComponentRealizationDetailResponse = TResponse<TRealizationDetail>;
