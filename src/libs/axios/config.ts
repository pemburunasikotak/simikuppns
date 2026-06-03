import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
import axios from "axios";

import { SessionToken } from "../cookies";
import { env } from "../env";

export const baseAxios = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

export const authAxios = axios.create({
  baseURL: env.VITE_AUTH_API_BASE_URL,
});

const axiosConfig: AxiosRequestConfig = {
  baseURL: env.VITE_API_BASE_URL,
  paramsSerializer: (params: Record<string, unknown> | undefined) => {
    const queryString = Object.entries(params || {})
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((val) => `${key}=${encodeURIComponent(String(val))}`).join("&");
        }
        return `${key}=${encodeURIComponent(String(value))}`;
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

const authAxiosConfig: AxiosRequestConfig = {
  baseURL: env.VITE_AUTH_API_BASE_URL,
  paramsSerializer: axiosConfig.paramsSerializer,
};

export const authApiInstance = axios.create(authAxiosConfig);

authApiInstance.interceptors.request.use(
  (config) => {
    const token = SessionToken.get()?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

const addRefreshInterceptor = (instance: AxiosInstance) => {
  let isRefreshing = false;
  let failedQueue: FailedRequest[] = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (originalRequest && error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const sessionToken = SessionToken.get();
        if (sessionToken && sessionToken.refresh_token) {
          try {
            const { data } = await axios.post(`${env.VITE_AUTH_API_BASE_URL}/api/auth/refresh`, {
              refresh_token: sessionToken.refresh_token,
            });
            const newAccessToken = data?.access_token || data?.data?.access_token || data?.result?.access_token;
            const newRefreshToken = data?.refresh_token || data?.data?.refresh_token || data?.result?.refresh_token || sessionToken.refresh_token;

            if (newAccessToken) {
              SessionToken.set({
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
              });
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }
              processQueue(null, newAccessToken);
              isRefreshing = false;
              return instance(originalRequest);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            isRefreshing = false;
            SessionToken.remove?.();
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login?error=Sesi habis. Silakan login kembali.";
            }
            return Promise.reject(refreshError);
          }
        } else {
          SessionToken.remove?.();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login?error=Sesi habis. Silakan login kembali.";
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

addRefreshInterceptor(axiosInstance);
addRefreshInterceptor(authApiInstance);

export default axiosInstance;
