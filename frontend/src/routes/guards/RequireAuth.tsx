import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";

export default function RequireAuth() {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Only attempt to fetch current user if we have a token
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: !token,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  // Defer to App's global loading UI while session is being checked
  if (isLoading || isFetching) return null;

  // If authenticated, render nested routes
  if (isAuthenticated) return <Outlet />;

  // Not authenticated -> go to login and remember where we were
  return <Navigate to="/login" replace state={{ from: location }} />;
}
