import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppShell, UserMenu } from '@muzkle/ui';
import type { NavItemConfig } from '@muzkle/ui';
import { fetchMyPartner } from '@/shared/api/partners';
import { logout } from '@/shared/api/auth';
import { Badge, statusBadgeVariant } from '@/shared/ui/Badge';
import { PartnerHeaderSearch } from '@/features/search/PartnerHeaderSearch';

const navItems: NavItemConfig[] = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/albums', label: 'Álbuns', icon: '🎴' },
  { to: '/settings', label: 'Configurações', icon: '⚙️' },
];

export function AppLayout() {
  const navigate = useNavigate();
  const partnerQuery = useQuery({
    queryKey: ['partner', 'me'],
    queryFn: fetchMyPartner,
    retry: false,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const partner = partnerQuery.data;

  return (
    <AppShell
      brandName="ProjectZero"
      brandSubtitle="Partner Portal"
      navItems={navItems}
      headerSearch={<PartnerHeaderSearch />}
      userMenu={
        <UserMenu
          displayName={partner?.displayName ?? 'Parceiro'}
          items={[
            { label: 'Configurações', to: '/settings', icon: <span>⚙️</span> },
            { label: 'Sair', icon: <span>🚪</span>, danger: true, onClick: handleLogout },
          ]}
        />
      }
      sidebarFooter={
        partner ? (
          <Badge variant={statusBadgeVariant(partner.status)}>{partner.status}</Badge>
        ) : null
      }
      sidebarStorageKey="stickerverse-partner-sidebar"
    >
      <Outlet />
    </AppShell>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex flex-col items-center justify-center gap-2">
          <p className="font-display text-2xl font-bold ui-text-gradient">ProjectZero</p>
          <p className="text-sm text-white/50">Partner Portal</p>
        </Link>
        {children}
      </div>
    </div>
  );
}
