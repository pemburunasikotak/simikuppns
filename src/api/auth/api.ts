import { api } from "@/libs/axios/api";
import { TLoginOidcParam, TLoginParam, TLoginResponse } from "./type";
import { baseAxios } from "@/libs/axios/config";

export const postLogin = async (payload: TLoginParam): Promise<TLoginResponse> => {
  const { data } = await baseAxios({
    url: "/api/auth/login",
    method: "POST",
    data: payload,
  });
  return data;
};

export const postLoginOidc = async (payload: TLoginOidcParam): Promise<TLoginResponse> => {
  const { data } = await api({
    url: "/api/auth/login",
    method: "POST",
    data: payload,
  });
  return data;
};
