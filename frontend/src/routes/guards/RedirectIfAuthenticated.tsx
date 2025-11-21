import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";

export default function RedirectIfAuthenticated() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Only attempt to fetch current user if we have a token
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  // Defer to App's global loading UI while session is being checked
  if (isLoading || isFetching) return null;

  // If already authenticated, go to dashboard (handles reload and direct /login visits)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  // Otherwise show public routes (e.g., Login)
  return <Outlet />;
}
