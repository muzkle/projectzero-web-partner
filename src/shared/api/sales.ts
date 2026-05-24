import { apiClient } from '@/shared/api/client';
import type { ApiListResponse, Purchase } from '@/shared/types';

export async function fetchSales(page = 1, limit = 20) {
  const { data } = await apiClient.get<ApiListResponse<Purchase[]>>('/partner/sales', {
    params: { page, limit },
  });
  return data;
}

export interface SalesStats {
  totalSales: number;
  totalRevenueCents: number;
  totalPlatformFeeCents: number;
  totalPartnerAmountCents: number;
}

export function computeSalesStats(purchases: Purchase[]): SalesStats {
  return purchases.reduce<SalesStats>(
    (acc, purchase) => ({
      totalSales: acc.totalSales + 1,
      totalRevenueCents: acc.totalRevenueCents + purchase.amountCents,
      totalPlatformFeeCents: acc.totalPlatformFeeCents + purchase.platformFeeCents,
      totalPartnerAmountCents: acc.totalPartnerAmountCents + purchase.partnerAmountCents,
    }),
    {
      totalSales: 0,
      totalRevenueCents: 0,
      totalPlatformFeeCents: 0,
      totalPartnerAmountCents: 0,
    },
  );
}
