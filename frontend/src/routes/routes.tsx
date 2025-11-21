import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AIDashboardWrapper from "@/components/ai-dashboard/AIDashboardWrapper.tsx";
import InboxV1Wrapper from "@/components/inbox-v1/InboxV1Wrapper";
import AIServicesWrapper from "@/components/ai-services/AIServicesWrapper";
import AIIntegrationsWrapper from "@/components/ai-integrations/AIIntegrationsWrapper";
import AIAnalyticsWrapper from "@/components/ai-analytics/AIAnalyticsWrapper";
import AIHelpWrapper from "@/components/ai-help/AIHelpWrapper";
import ProfileWrapper from "@/components/profile/ProfileWrapper";
import TodosWrapper from "@/components/todos/TodosWrapper";
import App from "@/App";
import RequireAuth from "@/routes/guards/RequireAuth";
import RedirectIfAuthenticated from "@/routes/guards/RedirectIfAuthenticated";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: <AIDashboardWrapper />,
          },
          {
            path: "/inbox-v1",
            element: <InboxV1Wrapper />,
          },
          {
            path: "/ai-services",
            element: <AIServicesWrapper />,
          },
          {
            path: "/ai-integrations",
            element: <AIIntegrationsWrapper />,
          },
          {
            path: "/ai-analytics",
            element: <AIAnalyticsWrapper />,
          },
          {
            path: "/ai-help",
            element: <AIHelpWrapper />,
          },
          {
            path: "/todos",
            element: <TodosWrapper />,
          },
          {
            path: "/profile",
            element: <ProfileWrapper />,
          },
        ],
      },
      {
        element: <RedirectIfAuthenticated />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "/reset-password",
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },
]);

export default router;
