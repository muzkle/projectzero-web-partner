import { apiClient, unwrapData } from '@/shared/api/client';
import { authStore } from '@/shared/lib/auth-store';
import type { CreatePartnerRequest, Partner } from '@/shared/types';

export async function fetchMyPartner() {
  const { data } = await apiClient.get<{ data: Partner } | Partner>('/partners/me');
  const partner = unwrapData(data);
  authStore.setPartnerId(partner.id);
  return partner;
}

export async function requestPartner(input: CreatePartnerRequest) {
  const { data } = await apiClient.post<{ data: Partner } | Partner>('/partners/request', input);
  const partner = unwrapData(data);
  authStore.setPartnerId(partner.id);
  return partner;
}
