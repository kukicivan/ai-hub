import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Mail,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  Calendar,
  Clock,
  Settings,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";

type NotificationType = "email" | "ai" | "system" | "reminder" | "alert";
type NotificationPriority = "low" | "normal" | "high";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
}

// Mock notifications - would come from API
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "email",
    title: "Novi email od klijenta",
    message: "Primili ste važan email od client@company.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    priority: "high",
    actionUrl: "/inbox-v1",
    actionLabel: "Pogledaj",
  },
  {
    id: "2",
    type: "ai",
    title: "AI analiza završena",
    message: "Analizirano 12 novih emailova. 3 zahtijevaju vašu pažnju.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    priority: "normal",
    actionUrl: "/inbox-v1",
  },
  {
    id: "3",
    type: "reminder",
    title: "Podsjetnik: Follow-up",
    message: "Vrijeme je za follow-up email prema partner@startup.io",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    priority: "normal",
    actionUrl: "/inbox-v1?compose=true",
  },
  {
    id: "4",
    type: "alert",
    title: "Hitna poruka",
    message: "Email od VIP kontakta zahtijeva odgovor u roku od 1 sata",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: true,
    priority: "high",
  },
  {
    id: "5",
    type: "system",
    title: "Sinkronizacija završena",
    message: "Gmail je uspješno sinkroniziran. 25 novih poruka.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    priority: "low",
  },
  {
    id: "6",
    type: "ai",
    title: "Preporuka akcije",
    message: "AI preporučuje da odgovorite na 2 emaila prije kraja radnog dana",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    read: true,
    priority: "normal",
  },
];

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "email":
      return <Mail className="h-4 w-4 text-blue-500" />;
    case "ai":
      return <Sparkles className="h-4 w-4 text-purple-500" />;
    case "system":
      return <Info className="h-4 w-4 text-gray-500" />;
    case "reminder":
      return <Calendar className="h-4 w-4 text-green-500" />;
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
}

interface NotificationCenterProps {
  onClose?: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    aiNotifications: true,
    systemNotifications: true,
    reminderNotifications: true,
    alertNotifications: true,
    soundEnabled: false,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const renderNotification = (notification: Notification) => (
    <div
      key={notification.id}
      className={`p-3 rounded-lg border transition-colors ${
        !notification.read
          ? "bg-primary/5 border-primary/20"
          : "bg-muted/30 border-transparent"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {notification.title}
            </span>
            {notification.priority === "high" && (
              <Badge variant="destructive" className="text-xs">
                Hitno
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, {
                addSuffix: true,
                locale: hr,
              })}
            </span>
            {notification.actionUrl && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => {
                  window.location.href = notification.actionUrl!;
                }}
              >
                {notification.actionLabel || "Pogledaj"}
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => handleDelete(notification.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (showSettings) {
    return (
      <Card className="w-[400px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Postavke obavijesti</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(false)}
            >
              Natrag
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Email obavijesti</span>
              <p className="text-xs text-muted-foreground">
                Obavijesti o novim emailovima
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">AI obavijesti</span>
              <p className="text-xs text-muted-foreground">
                Obavijesti o AI analizama
              </p>
            </div>
            <Switch
              checked={settings.aiNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, aiNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Sistemske obavijesti</span>
              <p className="text-xs text-muted-foreground">
                Obavijesti o sinkronizaciji i ažuriranjima
              </p>
            </div>
            <Switch
              checked={settings.systemNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, systemNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Podsjetnici</span>
              <p className="text-xs text-muted-foreground">
                Obavijesti o zakazanim podsjetnicima
              </p>
            </div>
            <Switch
              checked={settings.reminderNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, reminderNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Upozorenja</span>
              <p className="text-xs text-muted-foreground">
                Hitna upozorenja i alarmi
              </p>
            </div>
            <Switch
              checked={settings.alertNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, alertNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Zvuk</span>
              <p className="text-xs text-muted-foreground">
                Reproduciraj zvuk za nove obavijesti
              </p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, soundEnabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Obavijesti
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="all" className="text-xs">
              Sve
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Nepročitano ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-xs text-muted-foreground">
                {notifications.length} obavijesti
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Označi sve
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  Obriši sve
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[350px]">
              <div className="p-2 space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nema obavijesti</p>
                  </div>
                ) : (
                  notifications.map(renderNotification)
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-[400px]">
              <div className="p-2 space-y-2">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Sve je pročitano!</p>
                  </div>
                ) : (
                  unreadNotifications.map(renderNotification)
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default NotificationCenter;
