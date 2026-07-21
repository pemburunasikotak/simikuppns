import { api, authApi } from "@/libs/axios/api";
import {
  TGetUnitsParams,
  TGetUnitUsersParams,
  TUnitListResponse,
  TUnitUsersResponse,
  TUnitIKUsResponse,
  TAssignUserRequest,
  TAssignIKURequest,
  TUnitCreateRequest,
  TUnitUpdateRequest,
} from "./type";

// ─── Get List Units ───────────────────────────────────────────────────────────

export const getUnits = async (params: TGetUnitsParams): Promise<TUnitListResponse> => {
  const { data } = await api({
    url: "/api/units",
    method: "GET",
    params,
  });
  return data.data;
};

// ─── Create Unit ──────────────────────────────────────────────────────────────

export const createUnit = async (
  body: TUnitCreateRequest
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await api({
    url: "/api/units",
    method: "POST",
    data: body,
  });
  return data;
};

// ─── Update Unit ──────────────────────────────────────────────────────────────

export const updateUnit = async (
  unitId: string,
  body: TUnitUpdateRequest
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await authApi({
    url: `/api/units/${unitId}`,
    method: "PUT",
    data: body,
  });
  return data;
};

// ─── Delete Unit ──────────────────────────────────────────────────────────────

export const deleteUnit = async (
  unitId: string
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await api({
    url: `/api/units/${unitId}`,
    method: "DELETE",
  });
  return data;
};

// ─── Get Unit Users ───────────────────────────────────────────────────────────

export const getUnitUsers = async (
  unitId: string,
  params: TGetUnitUsersParams
): Promise<TUnitUsersResponse> => {
  const { data } = await api({
    url: `/api/units/${unitId}/users`,
    method: "GET",
    params,
  });
  return data.data;
};

// ─── Assign User to Unit ──────────────────────────────────────────────────────

export const assignUsersToUnit = async (
  unitId: string,
  body: TAssignUserRequest
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await api({
    url: `/api/units/${unitId}/assign`,
    method: "POST",
    data: body,
  });
  return data;
};

// ─── Get Unit IKUs ────────────────────────────────────────────────────────────

export const getUnitIKUs = async (unitId: string): Promise<TUnitIKUsResponse> => {
  const { data } = await api({
    url: `/api/units/${unitId}/ikus`,
    method: "GET",
  });
  return data;
};

// ─── Replace Unit IKUs (PUT) ──────────────────────────────────────────────────

export const replaceUnitIKUs = async (
  unitId: string,
  body: TAssignIKURequest
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await api({
    url: `/api/units/${unitId}/ikus`,
    method: "PUT",
    data: body,
  });
  return data;
};

// ─── Assign IKUs to Unit ──────────────────────────────────────────────────────

export const assignIKUsToUnit = async (
  unitId: string,
  body: TAssignIKURequest
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await api({
    url: `/api/units/${unitId}/ikus/assign`,
    method: "POST",
    data: body,
  });
  return data;
};

// ─── Unassign IKUs from Unit ──────────────────────────────────────────────────

export const unassignIKUsFromUnit = async (
  unitId: string,
  body: TAssignIKURequest
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await api({
    url: `/api/units/${unitId}/ikus/unassign`,
    method: "DELETE",
    data: body,
  });
  return data;
};
