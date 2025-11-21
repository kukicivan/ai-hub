import React from "react";
import { Sidebar } from "@/components/core/Sidebar";
import InboxV1 from "./inbox-v1";
import { useNavigate } from "react-router-dom";

export const InboxV1Wrapper: React.FC = () => {
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
      <Sidebar currentView="inbox-v1" onViewChange={handleViewChange} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <InboxV1 />
      </div>
    </div>
  );
};

export default InboxV1Wrapper;
