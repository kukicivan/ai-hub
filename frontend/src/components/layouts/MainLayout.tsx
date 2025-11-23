import { useState, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../core/Sidebar";
import { CommandPalette } from "../ui/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

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
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

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

  // Global keyboard shortcuts (SRS Appendix 12.3)
  const shortcuts = [
    {
      key: "k",
      meta: true,
      description: "Open command palette",
      action: () => setCommandPaletteOpen(true),
    },
    {
      key: "Escape",
      description: "Close modal/palette",
      action: () => setCommandPaletteOpen(false),
    },
    {
      key: "g",
      description: "Go to dashboard",
      action: () => navigate("/dashboard"),
    },
    {
      key: "i",
      description: "Go to inbox",
      action: () => navigate("/inbox-v1"),
    },
    {
      key: "t",
      description: "Go to todos",
      action: () => navigate("/todos"),
    },
  ];

  useKeyboardShortcuts({ shortcuts });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}
