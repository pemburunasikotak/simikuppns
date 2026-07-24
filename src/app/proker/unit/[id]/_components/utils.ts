import { AxiosError } from "axios";

export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return String(err.response.data.message);
  }
  if (err instanceof Error) return err.message;
  return fallback;
};
