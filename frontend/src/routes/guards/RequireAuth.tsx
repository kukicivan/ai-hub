import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { AppSkeleton } from "@/components/ui/app-skeleton";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

export default function RequireAuth() {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Only attempt to fetch current user if we have a token
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { isLoading, isSuccess, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: !token,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  // Show skeleton with loader when:
  // 1. We have a token, but a query hasn't succeeded yet (initial load or after login)
  // 2. Query is still loading
  if (token && (isLoading || (!isSuccess && isFetching))) {
    return (
      <>
        <AppSkeleton />
        <FullScreenLoader isLoading={true} message="Učitavanje..." />
      </>
    );
  }

  // If authenticated, render nested routes
  if (isAuthenticated) return <Outlet />;

  // Not authenticated -> go to login and remember where we were
  return <Navigate to="/login" replace state={{ from: location }} />;
}
