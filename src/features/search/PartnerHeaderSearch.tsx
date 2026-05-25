import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@muzkle/ui';
import { fetchAlbums } from '@/shared/api/albums';

export function PartnerHeaderSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const albumsQuery = useQuery({ queryKey: ['albums'], queryFn: fetchAlbums });

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || !albumsQuery.data) return [];
    return albumsQuery.data.filter(
      (album) =>
        album.title.toLowerCase().includes(term) || album.slug.toLowerCase().includes(term),
    );
  }, [query, albumsQuery.data]);

  const results =
    query.trim().length >= 1 ? (
      <div className="py-2">
        {filtered.length === 0 ? (
          <p className="px-4 py-2 text-sm text-white/50">Nenhum álbum encontrado</p>
        ) : (
          filtered.slice(0, 8).map((album) => (
            <Link
              key={album.id}
              to={`/albums/${album.id}/stickers`}
              className="block rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/5"
            >
              {album.title}
            </Link>
          ))
        )}
      </div>
    ) : null;

  return (
    <SearchBar
      value={query}
      onChange={setQuery}
      onSubmit={() => {
        const first = filtered[0];
        if (first) navigate(`/albums/${first.id}/stickers`);
      }}
      placeholder="Buscar álbuns..."
      results={results}
    />
  );
}
