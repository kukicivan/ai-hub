import React from "react";
import { Sidebar } from "../core/Sidebar";
import AIIntegrations from "./AIIntegrations";
import { useNavigate } from "react-router-dom";

export const AIIntegrationsWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    // Map view IDs to routes
    const viewRoutes: Record<string, string> = {
      dashboard: "/dashboard",
      "inbox-v1": "/inbox-v1",
      "inbox-v2": "/inbox-v2",
      "ai-overview": "/ai-services",
      integrations: "/ai-integrations",
    };

    const route = viewRoutes[view];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)" }}>
      <Sidebar currentView="integrations" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <AIIntegrations />
      </div>
    </div>
  );
};

export default AIIntegrationsWrapper;
