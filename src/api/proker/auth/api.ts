import { TLoginParam, TLoginResponse } from "../../auth/type";
import axios from "axios";
import { env } from "@/libs/env";
import { ProkerSessionToken } from "@/libs/localstorage/proker-session";

export const prokerAuthApi = axios.create({
  baseURL: env.VITE_AUTH_API_BASE_URL,
});

prokerAuthApi.interceptors.request.use((config) => {
  const token = ProkerSessionToken.get()?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postLoginProker = async (payload: TLoginParam): Promise<TLoginResponse> => {
  const { data } = await axios.post(`${env.VITE_AUTH_API_BASE_URL}/api/auth/login`, payload);
  return data;
};

export const postLogoutProker = async (): Promise<unknown> => {
  const { data } = await prokerAuthApi.post("/api/auth/logout");
  return data;
};

export const postRefreshProker = async (payload: { refresh_token: string }): Promise<unknown> => {
  const { data } = await axios.post(`${env.VITE_AUTH_API_BASE_URL}/api/auth/refresh`, payload);
  return data;
};
