import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { requestPartner } from '@/shared/api/partners';
import { useAuth } from '@/features/auth/AuthProvider';
import { getErrorMessage } from '@/shared/api/client';
import { slugify } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';

export function RequestPartnerPage() {
  const navigate = useNavigate();
  const { refreshAuth, partner } = useAuth();
  const [legalName, setLegalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: requestPartner,
    onSuccess: async () => {
      await refreshAuth();
      navigate('/');
    },
    onError: (err) => setError(getErrorMessage(err, 'Could not submit partner request')),
  });

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    mutation.mutate({ legalName, displayName, slug });
  };

  if (partner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partner account ready</CardTitle>
          <CardDescription>
            You are registered as {partner.displayName}. Status: {partner.status}.
          </CardDescription>
        </CardHeader>
        <Button onClick={() => navigate('/')}>Go to dashboard</Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Become a partner</CardTitle>
        <CardDescription>
          Submit your organization details. Our team will review and activate your account.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div>
          <Label htmlFor="legalName">Legal name</Label>
          <Input
            id="legalName"
            required
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            placeholder="Acme Entertainment Ltd."
          />
        </div>

        <div>
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            required
            value={displayName}
            onChange={(e) => handleDisplayNameChange(e.target.value)}
            placeholder="Acme Stickers"
          />
        </div>

        <div>
          <Label htmlFor="slug">Public slug</Label>
          <Input
            id="slug"
            required
            pattern="^[a-z0-9-]+$"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="acme-stickers"
          />
          <p className="mt-1 text-xs text-slate-500">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        <Button type="submit" loading={mutation.isPending}>
          Submit partner request
        </Button>
      </form>
    </Card>
  );
}
