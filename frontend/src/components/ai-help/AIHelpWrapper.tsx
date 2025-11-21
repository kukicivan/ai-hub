import React from "react";
import { Sidebar } from "@/components/core/Sidebar";
import AIHelp from "@/components/ai-help/AIHelp";
import { useNavigate } from "react-router-dom";

export const AIHelpWrapper: React.FC = () => {
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
      help: "/ai-help",
    };

    const route = viewRoutes[view];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)" }}>
      <Sidebar currentView="help" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <AIHelp />
      </div>
    </div>
  );
};

export default AIHelpWrapper;
