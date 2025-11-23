import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PenSquare,
  Inbox,
  Calendar,
  CheckSquare,
  Settings,
  Sparkles,
  Search,
  HelpCircle,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  shortcut?: string;
}

interface QuickActionsCardProps {
  onCompose?: () => void;
  onSearch?: () => void;
}

export function QuickActionsCard({ onCompose, onSearch }: QuickActionsCardProps) {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: "compose",
      label: "Novi email",
      icon: <PenSquare className="h-4 w-4" />,
      onClick: onCompose,
      shortcut: "C",
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: <Inbox className="h-4 w-4" />,
      href: "/inbox-v1",
      shortcut: "I",
    },
    {
      id: "search",
      label: "Pretraga",
      icon: <Search className="h-4 w-4" />,
      onClick: onSearch,
      shortcut: "⌘K",
    },
    {
      id: "todos",
      label: "Zadaci",
      icon: <CheckSquare className="h-4 w-4" />,
      href: "/todos",
      shortcut: "T",
    },
    {
      id: "calendar",
      label: "Kalendar",
      icon: <Calendar className="h-4 w-4" />,
      href: "/calendar",
    },
    {
      id: "ai",
      label: "AI Asistent",
      icon: <Sparkles className="h-4 w-4" />,
      href: "/ai-services",
    },
    {
      id: "settings",
      label: "Podešavanja",
      icon: <Settings className="h-4 w-4" />,
      href: "/settings",
      shortcut: "S",
    },
    {
      id: "help",
      label: "Pomoć",
      icon: <HelpCircle className="h-4 w-4" />,
      href: "/ai-help",
    },
  ];

  const handleClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      navigate(action.href);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Brze akcije</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            className="justify-start h-auto py-2 px-3"
            onClick={() => handleClick(action)}
          >
            <div className="flex items-center gap-2 w-full">
              {action.icon}
              <span className="text-xs truncate">{action.label}</span>
              {action.shortcut && (
                <kbd className="ml-auto text-[10px] bg-muted px-1 rounded">
                  {action.shortcut}
                </kbd>
              )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export default QuickActionsCard;
