import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  Settings,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";

interface Notification {
  id: string;
  type: "email" | "urgent" | "ai" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications - in production these would come from an API
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "urgent",
    title: "Hitan email",
    message: "Novi email od klijenta zahtijeva hitnu akciju",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: "2",
    type: "ai",
    title: "AI analiza završena",
    message: "10 novih emailova je analizirano",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "3",
    type: "email",
    title: "Novi emailovi",
    message: "Primili ste 5 novih emailova",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "Dnevni digest spreman",
    message: "Vaš dnevni AI sažetak je spreman za pregled",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
];

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "urgent":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "ai":
      return <Sparkles className="h-4 w-4 text-blue-500" />;
    case "email":
      return <Mail className="h-4 w-4 text-green-500" />;
    case "system":
      return <CheckCircle className="h-4 w-4 text-gray-500" />;
  }
}

interface NotificationBellProps {
  onSettingsClick?: () => void;
}

export function NotificationBell({ onSettingsClick }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Obavještenja</h4>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={markAllAsRead}
              >
                Označi sve
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nema novih obavještenja
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                        locale: hr,
                      })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={clearAll}
            >
              Očisti sve
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
