import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth'

export function ProtectedRoute() {
  const { isLoading, isError, data } = useCurrentUser()
  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading session…
      </div>
    )
  if (isError || !data) return <Navigate to="/login" replace />
  return <Outlet />
}
