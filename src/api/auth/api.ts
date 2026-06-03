import { TLoginOidcParam, TLoginParam, TLoginResponse } from "./type";
import { authAxios } from "@/libs/axios/config";
import { authApi } from "@/libs/axios/api";

export const postLogin = async (payload: TLoginParam): Promise<TLoginResponse> => {
  const { data } = await authAxios({
    url: "/api/auth/login",
    method: "POST",
    data: payload,
  });
  return data;
};

export const postLoginOidc = async (payload: TLoginOidcParam): Promise<TLoginResponse> => {
  const { data } = await authAxios({
    url: "/api/auth/login",
    method: "POST",
    data: payload,
  });
  return data;
};

export const postLogout = async (): Promise<unknown> => {
  const { data } = await authApi({
    url: "/api/auth/logout",
    method: "POST",
  });
  return data;
};

export const postRefresh = async (payload: { refresh_token: string }): Promise<unknown> => {
  const { data } = await authApi({
    url: "/api/auth/refresh",
    method: "POST",
    data: payload,
  });
  return data;
};

export const getValidate = async (): Promise<unknown> => {
  const { data } = await authApi({
    url: "/api/auth/validate",
    method: "GET",
  });
  return data;
};
