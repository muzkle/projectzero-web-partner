import { apiClient, unwrapData } from '@/shared/api/client';
import type { CreateStickerInput, Sticker, UpdateStickerInput } from '@/shared/types';

export async function fetchStickers(albumId: string) {
  const { data } = await apiClient.get<{ data: Sticker[] } | Sticker[]>(
    `/partner/albums/${albumId}/stickers`,
  );
  return unwrapData(data);
}

export async function fetchSticker(albumId: string, stickerId: string) {
  const { data } = await apiClient.get<{ data: Sticker } | Sticker>(
    `/partner/albums/${albumId}/stickers/${stickerId}`,
  );
  return unwrapData(data);
}

export async function createSticker(albumId: string, input: CreateStickerInput) {
  const { data } = await apiClient.post<{ data: Sticker } | Sticker>(
    `/partner/albums/${albumId}/stickers`,
    input,
  );
  return unwrapData(data);
}

export async function updateSticker(albumId: string, stickerId: string, input: UpdateStickerInput) {
  const { data } = await apiClient.patch<{ data: Sticker } | Sticker>(
    `/partner/albums/${albumId}/stickers/${stickerId}`,
    input,
  );
  return unwrapData(data);
}

export async function deleteSticker(albumId: string, stickerId: string) {
  const { data } = await apiClient.delete<{ data: { deleted: boolean } } | { deleted: boolean }>(
    `/partner/albums/${albumId}/stickers/${stickerId}`,
  );
  return unwrapData(data);
}
