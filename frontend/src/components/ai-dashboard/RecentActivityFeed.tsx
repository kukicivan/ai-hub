import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  Star,
  Sparkles,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";

type ActivityType =
  | "email_received"
  | "email_read"
  | "email_replied"
  | "email_archived"
  | "email_deleted"
  | "email_starred"
  | "ai_analyzed"
  | "task_completed";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Mock activities - would come from API
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "email_received",
    title: "Novi email primljen",
    description: "Od: client@company.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "2",
    type: "ai_analyzed",
    title: "AI analiza završena",
    description: "5 emailova analizirano",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "3",
    type: "email_replied",
    title: "Email odgovoren",
    description: "Odgovor poslan na: partner@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "4",
    type: "task_completed",
    title: "Zadatak završen",
    description: "Pregledaj novi ugovor",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "5",
    type: "email_archived",
    title: "Emailovi arhivirani",
    description: "3 emaila premješteno u arhivu",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "6",
    type: "email_starred",
    title: "Email označen zvjezdicom",
    description: "Važna ponuda od klijenta",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "7",
    type: "email_read",
    title: "Email pročitan",
    description: "Newsletter od TechCrunch",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
  },
];

function getActivityIcon(type: ActivityType) {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "email_received":
      return <Mail className={`${iconClass} text-blue-500`} />;
    case "email_read":
      return <MailOpen className={`${iconClass} text-gray-500`} />;
    case "email_replied":
      return <Reply className={`${iconClass} text-green-500`} />;
    case "email_archived":
      return <Archive className={`${iconClass} text-orange-500`} />;
    case "email_deleted":
      return <Trash2 className={`${iconClass} text-red-500`} />;
    case "email_starred":
      return <Star className={`${iconClass} text-yellow-500`} />;
    case "ai_analyzed":
      return <Sparkles className={`${iconClass} text-purple-500`} />;
    case "task_completed":
      return <CheckCircle className={`${iconClass} text-green-500`} />;
  }
}

function getActivityBadge(type: ActivityType) {
  switch (type) {
    case "email_received":
      return <Badge variant="outline" className="text-xs">Novo</Badge>;
    case "ai_analyzed":
      return <Badge variant="secondary" className="text-xs">AI</Badge>;
    case "task_completed":
      return <Badge className="text-xs bg-green-500">Završeno</Badge>;
    default:
      return null;
  }
}

export function RecentActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Nedavna aktivnost
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-1 p-4 pt-0">
            {mockActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                  index === 0 ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {activity.title}
                    </span>
                    {getActivityBadge(activity.type)}
                  </div>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(activity.timestamp, {
                    addSuffix: false,
                    locale: hr,
                  })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default RecentActivityFeed;
