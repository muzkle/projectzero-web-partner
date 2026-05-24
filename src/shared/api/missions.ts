import { apiClient, unwrapData } from '@/shared/api/client';
import type { CreateMissionInput, Mission, UpdateMissionInput } from '@/shared/types';

export async function fetchMission(albumId: string, stickerId: string) {
  const { data } = await apiClient.get<{ data: Mission } | Mission>(
    `/partner/albums/${albumId}/stickers/${stickerId}/mission`,
  );
  return unwrapData(data);
}

export async function createMission(
  albumId: string,
  stickerId: string,
  input: CreateMissionInput,
) {
  const { data } = await apiClient.post<{ data: Mission } | Mission>(
    `/partner/albums/${albumId}/stickers/${stickerId}/mission`,
    input,
  );
  return unwrapData(data);
}

export async function updateMission(
  albumId: string,
  stickerId: string,
  input: UpdateMissionInput,
) {
  const { data } = await apiClient.patch<{ data: Mission } | Mission>(
    `/partner/albums/${albumId}/stickers/${stickerId}/mission`,
    input,
  );
  return unwrapData(data);
}

export async function deleteMission(albumId: string, stickerId: string) {
  const { data } = await apiClient.delete<{ data: { deleted: boolean } } | { deleted: boolean }>(
    `/partner/albums/${albumId}/stickers/${stickerId}/mission`,
  );
  return unwrapData(data);
}
