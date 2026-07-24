import axiosInstance, { authApiInstance } from "./config";
import prokerAxiosInstance from "./proker-config";

export const api = axiosInstance;
export const authApi = authApiInstance;
export const prokerApi = prokerAxiosInstance;