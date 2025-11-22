// Sidebar component from UI repo
import { ComponentType, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebarState } from "@/hooks/useSidebarState";
import {
  LayoutDashboard,
  Mail,
  Brain,
  Link,
  BarChart3,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  User,
  LogOut,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

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
  const { isCollapsed, toggle } = useSidebarState();
  const navigate = useNavigate();
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const user = useAppSelector(selectCurrentUser);

  // Calculate user initials from name
  const userInitials = useMemo(() => {
    if (!user?.name) return "??";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  // Format role for display
  const userRole = useMemo(() => {
    if (!user?.role) return "Korisnik";
    const roleMap: Record<string, string> = {
      admin: "Administrator",
      user: "Korisnik",
      manager: "Menadžer",
    };
    return roleMap[user.role.toLowerCase()] || user.role;
  }, [user?.role]);

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
          label: "Inbox",
          icon: Mail,
          badge: null,
          route: "/inbox-v1",
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
      section: "Produktivnost",
      items: [
        {
          id: "todos",
          label: "Zadaci",
          icon: CheckSquare,
          badge: null,
          route: "/todos",
        },
      ],
    },
    {
      section: "Administracija",
      items: [
        {
          id: "users",
          label: "Upravljanje korisnicima",
          icon: ShieldCheck,
          badge: null,
          route: "/users",
        },
      ],
    },
    {
      section: "Podešavanja",
      items: [
        { id: "settings", label: "Postavke", icon: Settings, badge: null, route: "/settings" },
        { id: "profile", label: "Profil", icon: User, badge: null, route: "/profile" },
        { id: "help", label: "Pomoć", icon: HelpCircle, badge: null, route: "/ai-help" },
      ],
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
    <TooltipProvider>
      <div
        className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex flex-col h-screen overflow-hidden flex-shrink-0`}
      >
        {/* Header */}
        <div className={`border-b border-sidebar-border ${isCollapsed ? "p-2" : "p-4"}`}>
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
          >
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">AI Automatizacija</h2>
                <p className="text-xs text-muted-foreground">Centar za produktivnost</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
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
                  const button = (
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full h-10 ${isCollapsed ? "justify-center px-0" : "justify-start px-3"} ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
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

                  return isCollapsed ? (
                    <Tooltip key={item.id} delayDuration={0}>
                      <TooltipTrigger asChild>{button}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={item.id}>{button}</div>
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
        <div className={`border-t border-sidebar-border ${isCollapsed ? "p-2" : "p-4"}`}>
          {!isCollapsed && (
            <div className="bg-accent p-3 rounded-lg mb-3">
              <h4 className="text-sm font-medium text-accent-foreground">Pilot Program</h4>
              <p className="text-xs text-muted-foreground mt-1">Ostalo još 67 dana</p>
              <Button size="sm" className="w-full mt-2 bg-primary hover:bg-primary/90">
                Upgrade na Enterprise
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isCollapsed ? (
                <Button
                  variant="ghost"
                  className="w-full h-10 justify-center px-0 hover:bg-sidebar-accent"
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || "Avatar"}
                      className="rounded-full h-8 w-8 object-cover border-2"
                    />
                  ) : (
                    <Badge
                      variant="outline"
                      className="rounded-full h-8 w-8 p-0 border-2 flex items-center justify-center font-semibold text-xs"
                    >
                      {userInitials}
                    </Badge>
                  )}
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name || "Avatar"}
                        className="rounded-full h-8 w-8 object-cover border-2"
                      />
                    ) : (
                      <Badge
                        variant="outline"
                        className="rounded-full h-8 w-8 p-0 border-2 flex items-center justify-center font-semibold"
                      >
                        {userInitials}
                      </Badge>
                    )}
                    <div className="text-left">
                      <div className="font-medium truncate max-w-[120px]">
                        {user?.name || "Korisnik"}
                      </div>
                      <div className="text-xs text-gray-500">{userRole}</div>
                    </div>
                  </div>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isCollapsed ? "start" : "end"}
              side={isCollapsed ? "right" : "top"}
              className="w-[200px]"
            >
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Postavke
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/todos")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Zadaci
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Odjava u toku..." : "Odjavi se"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}
