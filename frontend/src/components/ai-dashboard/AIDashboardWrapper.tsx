import React from "react";
import { Sidebar } from "../core/Sidebar";
import AIDashboard from "./AIDashboard";
import { useNavigate } from "react-router-dom";

export const AIDashboardWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    // Map view IDs to routes
    const viewRoutes: Record<string, string> = {
      dashboard: "/dashboard",
      "inbox-v1": "/inbox-v1",
      "inbox-v2": "/inbox-v2",
      "ai-overview": "/ai-services",
      integrations: "/ai-integrations",
      analytics: "/ai-analytics",
    };

    const route = viewRoutes[view];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)" }}>
      <Sidebar currentView="dashboard" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <AIDashboard />
      </div>
    </div>
  );
};

export default AIDashboardWrapper;
