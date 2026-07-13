import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
import axios from "axios";
import { env } from "../env";
import { ProkerSessionToken } from "../localstorage/proker-session";

// const baseURL = 'https://proker.ntech.web.id'
export const prokerAxios = axios.create({
  baseURL: env.VITE_PROKER_API_BASE_URL,
  // baseURL: baseURL,
});

const prokerAxiosConfig: AxiosRequestConfig = {
  baseURL: env.VITE_PROKER_API_BASE_URL,
  // baseURL: baseURL,
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

const prokerAxiosInstance = axios.create(prokerAxiosConfig);

prokerAxiosInstance.interceptors.request.use(
  (config) => {
    const token = ProkerSessionToken.get()?.access_token;
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

        const sessionToken = ProkerSessionToken.get();
        if (sessionToken && sessionToken.refresh_token) {
          try {
            const { data } = await axios.post(`${env.VITE_AUTH_API_BASE_URL}/api/auth/refresh`, {
              refresh_token: sessionToken.refresh_token,
            });
            const newAccessToken = data?.access_token || data?.data?.access_token || data?.result?.access_token;
            const newRefreshToken = data?.refresh_token || data?.data?.refresh_token || data?.result?.refresh_token || sessionToken.refresh_token;

            if (newAccessToken) {
              ProkerSessionToken.set({
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
            ProkerSessionToken.remove?.();
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login-proker";
            }
            return Promise.reject(refreshError);
          }
        } else {
          ProkerSessionToken.remove?.();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login-proker";
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

addRefreshInterceptor(prokerAxiosInstance);

export default prokerAxiosInstance;

