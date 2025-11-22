import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../core/Sidebar";

const routeToViewId: Record<string, string> = {
  "/dashboard": "dashboard",
  "/inbox-v1": "inbox-v1",
  "/ai-services": "ai-overview",
  "/ai-integrations": "integrations",
  "/ai-analytics": "analytics",
  "/ai-help": "help",
  "/todos": "todos",
  "/profile": "profile",
  "/users": "users",
  "/users/v1": "users",
  "/users/v2": "users",
  "/users/v3": "users",
  "/users/v4": "users",
  "/users/v5": "users",
  "/users/v6": "users",
};

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = routeToViewId[location.pathname] || "dashboard";

  const handleViewChange = (view: string) => {
    const viewRoutes: Record<string, string> = {
      dashboard: "/dashboard",
      "inbox-v1": "/inbox-v1",
      "ai-overview": "/ai-services",
      integrations: "/ai-integrations",
      analytics: "/ai-analytics",
      help: "/ai-help",
      todos: "/todos",
      profile: "/profile",
      users: "/users",
    };

    const route = viewRoutes[view];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
