import { apiClient, unwrapData } from '@/shared/api/client';
import type { Album, CreateAlbumInput, UpdateAlbumInput } from '@/shared/types';

export async function fetchAlbums() {
  const { data } = await apiClient.get<{ data: Album[] } | Album[]>('/partner/albums');
  return unwrapData(data);
}

export async function fetchAlbum(id: string) {
  const { data } = await apiClient.get<{ data: Album } | Album>(`/partner/albums/${id}`);
  return unwrapData(data);
}

export async function createAlbum(input: CreateAlbumInput) {
  const { data } = await apiClient.post<{ data: Album } | Album>('/partner/albums', input);
  return unwrapData(data);
}

export async function updateAlbum(id: string, input: UpdateAlbumInput) {
  const { data } = await apiClient.patch<{ data: Album } | Album>(`/partner/albums/${id}`, input);
  return unwrapData(data);
}

export async function deleteAlbum(id: string) {
  const { data } = await apiClient.delete<{ data: { deleted: boolean } } | { deleted: boolean }>(
    `/partner/albums/${id}`,
  );
  return unwrapData(data);
}

export async function publishAlbum(id: string) {
  const { data } = await apiClient.post<{ data: Album } | Album>(`/partner/albums/${id}/publish`);
  return unwrapData(data);
}
