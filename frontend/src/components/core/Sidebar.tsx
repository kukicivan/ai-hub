// Sidebar component from UI repo
import { useState, ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Mail,
  Brain,
  Link,
  BarChart3,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge: string | null;
  route?: string;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const menuItems: { section: string; items: MenuItem[] }[] = [
    {
      section: "Glavni meni",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          badge: null,
          route: "/dashboard",
        },
        {
          id: "inbox-v1",
          label: "Inbox v1",
          icon: Mail,
          badge: "NEW",
          route: "/inbox-v1",
        },
        {
          id: "inbox-v2",
          label: "Inbox v2",
          icon: Mail,
          badge: null,
          route: "/inbox-v2",
        },
      ],
    },
    {
      section: "AI Servisi",
      items: [
        {
          id: "ai-overview",
          label: "AI Pregled",
          icon: Brain,
          badge: "9/9",
          route: "/ai-services",
        },
      ],
    },
    {
      section: "Integracije",
      items: [
        {
          id: "integrations",
          label: "Svi kanali",
          icon: Link,
          badge: "20/25",
          route: "/ai-integrations",
        },
      ],
    },
    {
      section: "Analitika",
      items: [
        {
          id: "analytics",
          label: "Izvještaji",
          icon: BarChart3,
          badge: null,
          route: "/ai-analytics",
        },
      ],
    },
    {
      section: "Podešavanja",
      items: [{ id: "help", label: "Pomoć", icon: HelpCircle, badge: null, route: "/ai-help" }],
    },
  ];

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">AI Automatizacija</h2>
              <p className="text-xs text-muted-foreground">Centar za produktivnost</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      {/* Status indicator */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-accent border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
            <span className="text-sm text-accent-foreground">Svi servisi aktivni</span>
          </div>
        </div>
      )}
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {section.section}
              </h3>
            )}
            <div className="space-y-1 px-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-10 ${isCollapsed ? "px-2" : "px-3"} ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                    onClick={() => {
                      if (item.route) {
                        navigate(item.route);
                      } else {
                        onViewChange(item.id);
                      }
                    }}
                  >
                    <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"} flex-shrink-0`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant={isActive ? "secondary" : "outline"}
                            className={`ml-auto text-xs ${isActive ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground" : ""}`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
            {sectionIndex < menuItems.length - 1 && !isCollapsed && (
              <Separator className="mx-4 mt-4" />
            )}
          </div>
        ))}
      </div>
      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="bg-accent p-3 rounded-lg">
            <h4 className="text-sm font-medium text-accent-foreground">Pilot Program</h4>
            <p className="text-xs text-muted-foreground mt-1">Ostalo još 67 dana</p>
            <Button size="sm" className="w-full mt-2 bg-primary hover:bg-primary/90">
              Upgrade na Enterprise
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full h-8 w-8 p-0 border-2 flex items-center justify-center font-semibold"
                  >
                    KP
                  </Badge>
                  <div className="text-left">
                    <div className="font-medium">Kule Petrovic</div>
                    <div className="text-xs text-gray-500">Administrator</div>
                  </div>
                </div>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {" "}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
