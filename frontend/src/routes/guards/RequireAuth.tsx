import { Navigate, useLocation } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { AppSkeleton } from "@/components/ui/app-skeleton";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { MainLayout } from "@/components/layouts/MainLayout";

export default function RequireAuth() {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Only attempt to fetch current user if we have a token
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  // Show skeleton with loader only on an initial load (first fetch with no cached data)
  if (token && isLoading) {
    return (
      <>
        <AppSkeleton />
        <FullScreenLoader isLoading={true} message="Učitavanje..." />
      </>
    );
  }

  // If authenticated, render MainLayout with nested routes
  if (isAuthenticated) return <MainLayout />;

  // Not authenticated -> go to login and remember where we were
  return <Navigate to="/login" replace state={{ from: location }} />;
}
