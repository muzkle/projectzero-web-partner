import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAlbum } from '@/shared/api/albums';
import { createSticker, deleteSticker, fetchStickers, updateSticker } from '@/shared/api/stickers';
import { getErrorMessage } from '@/shared/api/client';
import type { Rarity, Sticker } from '@/shared/types';
import { formatCurrency } from '@/shared/lib/utils';
import { StickerFrame } from '@muzkle/ui';
import { Alert } from '@/shared/ui/Alert';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select } from '@/shared/ui/Select';
import { Spinner } from '@/shared/ui/Spinner';
import { Textarea } from '@/shared/ui/Textarea';

const RARITIES: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

const emptyForm = {
  name: '',
  description: '',
  imageUrl: '',
  rarity: 'common' as Rarity,
  supplyTotal: '',
  priceCents: '',
};

export function StickersPage() {
  const { albumId = '' } = useParams();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Sticker | null>(null);
  const [error, setError] = useState<string | null>(null);

  const albumQuery = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => fetchAlbum(albumId),
  });

  const stickersQuery = useQuery({
    queryKey: ['stickers', albumId],
    queryFn: () => fetchStickers(albumId),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setError(null);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        imageUrl: form.imageUrl,
        rarity: form.rarity,
        supplyTotal: form.supplyTotal ? Number(form.supplyTotal) : undefined,
        priceCents: Number(form.priceCents),
      };

      if (editing) {
        return updateSticker(albumId, editing.id, payload);
      }
      return createSticker(albumId, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['stickers', albumId] });
      resetForm();
    },
    onError: (err) => setError(getErrorMessage(err, 'Failed to save sticker')),
  });

  const deleteMutation = useMutation({
    mutationFn: (stickerId: string) => deleteSticker(albumId, stickerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['stickers', albumId] });
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    saveMutation.mutate();
  };

  const startEdit = (sticker: Sticker) => {
    setEditing(sticker);
    setForm({
      name: sticker.name,
      description: sticker.description ?? '',
      imageUrl: sticker.imageUrl,
      rarity: sticker.rarity,
      supplyTotal: sticker.supplyTotal?.toString() ?? '',
      priceCents: String(sticker.priceCents),
    });
  };

  if (albumQuery.isLoading || stickersQuery.isLoading) {
    return <Spinner label="Loading stickers..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/albums" className="text-sm text-accent-light hover:text-accent">
          Voltar aos álbuns
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">
          Figurinhas — {albumQuery.data?.title ?? 'Álbum'}
        </h1>
        <p className="mt-1 text-sm text-white/60">Gerencie figurinhas e preços. Imagens recomendadas: 600×800 (3:4).</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Visualização ao vivo com frame de raridade.</CardDescription>
            </CardHeader>
            <div className="mx-auto max-w-[200px]">
              <StickerFrame
                rarity={form.rarity}
                imageUrl={form.imageUrl || undefined}
                alt={form.name || 'Preview'}
                size="md"
              />
              {form.name && (
                <p className="mt-2 truncate text-center text-sm font-medium text-white">{form.name}</p>
              )}
            </div>
          </Card>

          <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit sticker' : 'Add sticker'}</CardTitle>
            <CardDescription>
              {editing ? 'Update sticker details.' : 'Create a new sticker for this album.'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error">{error}</Alert>}

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                required
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="rarity">Rarity</Label>
              <Select
                id="rarity"
                value={form.rarity}
                onChange={(e) => setForm((prev) => ({ ...prev, rarity: e.target.value as Rarity }))}
              >
                {RARITIES.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="priceCents">Price (cents)</Label>
                <Input
                  id="priceCents"
                  required
                  type="number"
                  min={0}
                  value={form.priceCents}
                  onChange={(e) => setForm((prev) => ({ ...prev, priceCents: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="supplyTotal">Supply</Label>
                <Input
                  id="supplyTotal"
                  type="number"
                  min={1}
                  value={form.supplyTotal}
                  onChange={(e) => setForm((prev) => ({ ...prev, supplyTotal: e.target.value }))}
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" loading={saveMutation.isPending}>
                {editing ? 'Save sticker' : 'Add sticker'}
              </Button>
              {editing && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
        </div>

        <div className="space-y-4">
          {!stickersQuery.data?.length ? (
            <EmptyState
              title="No stickers yet"
              description="Add your first sticker using the form on the left."
            />
          ) : (
            stickersQuery.data.map((sticker) => (
              <Card key={sticker.id} className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={sticker.imageUrl}
                  alt={sticker.name}
                  className="h-28 w-28 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{sticker.name}</h3>
                      <p className="text-sm text-slate-500">{formatCurrency(sticker.priceCents)}</p>
                    </div>
                    <Badge>{sticker.rarity}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Minted {sticker.supplyMinted}
                    {sticker.supplyTotal ? ` / ${sticker.supplyTotal}` : ''}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => startEdit(sticker)}>
                      Edit
                    </Button>
                    <Link to={`/albums/${albumId}/stickers/${sticker.id}/mission`}>
                      <Button size="sm">Mission</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Delete "${sticker.name}"?`)) {
                          deleteMutation.mutate(sticker.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
