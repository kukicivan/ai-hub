import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMessagesQuery,
  useMarkAsReadMutation,
  useArchiveEmailMutation,
  EmailMessage,
} from "@/redux/features/email/emailApi";
import {
  Mail,
  Star,
  Archive,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bs } from "date-fns/locale";

// Priority indicator colors per SRS 4.2.2
const priorityConfig = {
  high: {
    color: "bg-red-500",
    badge: "destructive",
    label: "HITNO",
    description: "Odgovor danas",
  },
  normal: {
    color: "bg-yellow-500",
    badge: "warning",
    label: "VAŽNO",
    description: "Ova sedmica",
  },
  low: {
    color: "bg-green-500",
    badge: "secondary",
    label: "NORMALNO",
    description: "Može sačekati",
  },
} as const;

interface EmailCardProps {
  email: EmailMessage;
  onMarkAsRead: (id: number) => void;
  onArchive: (id: number) => void;
}

function EmailCard({ email, onMarkAsRead, onArchive }: EmailCardProps) {
  const priority = (email.priority as keyof typeof priorityConfig) || "normal";
  const config = priorityConfig[priority];

  return (
    <div
      className={`p-4 border rounded-lg hover:shadow-md transition-all ${
        email.unread ? "bg-background" : "bg-muted/30"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Priority Indicator */}
        <div className={`w-2 h-2 mt-2 rounded-full ${config.color} flex-shrink-0`} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium truncate">{email.sender}</span>
              {email.starred && <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
              {email.unread && (
                <Badge variant="outline" className="text-xs">
                  Novo
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatDistanceToNow(new Date(email.received_at), {
                addSuffix: true,
                locale: bs,
              })}
            </span>
          </div>

          {/* Subject */}
          <h4 className="font-semibold text-sm mb-1 truncate">{email.subject}</h4>

          {/* AI Summary */}
          {email.recommendation?.text && (
            <p className="text-xs text-primary mb-2 line-clamp-1">
              AI: "{email.recommendation.text}"
            </p>
          )}

          {/* Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {email.summary || email.html_analysis?.cleaned_text?.slice(0, 150)}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {email.unread && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(email.id)}
              >
                <Mail className="h-3 w-3 mr-1" />
                Pročitano
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onArchive(email.id)}
            >
              <Archive className="h-3 w-3 mr-1" />
              Arhiviraj
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto">
              Detalji
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start gap-3">
        <Skeleton className="w-2 h-2 mt-2 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PriorityInboxProps {
  limit?: number;
  showHighPriorityOnly?: boolean;
}

export function PriorityInbox({ limit = 5, showHighPriorityOnly = false }: PriorityInboxProps) {
  const { data, isLoading, error } = useGetMessagesQuery({
    per_page: limit,
    unread: true,
    priority: showHighPriorityOnly ? "high" : undefined,
    sort: "priority",
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [archiveEmail] = useArchiveEmailMutation();

  const emails = data?.data || [];

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveEmail(id).unwrap();
    } catch (error) {
      console.error("Failed to archive:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Prioritetni Inbox
        </CardTitle>
        <Button variant="ghost" size="sm">
          Vidi sve
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Priority Legend */}
        <div className="flex gap-4 text-xs text-muted-foreground pb-2 border-b">
          {Object.entries(priorityConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${cfg.color}`} />
              <span>{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Email List */}
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <EmailCardSkeleton key={i} />
            ))}
          </>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mr-2" />
            Greška pri učitavanju emailova
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mb-2 opacity-50" />
            <p>Nema nepročitanih emailova</p>
            <p className="text-xs">Svaka čast na organizaciji!</p>
          </div>
        ) : (
          emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onMarkAsRead={handleMarkAsRead}
              onArchive={handleArchive}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default PriorityInbox;
