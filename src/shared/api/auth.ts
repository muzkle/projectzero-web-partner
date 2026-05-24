import { apiClient, unwrapData } from '@/shared/api/client';
import { authStore } from '@/shared/lib/auth-store';
import type { AuthMe, AuthTokens } from '@/shared/types';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export async function login(input: LoginInput) {
  const { data } = await apiClient.post<AuthTokens>('/auth/login', input);
  authStore.setAccessToken(data.accessToken);
  authStore.setRefreshToken(data.refreshToken);
  return data;
}

export async function register(input: RegisterInput) {
  const { data } = await apiClient.post<AuthTokens>('/auth/register', input);
  authStore.setAccessToken(data.accessToken);
  authStore.setRefreshToken(data.refreshToken);
  return data;
}

export async function fetchMe() {
  const { data } = await apiClient.get<{ data: AuthMe } | AuthMe>('/auth/me');
  return unwrapData(data);
}

export async function logout() {
  authStore.clear();
}

export async function bootstrapSession() {
  if (authStore.getAccessToken()) return true;

  const refreshToken = authStore.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const { data } = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
    authStore.setAccessToken(data.accessToken);
    authStore.setRefreshToken(data.refreshToken);
    return true;
  } catch {
    authStore.clear();
    return false;
  }
}
