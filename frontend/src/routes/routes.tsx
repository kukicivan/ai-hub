import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AIDashboardWrapper from "@/components/ai-dashboard/AIDashboardWrapper.tsx";
import InboxV1Wrapper from "@/components/inbox-v1/InboxV1Wrapper";
import InboxV2Wrapper from "@/components/inbox-v2/InboxV2Wrapper";
import AIServicesWrapper from "@/components/ai-services/AIServicesWrapper";
import AIIntegrationsWrapper from "@/components/ai-integrations/AIIntegrationsWrapper";
import AIAnalyticsWrapper from "@/components/ai-analytics/AIAnalyticsWrapper";
import AIHelpWrapper from "@/components/ai-help/AIHelpWrapper";
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
            path: "/inbox-v2",
            element: <InboxV2Wrapper />,
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
        ],
      },
      {
        element: <RedirectIfAuthenticated />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
        ],
      },
    ],
  },
]);

export default router;
