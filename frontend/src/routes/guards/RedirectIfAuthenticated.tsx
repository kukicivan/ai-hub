import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { AppSkeleton } from "@/components/ui/app-skeleton";

export default function RedirectIfAuthenticated() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Only attempt to fetch current user if we have a token
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { isLoading, isFetching, isSuccess } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  // Show skeleton + loader while:
  // 1. Initial load with token (reload scenario)
  // 2. After login, while getCurrentUser is still fetching
  if (token && (isLoading || isFetching || (isAuthenticated && !isSuccess))) {
    return (
      <>
        <AppSkeleton />
        <FullScreenLoader isLoading={true} message="Učitavanje..." />
      </>
    );
  }

  // Only navigate after getCurrentUser has completed successfully
  if (isAuthenticated && isSuccess) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show public routes (e.g., Login)
  return <Outlet />;
}
