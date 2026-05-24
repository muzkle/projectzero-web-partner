import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStore } from '@/shared/lib/auth-store';
import type { ApiErrorBody, AuthTokens } from '@/shared/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authStore.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<AuthTokens>(`${API_URL}/auth/refresh`, {
      refreshToken,
    });
    authStore.setAccessToken(data.accessToken);
    authStore.setRefreshToken(data.refreshToken);
    return data.accessToken;
  } catch {
    authStore.clear();
    return null;
  }
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const partnerId = authStore.getPartnerId();
  if (partnerId && config.url?.includes('/partner')) {
    config.headers['x-partner-id'] = partnerId;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function unwrapData<T>(payload: { data: T } | T): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}
