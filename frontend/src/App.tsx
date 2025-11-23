import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectAuthLoading,
  selectIsAuthenticated,
  setLoading,
} from "@/redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { initializeCsrfProtection } from "@/redux/api/baseApi";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AppSkeleton } from "@/components/ui/app-skeleton";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Only fetch a user if we have a token - prevents cache pollution before login
  const token = localStorage.getItem("access_token");
  useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(setLoading(true));
      await initializeCsrfProtection();
      dispatch(setLoading(false));
    };
    initializeApp();
  }, [dispatch]);

  // Show skeleton with loader only on an initial app load (CSRF init)
  // Don't block on isFetching - that would cause infinite remount loop
  if (isLoading) {
    if (token || isAuthenticated) {
      return (
        <>
          <AppSkeleton />
          <FullScreenLoader isLoading={true} message="Učitavanje..." />
        </>
      );
    }
    return <FullScreenLoader isLoading={true} message="Učitavanje..." />;
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <Outlet />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
