# projectzero-web-partner

Partner portal for ProjectZero — manage albums, stickers, missions, and sales.

**Layout:** desktop-first shell via [`@muzkle/ui`](https://github.com/muzkle/projectzero-ui) — tema escuro unificado com web-user, preview de figurinha com frame por raridade.

## Stack

- React 18 + Vite + TypeScript
- `@muzkle/ui@0.1.0` (GitHub Packages)
- Tailwind CSS (tema escuro premium)
- React Router v6
- TanStack Query
- Axios

## Development

```bash
cp .npmrc.example .npmrc
$env:NODE_AUTH_TOKEN = "ghp_xxxx"

npm install
cp .env.example .env
npm run dev
```

Sem PAT: `npm install file:../projectzero-ui/muzkle-ui-0.1.0.tgz`

Runs at [http://localhost:5174](http://localhost:5174).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/v1` | API Gateway base URL |
| `NODE_AUTH_TOKEN` | — | PAT GitHub com `read:packages` |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/albums` | Album list |
| `/albums/:albumId/stickers` | Sticker CRUD + preview retrato |
| `/settings` | Configurações da conta parceiro |
| `/login`, `/register` | Auth |

## Sticker images

Recommended portrait size: **600×800** (3:4). See `@muzkle/ui` README.

## Production

```bash
npm run build
```

Docker / Railway:

```bash
docker build --build-arg NODE_AUTH_TOKEN=$NODE_AUTH_TOKEN -t projectzero-web-partner .
railway up projectzero-web-partner --path-as-root --service web-partner
```

Configure `NODE_AUTH_TOKEN` no serviço Railway (mesmo PAT usado nos backends).

Ver [ADR-002](../docs/ADR/002-desktop-first-portrait-stickers.md).
