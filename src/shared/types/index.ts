export type UserRole = 'user' | 'partner_member' | 'admin';

export type PartnerStatus = 'pending' | 'active' | 'suspended';

export type AlbumStatus = 'draft' | 'published' | 'archived';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type MissionType = 'spotify_track_plays' | 'steam_achievement' | 'manual_code';

export type PurchaseStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  isMinor?: boolean;
  createdAt: string;
}

export interface Partner {
  id: string;
  legalName: string;
  displayName: string;
  slug: string;
  status: PartnerStatus;
  stripeConnectAccountId?: string;
  platformFeePercent: number;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface AuthMe {
  id: string;
  email: string;
  role: UserRole;
  partnerId?: string;
}

export interface Album {
  id: string;
  partnerId: string;
  title: string;
  slug: string;
  coverUrl?: string;
  status: AlbumStatus;
  startsAt?: string;
  endsAt?: string;
  stickerCount?: number;
}

export interface MissionConfig {
  trackId?: string;
  minPlays?: number;
  windowDays?: number;
  appId?: number;
  achievementApiName?: string;
  codeHash?: string;
  maxRedemptions?: number;
}

export interface Mission {
  id: string;
  stickerId: string;
  type: MissionType;
  config: MissionConfig;
  windowStart?: string;
  windowEnd?: string;
  requiresMission: boolean;
}

export interface Sticker {
  id: string;
  albumId: string;
  partnerId: string;
  name: string;
  description?: string;
  imageUrl: string;
  rarity: Rarity;
  supplyTotal?: number;
  supplyMinted: number;
  priceCents: number;
  currency: string;
  status: string;
  mission?: Mission;
}

export interface Purchase {
  id: string;
  userId: string;
  stickerId: string;
  amountCents: number;
  platformFeeCents: number;
  partnerAmountCents: number;
  status: PurchaseStatus;
  createdAt: string;
}

export interface CreatePartnerRequest {
  legalName: string;
  displayName: string;
  slug: string;
}

export interface CreateAlbumInput {
  title: string;
  slug: string;
  coverUrl?: string;
  startsAt?: string;
  endsAt?: string;
}

export interface UpdateAlbumInput {
  title?: string;
  slug?: string;
  coverUrl?: string;
  startsAt?: string;
  endsAt?: string;
}

export interface CreateStickerInput {
  name: string;
  description?: string;
  imageUrl: string;
  rarity: Rarity;
  supplyTotal?: number;
  priceCents: number;
}

export interface UpdateStickerInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  rarity?: Rarity;
  supplyTotal?: number;
  priceCents?: number;
}

export interface CreateMissionInput {
  type: MissionType;
  config: MissionConfig;
  windowStart?: string;
  windowEnd?: string;
  requiresMission?: boolean;
}

export interface UpdateMissionInput {
  type?: MissionType;
  config?: MissionConfig;
  windowStart?: string;
  windowEnd?: string;
  requiresMission?: boolean;
}

export interface ApiErrorBody {
  message?: string;
  code?: string;
  statusCode?: number;
}
