import React from "react";
import { Sidebar } from "../core/Sidebar";
import Todos from "@/pages/Todos";
import { useNavigate } from "react-router-dom";

export const TodosWrapper: React.FC = () => {
  const navigate = useNavigate();

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
    };

    const route = viewRoutes[view];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)" }}>
      <Sidebar currentView="todos" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Todos />
      </div>
    </div>
  );
};

export default TodosWrapper;
