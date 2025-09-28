import "server-only";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { cookies } from "next/headers";

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
  });
}
