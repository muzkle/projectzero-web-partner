import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMyPartner } from '@/shared/api/partners';
import { logout } from '@/shared/api/auth';
import { Badge, statusBadgeVariant } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/albums', label: 'Albums', end: false },
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

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              PZ
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">ProjectZero</p>
              <p className="text-xs text-slate-500">Partner Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {partnerQuery.data && (
              <Badge variant={statusBadgeVariant(partnerQuery.data.status)}>
                {partnerQuery.data.displayName}
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'block rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white md:hidden">
        <div className="flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex-1 py-3 text-center text-xs font-medium',
                  isActive ? 'text-brand-700' : 'text-slate-500',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-brand-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            PZ
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">ProjectZero</p>
            <p className="text-sm text-slate-500">Partner Portal</p>
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
}
