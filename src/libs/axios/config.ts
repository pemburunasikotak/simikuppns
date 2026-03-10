import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";

import { SessionToken } from "../cookies";
import { env } from "../env";

export const baseAxios = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

const axiosConfig: AxiosRequestConfig = {
  baseURL: env.VITE_API_BASE_URL,
  paramsSerializer: (params) => {
    const queryString = Object.entries(params || {})
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((val) => `${key}=${encodeURIComponent(val)}`).join("&");
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");
    return queryString;
  },
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = SessionToken.get()?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      SessionToken.remove?.();

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login?error=Sesi habis. Silakan login kembali.";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
