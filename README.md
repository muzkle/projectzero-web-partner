# projectzero-web-partner

Partner portal for ProjectZero — manage albums, stickers, missions, and sales.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router v6
- TanStack Query
- Axios

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

Runs at [http://localhost:5174](http://localhost:5174).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/v1` | API Gateway base URL |

## Auth

- Access token stored in memory
- Refresh token persisted in `localStorage`
- Axios interceptor attaches `Authorization: Bearer …` and refreshes on 401
- Partner API calls include `x-partner-id` (from `/partners/me`)

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/request-partner` | Submit partner application |
| `/` | Dashboard with sales stats (`GET /partner/sales`) |
| `/albums` | Album list |
| `/albums/new` | Create album |
| `/albums/:id/edit` | Edit album |
| `/albums/:albumId/stickers` | Sticker CRUD |
| `/albums/:albumId/stickers/:stickerId/mission` | Mission form |

## API routes (via gateway)

- `POST /auth/login`, `/auth/register`, `/auth/refresh`, `GET /auth/me`
- `POST /partners/request`, `GET /partners/me`
- `GET|POST /partner/albums`, `PATCH|DELETE /partner/albums/:id`, `POST /partner/albums/:id/publish`
- `GET|POST /partner/albums/:albumId/stickers`, `PATCH|DELETE …/:id`
- `GET|POST|PATCH|DELETE /partner/albums/:albumId/stickers/:stickerId/mission`
- `GET /partner/sales`

## Production

```bash
npm run build
npm run preview
```

### Docker / Railway

```bash
docker build -t projectzero-web-partner .
docker run -p 8080:80 projectzero-web-partner
```

Set `VITE_API_URL` at build time for production API URL.
