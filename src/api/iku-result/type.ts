import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TIKUResultItem = {
    idResult: string;
    idIku: string;
    idPeriod: string;
    calculatedValue: string;
    formulaVersion: string;
    calculatedAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    iku?: {
        id?: string;
        name?: string;
        code?: string;
    };
    period?: {
        idPeriod?: string;
        periodName?: string;
    };
};

export type TGetIKUResultParams = {
    page?: number;
    limit?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    search?: string;
    search_value?: string;
    idIku?: string;
    idPeriod?: string;
};

export type TIKUResultListResponse = TResponsePaginate<TIKUResultItem>;
export type TIKUResultDetailResponse = TResponse<TIKUResultItem>;
