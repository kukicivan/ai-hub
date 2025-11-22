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

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isLoading: isUserLoading } = useGetCurrentUserQuery(undefined);

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(setLoading(true));
      await initializeCsrfProtection();
      dispatch(setLoading(false));
    };
    initializeApp();
  }, [dispatch]);

  // Show skeleton with loader overlay for authenticated users
  if (isLoading || isUserLoading) {
    const token = localStorage.getItem("access_token");
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
      </div>
    </ErrorBoundary>
  );
}

export default App;
