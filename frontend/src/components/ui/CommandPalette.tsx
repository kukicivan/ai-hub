import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Mail,
  Calendar,
  Settings,
  User,
  FileText,
  Target,
  Keyboard,
  Home,
  Inbox,
  BarChart,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "home",
        label: "Go to Dashboard",
        description: "View your AI dashboard",
        icon: <Home className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/");
          onOpenChange(false);
        },
      },
      {
        id: "inbox",
        label: "Go to Inbox",
        description: "View your email inbox",
        icon: <Inbox className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/inbox");
          onOpenChange(false);
        },
      },
      {
        id: "todos",
        label: "Go to Todos",
        description: "Manage your tasks",
        icon: <Target className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/todos");
          onOpenChange(false);
        },
      },
      {
        id: "analytics",
        label: "Go to Analytics",
        description: "View email analytics",
        icon: <BarChart className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/analytics");
          onOpenChange(false);
        },
      },
      {
        id: "settings",
        label: "Go to Settings",
        description: "Configure your preferences",
        icon: <Settings className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/settings");
          onOpenChange(false);
        },
      },
      {
        id: "profile",
        label: "Go to Profile",
        description: "Manage your account",
        icon: <User className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/profile");
          onOpenChange(false);
        },
      },
      {
        id: "calendar",
        label: "Go to Calendar",
        description: "View your schedule",
        icon: <Calendar className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/calendar");
          onOpenChange(false);
        },
      },
      {
        id: "contacts",
        label: "Go to Contacts",
        description: "Manage your contacts",
        icon: <User className="h-4 w-4" />,
        category: "Navigation",
        action: () => {
          navigate("/contacts");
          onOpenChange(false);
        },
      },
      // Actions
      {
        id: "compose",
        label: "Compose Email",
        description: "Write a new email",
        icon: <Mail className="h-4 w-4" />,
        category: "Actions",
        shortcut: "C",
        action: () => {
          // TODO: Open compose modal
          onOpenChange(false);
        },
      },
      {
        id: "schedule",
        label: "Schedule Meeting",
        description: "Add to calendar",
        icon: <Calendar className="h-4 w-4" />,
        category: "Actions",
        action: () => {
          // TODO: Open schedule modal
          onOpenChange(false);
        },
      },
      // Help
      {
        id: "shortcuts",
        label: "Keyboard Shortcuts",
        description: "View all shortcuts",
        icon: <Keyboard className="h-4 w-4" />,
        category: "Help",
        shortcut: "?",
        action: () => {
          // TODO: Open shortcuts modal
          onOpenChange(false);
        },
      },
      {
        id: "help",
        label: "Help & Documentation",
        description: "Get help using the app",
        icon: <HelpCircle className="h-4 w-4" />,
        category: "Help",
        action: () => {
          navigate("/help");
          onOpenChange(false);
        },
      },
    ],
    [navigate, onOpenChange]
  );

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const searchLower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.category.toLowerCase().includes(searchLower)
    );
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Reset search when opening
  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) =>
            i < filteredCommands.length - 1 ? i + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) =>
            i > 0 ? i - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
      }
    },
    [filteredCommands, selectedIndex]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="border-0 focus-visible:ring-0 px-0"
            autoFocus
          />
          <Badge variant="outline" className="ml-2">
            esc
          </Badge>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category}>
              <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {category}
              </div>
              {items.map((item) => {
                const index = filteredCommands.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="text-muted-foreground">{item.icon}</span>
                    <span className="flex-1 text-left">
                      <span className="font-medium">{item.label}</span>
                      {item.description && (
                        <span className="ml-2 text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </span>
                    {item.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {item.shortcut}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="py-6 text-center text-muted-foreground">
              No results found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Close</span>
          </div>
          <span>Cmd+K to open</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;
