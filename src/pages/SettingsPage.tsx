import { useQuery } from '@tanstack/react-query';
import { fetchMyPartner } from '@/shared/api/partners';
import { Card, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { logout } from '@/shared/api/auth';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const navigate = useNavigate();
  const partnerQuery = useQuery({
    queryKey: ['partner', 'me'],
    queryFn: fetchMyPartner,
  });

  const partner = partnerQuery.data;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Configurações</h1>
        <p className="mt-1 text-sm text-white/60">Conta parceiro</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parceiro</CardTitle>
        </CardHeader>
        {partner ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Nome</dt>
              <dd className="font-medium text-white">{partner.displayName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Slug</dt>
              <dd className="font-medium text-white">{partner.slug}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Status</dt>
              <dd className="font-medium text-white">{partner.status}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-white/60">Carregando...</p>
        )}
        <Button variant="secondary" className="mt-4" onClick={handleLogout}>
          Sair
        </Button>
      </Card>
    </div>
  );
}
