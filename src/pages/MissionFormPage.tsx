import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSticker } from '@/shared/api/stickers';
import {
  createMission,
  deleteMission,
  fetchMission,
  updateMission,
} from '@/shared/api/missions';
import { getErrorMessage } from '@/shared/api/client';
import type { MissionType } from '@/shared/types';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select } from '@/shared/ui/Select';
import { Spinner } from '@/shared/ui/Spinner';

const MISSION_TYPES: { value: MissionType; label: string }[] = [
  { value: 'spotify_track_plays', label: 'Spotify track plays' },
  { value: 'steam_achievement', label: 'Steam achievement' },
  { value: 'manual_code', label: 'Manual code' },
];

export function MissionFormPage() {
  const { albumId = '', stickerId = '' } = useParams();
  const queryClient = useQueryClient();

  const [type, setType] = useState<MissionType>('spotify_track_plays');
  const [trackId, setTrackId] = useState('');
  const [minPlays, setMinPlays] = useState('10');
  const [windowDays, setWindowDays] = useState('7');
  const [appId, setAppId] = useState('');
  const [achievementApiName, setAchievementApiName] = useState('');
  const [codeHash, setCodeHash] = useState('');
  const [maxRedemptions, setMaxRedemptions] = useState('');
  const [windowStart, setWindowStart] = useState('');
  const [windowEnd, setWindowEnd] = useState('');
  const [requiresMission, setRequiresMission] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stickerQuery = useQuery({
    queryKey: ['sticker', albumId, stickerId],
    queryFn: () => fetchSticker(albumId, stickerId),
  });

  const missionQuery = useQuery({
    queryKey: ['mission', albumId, stickerId],
    queryFn: () => fetchMission(albumId, stickerId),
    retry: false,
  });

  useEffect(() => {
    if (missionQuery.data) {
      const mission = missionQuery.data;
      setType(mission.type);
      setTrackId(mission.config.trackId ?? '');
      setMinPlays(String(mission.config.minPlays ?? 10));
      setWindowDays(String(mission.config.windowDays ?? 7));
      setAppId(mission.config.appId?.toString() ?? '');
      setAchievementApiName(mission.config.achievementApiName ?? '');
      setCodeHash(mission.config.codeHash ?? '');
      setMaxRedemptions(mission.config.maxRedemptions?.toString() ?? '');
      setWindowStart(mission.windowStart?.slice(0, 16) ?? '');
      setWindowEnd(mission.windowEnd?.slice(0, 16) ?? '');
      setRequiresMission(mission.requiresMission);
    }
  }, [missionQuery.data]);

  const buildPayload = () => ({
    type,
    config: {
      ...(type === 'spotify_track_plays' && {
        trackId,
        minPlays: Number(minPlays),
        windowDays: Number(windowDays),
      }),
      ...(type === 'steam_achievement' && {
        appId: Number(appId),
        achievementApiName,
      }),
      ...(type === 'manual_code' && {
        codeHash,
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
      }),
    },
    windowStart: windowStart ? new Date(windowStart).toISOString() : undefined,
    windowEnd: windowEnd ? new Date(windowEnd).toISOString() : undefined,
    requiresMission,
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = buildPayload();
      if (missionQuery.data) {
        return updateMission(albumId, stickerId, payload);
      }
      return createMission(albumId, stickerId, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['mission', albumId, stickerId] });
    },
    onError: (err) => setError(getErrorMessage(err, 'Failed to save mission')),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMission(albumId, stickerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['mission', albumId, stickerId] });
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    saveMutation.mutate();
  };

  if (stickerQuery.isLoading || missionQuery.isLoading) {
    return <Spinner label="Loading mission..." />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          to={`/albums/${albumId}/stickers`}
          className="text-sm text-brand-600 hover:text-brand-700"
        >
          Back to stickers
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Mission — {stickerQuery.data?.name ?? 'Sticker'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure how collectors unlock or claim this sticker.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{missionQuery.data ? 'Edit mission' : 'Create mission'}</CardTitle>
          <CardDescription>
            Missions gate sticker acquisition through Spotify, Steam, or promo codes.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <Label htmlFor="type">Mission type</Label>
            <Select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as MissionType)}
            >
              {MISSION_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {type === 'spotify_track_plays' && (
            <>
              <div>
                <Label htmlFor="trackId">Spotify track ID</Label>
                <Input id="trackId" required value={trackId} onChange={(e) => setTrackId(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="minPlays">Minimum plays</Label>
                  <Input
                    id="minPlays"
                    type="number"
                    min={1}
                    required
                    value={minPlays}
                    onChange={(e) => setMinPlays(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="windowDays">Window (days)</Label>
                  <Input
                    id="windowDays"
                    type="number"
                    min={1}
                    required
                    value={windowDays}
                    onChange={(e) => setWindowDays(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {type === 'steam_achievement' && (
            <>
              <div>
                <Label htmlFor="appId">Steam app ID</Label>
                <Input
                  id="appId"
                  type="number"
                  required
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="achievementApiName">Achievement API name</Label>
                <Input
                  id="achievementApiName"
                  required
                  value={achievementApiName}
                  onChange={(e) => setAchievementApiName(e.target.value)}
                />
              </div>
            </>
          )}

          {type === 'manual_code' && (
            <>
              <div>
                <Label htmlFor="codeHash">Code hash</Label>
                <Input
                  id="codeHash"
                  required
                  value={codeHash}
                  onChange={(e) => setCodeHash(e.target.value)}
                  placeholder="SHA-256 hash of promo code"
                />
              </div>
              <div>
                <Label htmlFor="maxRedemptions">Max redemptions</Label>
                <Input
                  id="maxRedemptions"
                  type="number"
                  min={1}
                  value={maxRedemptions}
                  onChange={(e) => setMaxRedemptions(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="windowStart">Window start</Label>
              <Input
                id="windowStart"
                type="datetime-local"
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="windowEnd">Window end</Label>
              <Input
                id="windowEnd"
                type="datetime-local"
                value={windowEnd}
                onChange={(e) => setWindowEnd(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={requiresMission}
              onChange={(e) => setRequiresMission(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Require mission completion before purchase
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" loading={saveMutation.isPending}>
              {missionQuery.data ? 'Save mission' : 'Create mission'}
            </Button>
            {missionQuery.data && (
              <Button
                type="button"
                variant="danger"
                loading={deleteMutation.isPending}
                onClick={() => {
                  if (window.confirm('Delete this mission?')) {
                    deleteMutation.mutate();
                  }
                }}
              >
                Delete mission
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
