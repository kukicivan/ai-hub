import React from "react";
import { Sidebar } from "../core/Sidebar";
import AIServices from "./AIServices";
import { useNavigate } from "react-router-dom";

export const AIServicesWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    // Map view IDs to routes
    const viewRoutes: Record<string, string> = {
      dashboard: "/dashboard",
      "inbox-v1": "/inbox-v1",
      "ai-overview": "/ai-services",
    };

    const route = viewRoutes[view];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)" }}>
      <Sidebar currentView="ai-overview" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <AIServices />
      </div>
    </div>
  );
};

export default AIServicesWrapper;
