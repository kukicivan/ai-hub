import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  Mail,
  Send,
  Archive,
  Trash2,
  Star,
  Tag,
  Clock,
  Calendar,
  CheckSquare,
  MessageSquare,
  UserPlus,
  Settings,
  Download,
  Upload,
  Link,
  FileText,
  RefreshCw,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActivityType =
  | "email_received"
  | "email_sent"
  | "email_archived"
  | "email_deleted"
  | "email_starred"
  | "email_labeled"
  | "task_created"
  | "task_completed"
  | "meeting_scheduled"
  | "contact_added"
  | "settings_changed"
  | "file_uploaded"
  | "integration_connected";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: {
    sender?: string;
    recipient?: string;
    label?: string;
    taskName?: string;
    meetingTitle?: string;
    contactName?: string;
    fileName?: string;
    integrationName?: string;
  };
  read: boolean;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "email_received",
    title: "Novi email primljen",
    description: "Prijedlog suradnje",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    metadata: { sender: "marko@example.com" },
    read: false,
  },
  {
    id: "2",
    type: "email_sent",
    title: "Email poslan",
    description: "Re: Sastanak u ponedjeljak",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    metadata: { recipient: "ana@company.hr" },
    read: true,
  },
  {
    id: "3",
    type: "task_completed",
    title: "Zadatak završen",
    description: "Pripremiti izvještaj",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    metadata: { taskName: "Pripremiti izvještaj" },
    read: true,
  },
  {
    id: "4",
    type: "meeting_scheduled",
    title: "Sastanak zakazan",
    description: "Review projekta",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    metadata: { meetingTitle: "Review projekta" },
    read: true,
  },
  {
    id: "5",
    type: "email_archived",
    title: "Email arhiviran",
    description: "Newsletter - Promotivne ponude",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "6",
    type: "email_labeled",
    title: "Oznaka dodana",
    description: "Upit za ponudu",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    metadata: { label: "Klijent" },
    read: true,
  },
  {
    id: "7",
    type: "contact_added",
    title: "Kontakt dodan",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    metadata: { contactName: "Ivan Babić" },
    read: true,
  },
  {
    id: "8",
    type: "file_uploaded",
    title: "Datoteka učitana",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    metadata: { fileName: "prezentacija.pptx" },
    read: true,
  },
  {
    id: "9",
    type: "integration_connected",
    title: "Integracija povezana",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    metadata: { integrationName: "Google Calendar" },
    read: true,
  },
  {
    id: "10",
    type: "task_created",
    title: "Zadatak kreiran",
    description: "Pripremiti prezentaciju",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    metadata: { taskName: "Pripremiti prezentaciju" },
    read: true,
  },
];

const getActivityIcon = (type: ActivityType) => {
  const icons: Record<ActivityType, { icon: React.ReactNode; color: string }> = {
    email_received: { icon: <Mail className="h-4 w-4" />, color: "bg-blue-500" },
    email_sent: { icon: <Send className="h-4 w-4" />, color: "bg-green-500" },
    email_archived: { icon: <Archive className="h-4 w-4" />, color: "bg-gray-500" },
    email_deleted: { icon: <Trash2 className="h-4 w-4" />, color: "bg-red-500" },
    email_starred: { icon: <Star className="h-4 w-4" />, color: "bg-yellow-500" },
    email_labeled: { icon: <Tag className="h-4 w-4" />, color: "bg-purple-500" },
    task_created: { icon: <CheckSquare className="h-4 w-4" />, color: "bg-indigo-500" },
    task_completed: { icon: <CheckSquare className="h-4 w-4" />, color: "bg-green-500" },
    meeting_scheduled: { icon: <Calendar className="h-4 w-4" />, color: "bg-orange-500" },
    contact_added: { icon: <UserPlus className="h-4 w-4" />, color: "bg-pink-500" },
    settings_changed: { icon: <Settings className="h-4 w-4" />, color: "bg-gray-500" },
    file_uploaded: { icon: <Upload className="h-4 w-4" />, color: "bg-cyan-500" },
    integration_connected: { icon: <Link className="h-4 w-4" />, color: "bg-teal-500" },
  };
  return icons[type] || { icon: <Activity className="h-4 w-4" />, color: "bg-gray-500" };
};

interface ActivityFeedProps {
  compact?: boolean;
  limit?: number;
}

export function ActivityFeed({ compact = false, limit }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredActivities = activities
    .filter((a) => filter === "all" || !a.read)
    .slice(0, limit);

  const unreadCount = activities.filter((a) => !a.read).length;

  const handleMarkAllRead = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Aktivnost
              {unreadCount > 0 && (
                <Badge className="text-xs h-5 bg-primary">{unreadCount}</Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {filteredActivities.slice(0, 4).map((activity) => {
              const { icon, color } = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className={`flex items-center gap-2 py-1 ${
                    !activity.read ? "font-medium" : "opacity-70"
                  }`}
                >
                  <div className={`p-1 rounded-full ${color} text-white`}>
                    {icon}
                  </div>
                  <span className="text-xs truncate flex-1">{activity.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: false,
                      locale: hr,
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Aktivnost
            {unreadCount > 0 && (
              <Badge className="bg-primary">{unreadCount} novo</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  {filter === "all" ? "Sve" : "Nepročitano"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  Sve aktivnosti
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unread")}>
                  Samo nepročitano
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                Označi sve pročitanim
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-1">
            {filteredActivities.map((activity, index) => {
              const { icon, color } = getActivityIcon(activity.type);
              const showDate =
                index === 0 ||
                new Date(activity.timestamp).toDateString() !==
                  new Date(filteredActivities[index - 1].timestamp).toDateString();

              return (
                <div key={activity.id}>
                  {showDate && (
                    <div className="text-xs text-muted-foreground py-2 sticky top-0 bg-background">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: hr,
                      }).includes("manje")
                        ? "Danas"
                        : formatDistanceToNow(activity.timestamp, {
                            addSuffix: true,
                            locale: hr,
                          })}
                    </div>
                  )}
                  <div
                    className={`flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                      !activity.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleMarkRead(activity.id)}
                  >
                    <div className={`p-2 rounded-full ${color} text-white shrink-0`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${!activity.read ? "font-medium" : ""}`}
                        >
                          {activity.title}
                        </span>
                        {!activity.read && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDistanceToNow(activity.timestamp, {
                            addSuffix: true,
                            locale: hr,
                          })}
                        </span>
                        {activity.metadata?.sender && (
                          <span className="text-xs text-muted-foreground">
                            od {activity.metadata.sender}
                          </span>
                        )}
                        {activity.metadata?.recipient && (
                          <span className="text-xs text-muted-foreground">
                            za {activity.metadata.recipient}
                          </span>
                        )}
                        {activity.metadata?.label && (
                          <Badge variant="outline" className="text-xs h-5">
                            {activity.metadata.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Pogledaj detalje</DropdownMenuItem>
                        <DropdownMenuItem>
                          {activity.read ? "Označi nepročitanim" : "Označi pročitanim"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}

            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nema aktivnosti za prikaz</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;
