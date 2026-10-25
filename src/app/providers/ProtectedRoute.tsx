import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth';
import { Spinner } from '@/shared/ui';

export const ProtectedRoute = () => {
  const { isLoading, isError, data } = useCurrentUser();
  if (isLoading)
    return (
      <div
        className="grid min-h-screen place-items-center text-muted-foreground"
        role="status"
        aria-label="Loading session"
      >
        <Spinner className="size-6" />
        <span className="sr-only">Loading session</span>
      </div>
    );
  if (isError || !data) return <Navigate to="/login" replace />;
  return <Outlet />;
};
