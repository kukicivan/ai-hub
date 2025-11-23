import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Inbox,
  Calendar,
  Users,
  BarChart,
  Settings,
  Menu,
  Search,
  Bell,
  Plus,
  User,
  HelpCircle,
  Target,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  badge?: number | null;
}

const mainNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, route: "/dashboard" },
  { id: "inbox", label: "Inbox", icon: Inbox, route: "/inbox-v1", badge: 12 },
  { id: "calendar", label: "Kalendar", icon: Calendar, route: "/calendar" },
  { id: "todos", label: "Zadaci", icon: Target, route: "/todos", badge: 5 },
];

const bottomNavItems: NavItem[] = [
  { id: "dashboard", label: "Početna", icon: Home, route: "/dashboard" },
  { id: "inbox", label: "Inbox", icon: Inbox, route: "/inbox-v1" },
  { id: "add", label: "Novo", icon: Plus, route: "#compose" },
  { id: "calendar", label: "Kalendar", icon: Calendar, route: "/calendar" },
  { id: "more", label: "Više", icon: Menu, route: "#menu" },
];

const menuItems: NavItem[] = [
  { id: "contacts", label: "Kontakti", icon: Users, route: "/contacts" },
  { id: "analytics", label: "Analytics", icon: BarChart, route: "/analytics" },
  { id: "ai-services", label: "AI Servisi", icon: Sparkles, route: "/ai-services" },
  { id: "settings", label: "Postavke", icon: Settings, route: "/settings" },
  { id: "profile", label: "Profil", icon: User, route: "/profile" },
  { id: "help", label: "Pomoć", icon: HelpCircle, route: "/help" },
];

interface MobileNavProps {
  unreadCount?: number;
  notificationCount?: number;
  onCompose?: () => void;
  onSearch?: () => void;
}

export function MobileNav({
  unreadCount = 0,
  notificationCount = 0,
  onCompose,
  onSearch,
}: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (item: NavItem) => {
    if (item.route === "#compose") {
      onCompose?.();
    } else if (item.route === "#menu") {
      setIsMenuOpen(true);
    } else {
      navigate(item.route);
    }
  };

  const isActive = (route: string) => {
    if (route === "#compose" || route === "#menu") return false;
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  return (
    <>
      {/* Top Header (Mobile) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold">AI Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onSearch}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Button>
        </div>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
        <div className="flex items-center justify-around h-full px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route);

            if (item.id === "add") {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="flex flex-col items-center justify-center -mt-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.id === "inbox" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.route);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.route);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            <div className="border-t my-4" />

            <button
              onClick={() => {
                // Handle logout
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Odjava</span>
            </button>
          </div>

          {/* User Info */}
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Ivan Horvat</p>
                <p className="text-xs text-muted-foreground">ivan@company.hr</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Spacers for fixed positioning */}
      <div className="md:hidden h-14" /> {/* Top spacer */}
    </>
  );
}

// Mobile-optimized Quick Actions FAB
export function MobileQuickActions({ onCompose }: { onCompose?: () => void }) {
  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40">
      <Button
        size="lg"
        className="w-14 h-14 rounded-full shadow-lg"
        onClick={onCompose}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}

// Mobile Search Bar
export function MobileSearchBar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="h-auto">
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pretraži emailove, kontakte..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Nepročitano
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              S privicima
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Označeno
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Ovaj tjedan
            </Badge>
          </div>

          {/* Recent Searches */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Nedavne pretrage</p>
            <div className="space-y-1">
              {["projekt deadline", "faktura", "partner@company.com"].map(
                (search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg text-sm"
                  >
                    {search}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
