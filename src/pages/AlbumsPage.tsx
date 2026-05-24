import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAlbums } from '@/shared/api/albums';
import { Badge, statusBadgeVariant } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Spinner } from '@/shared/ui/Spinner';

export function AlbumsPage() {
  const albumsQuery = useQuery({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Albums</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage your sticker collections.</p>
        </div>
        <Link to="/albums/new">
          <Button>New album</Button>
        </Link>
      </div>

      {albumsQuery.isLoading ? (
        <Spinner label="Loading albums..." />
      ) : albumsQuery.isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load albums</CardTitle>
            <CardDescription>Check your connection and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : !albumsQuery.data?.length ? (
        <EmptyState
          title="No albums yet"
          description="Create your first album to start adding stickers and missions."
          action={
            <Link to="/albums/new">
              <Button>Create album</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albumsQuery.data.map((album) => (
            <Card key={album.id} className="flex flex-col">
              {album.coverUrl ? (
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700">
                  <span className="text-3xl font-bold">{album.title.slice(0, 1)}</span>
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{album.title}</h3>
                  <p className="text-sm text-slate-500">/{album.slug}</p>
                </div>
                <Badge variant={statusBadgeVariant(album.status)}>{album.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {album.stickerCount ?? 0} sticker{(album.stickerCount ?? 0) === 1 ? '' : 's'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/albums/${album.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
                <Link to={`/albums/${album.id}/stickers`}>
                  <Button size="sm">Stickers</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
