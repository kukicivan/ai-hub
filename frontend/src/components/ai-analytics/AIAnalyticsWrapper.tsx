import React from "react";
import { Sidebar } from "../core/Sidebar";
import AIAnalytics from "./AIAnalytics";
import { useNavigate } from "react-router-dom";

export const AIAnalyticsWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    // Map view IDs to routes
    const viewRoutes: Record<string, string> = {
      dashboard: "/dashboard",
      "inbox-v1": "/inbox-v1",
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
      <Sidebar currentView="analytics" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <AIAnalytics />
      </div>
    </div>
  );
};

export default AIAnalyticsWrapper;
