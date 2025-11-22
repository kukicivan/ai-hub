import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

export default function RedirectIfAuthenticated() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Only attempt to fetch current user if we have a token
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  // Show loader only on an initial load when we have a token
  if (isLoading && token) {
    return <FullScreenLoader isLoading={true} message="Učitavanje..." />;
  }

  // If already authenticated, go to the dashboard (handles reload and direct /login visits)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  // Otherwise show public routes (e.g., Login)
  return <Outlet />;
}
