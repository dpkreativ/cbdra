import "server-only";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { requiredEnv } from "@/lib/utils";

const DEFAULT_BASE_URL =
  requiredEnv("NEXT_PUBLIC_APP_URL") ||
  (requiredEnv("VERCEL_URL")
    ? `https://${requiredEnv("VERCEL_URL")}`
    : "http://localhost:3000");

export default async function axiosInstance<T = unknown>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;

  const mergedHeaders: AxiosRequestConfig["headers"] = {
    ...(config.headers ?? {}),
    ...(sessionValue ? { Cookie: `session=${sessionValue}` } : {}),
  };

  return axios<T>({
    withCredentials: true,
    ...config,
    headers: mergedHeaders,
    baseURL: config.baseURL ?? DEFAULT_BASE_URL,
  });
}
