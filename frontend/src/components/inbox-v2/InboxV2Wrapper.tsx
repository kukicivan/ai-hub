import React from "react";
import { Sidebar } from "@/components/core/Sidebar";
import InboxV2 from "./inbox-v2";
import { useNavigate } from "react-router-dom";

export const InboxV2Wrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    // Map view IDs to routes
    const viewRoutes: Record<string, string> = {
      dashboard: "/dashboard",
      "inbox-v1": "/inbox-v1",
      "inbox-v2": "/inbox-v2",
    };

    const route = viewRoutes[view];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)" }}>
      <Sidebar currentView="inbox-v2" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <InboxV2 />
      </div>
    </div>
  );
};

export default InboxV2Wrapper;
