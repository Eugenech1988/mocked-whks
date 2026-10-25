import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSessionStore } from '@/shared/store';
import { AppLayout } from '@/app';
import { Spinner } from '@/shared/ui';
import { ProtectedRoute } from './ProtectedRoute';

const LoginPage = lazy(() =>
  import('@/pages/login').then(module => ({ default: module.LoginPage })),
);
const WebhooksPage = lazy(() =>
  import('@/pages/webhooks').then(module => ({ default: module.WebhooksPage })),
);

export const AppRoutes = () => {
  const sessionExpired = useSessionStore(state => state.sessionExpired);
  if (sessionExpired) return <Navigate to="/login" replace />;

  return (
    <Suspense
      fallback={
        <div
          className="grid min-h-screen place-items-center text-muted-foreground"
          role="status"
          aria-label="Loading page"
        >
          <Spinner className="size-6" />
          <span className="sr-only">Loading page</span>
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<WebhooksPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
