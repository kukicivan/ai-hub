import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AIDashboard from "@/components/ai-dashboard/AIDashboard";
import InboxV1 from "@/components/inbox-v1/inbox-v1";
import AIServices from "@/components/ai-services/AIServices";
import AIIntegrations from "@/components/ai-integrations/AIIntegrations";
import AIAnalytics from "@/components/ai-analytics/AIAnalytics";
import AIHelp from "@/components/ai-help/AIHelp";
import Profile from "@/pages/Profile";
import Todos from "@/pages/Todos";
import App from "@/App";
import RequireAuth from "@/routes/guards/RequireAuth";
import RedirectIfAuthenticated from "@/routes/guards/RedirectIfAuthenticated";
import {
  UserManagementV1,
  UserManagementV2,
  UserManagementV3,
  UserManagementV4,
  UserManagementV5,
  UserManagementV6,
} from "@/components/user-management";
import { UsersRedirect } from "@/components/user-management/UsersRedirect";

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
            element: <AIDashboard />,
          },
          {
            path: "/inbox-v1",
            element: <InboxV1 />,
          },
          {
            path: "/ai-services",
            element: <AIServices />,
          },
          {
            path: "/ai-integrations",
            element: <AIIntegrations />,
          },
          {
            path: "/ai-analytics",
            element: <AIAnalytics />,
          },
          {
            path: "/ai-help",
            element: <AIHelp />,
          },
          {
            path: "/todos",
            element: <Todos />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/users",
            element: <UsersRedirect />,
          },
          {
            path: "/users/v1",
            element: <UserManagementV1 />,
          },
          {
            path: "/users/v2",
            element: <UserManagementV2 />,
          },
          {
            path: "/users/v3",
            element: <UserManagementV3 />,
          },
          {
            path: "/users/v4",
            element: <UserManagementV4 />,
          },
          {
            path: "/users/v5",
            element: <UserManagementV5 />,
          },
          {
            path: "/users/v6",
            element: <UserManagementV6 />,
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
