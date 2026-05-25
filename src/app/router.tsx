import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/ui/AppLayout';
import {
  GuestRoute,
  PartnerRequiredRoute,
  ProtectedRoute,
} from '@/features/auth/ProtectedRoute';
import { Spinner } from '@/shared/ui/Spinner';

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const RequestPartnerPage = lazy(() =>
  import('@/pages/RequestPartnerPage').then((m) => ({ default: m.RequestPartnerPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const AlbumsPage = lazy(() =>
  import('@/pages/AlbumsPage').then((m) => ({ default: m.AlbumsPage })),
);
const AlbumFormPage = lazy(() =>
  import('@/pages/AlbumFormPage').then((m) => ({ default: m.AlbumFormPage })),
);
const StickersPage = lazy(() =>
  import('@/pages/StickersPage').then((m) => ({ default: m.StickersPage })),
);
const MissionFormPage = lazy(() =>
  import('@/pages/MissionFormPage').then((m) => ({ default: m.MissionFormPage })),
);

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LazyPage><LoginPage /></LazyPage> },
      { path: '/register', element: <LazyPage><RegisterPage /></LazyPage> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/request-partner',
        element: (
          <LazyPage>
            <RequestPartnerPage />
          </LazyPage>
        ),
      },
      {
        element: <PartnerRequiredRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/',
                element: (
                  <LazyPage>
                    <DashboardPage />
                  </LazyPage>
                ),
              },
              {
                path: '/albums',
                element: (
                  <LazyPage>
                    <AlbumsPage />
                  </LazyPage>
                ),
              },
              {
                path: '/albums/new',
                element: (
                  <LazyPage>
                    <AlbumFormPage />
                  </LazyPage>
                ),
              },
              {
                path: '/albums/:id/edit',
                element: (
                  <LazyPage>
                    <AlbumFormPage />
                  </LazyPage>
                ),
              },
              {
                path: '/settings',
                element: (
                  <LazyPage>
                    <SettingsPage />
                  </LazyPage>
                ),
              },
              {
                path: '/albums/:albumId/stickers',
                element: (
                  <LazyPage>
                    <StickersPage />
                  </LazyPage>
                ),
              },
              {
                path: '/albums/:albumId/stickers/:stickerId/mission',
                element: (
                  <LazyPage>
                    <MissionFormPage />
                  </LazyPage>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
