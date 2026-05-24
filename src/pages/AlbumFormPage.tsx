import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAlbum,
  deleteAlbum,
  fetchAlbum,
  publishAlbum,
  updateAlbum,
} from '@/shared/api/albums';
import { getErrorMessage } from '@/shared/api/client';
import { slugify } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Spinner } from '@/shared/ui/Spinner';

export function AlbumFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const albumQuery = useQuery({
    queryKey: ['album', id],
    queryFn: () => fetchAlbum(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (albumQuery.data) {
      setTitle(albumQuery.data.title);
      setSlug(albumQuery.data.slug);
      setSlugTouched(true);
      setCoverUrl(albumQuery.data.coverUrl ?? '');
      setStartsAt(albumQuery.data.startsAt?.slice(0, 16) ?? '');
      setEndsAt(albumQuery.data.endsAt?.slice(0, 16) ?? '');
    }
  }, [albumQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        slug,
        coverUrl: coverUrl || undefined,
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      };

      if (isEdit) {
        return updateAlbum(id!, payload);
      }
      return createAlbum(payload);
    },
    onSuccess: (album) => {
      void queryClient.invalidateQueries({ queryKey: ['albums'] });
      navigate(isEdit ? `/albums/${album.id}/stickers` : `/albums/${album.id}/edit`);
    },
    onError: (err) => setError(getErrorMessage(err, 'Failed to save album')),
  });

  const publishMutation = useMutation({
    mutationFn: () => publishAlbum(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['album', id] });
      void queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAlbum(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['albums'] });
      navigate('/albums');
    },
    onError: (err) => setError(getErrorMessage(err, 'Failed to delete album')),
  });

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    saveMutation.mutate();
  };

  if (isEdit && albumQuery.isLoading) {
    return <Spinner label="Loading album..." />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/albums" className="text-sm text-brand-600 hover:text-brand-700">
          Back to albums
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {isEdit ? 'Edit album' : 'Create album'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Album details</CardTitle>
          <CardDescription>Basic information collectors will see in the catalog.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              required
              pattern="^[a-z0-9-]+$"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </div>

          <div>
            <Label htmlFor="coverUrl">Cover image URL</Label>
            <Input
              id="coverUrl"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="startsAt">Starts at</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endsAt">Ends at</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" loading={saveMutation.isPending}>
              {isEdit ? 'Save changes' : 'Create album'}
            </Button>
            {isEdit && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  loading={publishMutation.isPending}
                  onClick={() => publishMutation.mutate()}
                >
                  Publish album
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  loading={deleteMutation.isPending}
                  onClick={() => {
                    if (window.confirm('Delete this album? This cannot be undone.')) {
                      deleteMutation.mutate();
                    }
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
