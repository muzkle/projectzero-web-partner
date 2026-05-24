import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { computeSalesStats, fetchSales } from '@/shared/api/sales';
import { useAuth } from '@/features/auth/AuthProvider';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui/Alert';
import { Badge, statusBadgeVariant } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </Card>
  );
}

export function DashboardPage() {
  const { partner } = useAuth();

  const salesQuery = useQuery({
    queryKey: ['sales'],
    queryFn: () => fetchSales(1, 50),
    enabled: partner?.status === 'active',
    retry: false,
  });

  const purchases = salesQuery.data?.data ?? [];
  const stats = computeSalesStats(purchases);
  const isPendingPartner = partner?.status === 'pending';

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track sales performance and manage your sticker catalog.
          </p>
        </div>
        <Link to="/albums/new">
          <Button>Create album</Button>
        </Link>
      </div>

      {partner && (
        <Alert variant={partner.status === 'active' ? 'success' : 'warning'}>
          Partner status: <strong className="capitalize">{partner.status}</strong>
          {isPendingPartner && ' — sales data will appear once your account is approved.'}
        </Alert>
      )}

      {isPendingPartner ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total sales" value="—" hint="Available when active" />
          <StatCard label="Gross revenue" value="—" hint="Available when active" />
          <StatCard label="Your earnings" value="—" hint="Available when active" />
          <StatCard label="Platform fees" value="—" hint="Available when active" />
        </div>
      ) : salesQuery.isLoading ? (
        <Spinner label="Loading sales..." />
      ) : salesQuery.isError ? (
        <Alert variant="warning">Could not load sales data. Stats below show placeholder values.</Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total sales" value={String(stats.totalSales)} />
          <StatCard label="Gross revenue" value={formatCurrency(stats.totalRevenueCents)} />
          <StatCard label="Your earnings" value={formatCurrency(stats.totalPartnerAmountCents)} />
          <StatCard label="Platform fees" value={formatCurrency(stats.totalPlatformFeeCents)} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent sales</CardTitle>
          <CardDescription>
            {partner?.status === 'active'
              ? 'Latest paid purchases from your stickers.'
              : 'Sales history preview — connect to live data when your partner account is active.'}
          </CardDescription>
        </CardHeader>

        {salesQuery.isLoading && partner?.status === 'active' ? (
          <Spinner label="Loading purchases..." />
        ) : purchases.length === 0 ? (
          <EmptyState
            title="No sales yet"
            description="When collectors buy your stickers, transactions will show up here."
            action={
              <Link to="/albums">
                <Button variant="secondary">Manage albums</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-2 py-3 font-medium">Purchase</th>
                  <th className="px-2 py-3 font-medium">Amount</th>
                  <th className="px-2 py-3 font-medium">Your share</th>
                  <th className="px-2 py-3 font-medium">Status</th>
                  <th className="px-2 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-slate-100">
                    <td className="px-2 py-3 font-mono text-xs text-slate-600">{purchase.id.slice(0, 8)}…</td>
                    <td className="px-2 py-3">{formatCurrency(purchase.amountCents)}</td>
                    <td className="px-2 py-3">{formatCurrency(purchase.partnerAmountCents)}</td>
                    <td className="px-2 py-3">
                      <Badge variant={statusBadgeVariant(purchase.status)}>{purchase.status}</Badge>
                    </td>
                    <td className="px-2 py-3 text-slate-500">{formatDate(purchase.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
