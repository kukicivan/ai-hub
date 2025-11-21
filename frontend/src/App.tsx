import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAuthLoading, setLoading } from "@/redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { initializeCsrfProtection } from "@/redux/api/baseApi";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const { isLoading: isUserLoading } = useGetCurrentUserQuery(undefined);

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(setLoading(true));
      await initializeCsrfProtection();
      dispatch(setLoading(false));
    };
    initializeApp();
  }, [dispatch]);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
