import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Reply,
  ReplyAll,
  Forward,
  Star,
  StarOff,
  Archive,
  Trash2,
  MoreHorizontal,
  Paperclip,
  ExternalLink,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmailMessage } from "@/redux/features/email/emailApi";
import { format, formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";

interface ThreadMessage extends EmailMessage {
  isExpanded?: boolean;
}

interface EmailThreadViewProps {
  messages: EmailMessage[];
  isLoading?: boolean;
  onReply?: (messageId: number) => void;
  onReplyAll?: (messageId: number) => void;
  onForward?: (messageId: number) => void;
  onStar?: (messageId: number, starred: boolean) => void;
  onArchive?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  onOpenInGmail?: (gmailLink: string) => void;
}

function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "normal":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
}

function ThreadMessageItem({
  message,
  isFirst,
  isLast,
  onReply,
  onReplyAll,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onOpenInGmail,
}: {
  message: ThreadMessage;
  isFirst: boolean;
  isLast: boolean;
  onReply?: (messageId: number) => void;
  onReplyAll?: (messageId: number) => void;
  onForward?: (messageId: number) => void;
  onStar?: (messageId: number, starred: boolean) => void;
  onArchive?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  onOpenInGmail?: (gmailLink: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(isLast);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div
        className={`border rounded-lg ${isExpanded ? "bg-background" : "bg-muted/30"} ${
          message.unread ? "border-l-4 border-l-blue-500" : ""
        }`}
      >
        {/* Collapsed Header */}
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm">
                {getInitials(message.sender)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium truncate ${message.unread ? "text-foreground" : "text-muted-foreground"}`}>
                  {message.sender}
                </span>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`} />
                {message.starred && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              {!isExpanded && (
                <p className="text-sm text-muted-foreground truncate">
                  {message.summary || message.subject}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {formatDistanceToNow(new Date(message.received_at), {
                  addSuffix: true,
                  locale: hr,
                })}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Expanded Content */}
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* Email Metadata */}
            <div className="flex items-start justify-between text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Od:</span>
                  <span className="font-medium">{message.sender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {format(new Date(message.received_at), "d. MMMM yyyy. u HH:mm", { locale: hr })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onReply?.(message.id)}
                  title="Odgovori"
                >
                  <Reply className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onReplyAll?.(message.id)}
                  title="Odgovori svima"
                >
                  <ReplyAll className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onForward?.(message.id)}
                  title="Proslijedi"
                >
                  <Forward className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onStar?.(message.id, !message.starred)}
                  title={message.starred ? "Ukloni zvjezdicu" : "Dodaj zvjezdicu"}
                >
                  {message.starred ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onArchive?.(message.id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Arhiviraj
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(message.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Obriši
                    </DropdownMenuItem>
                    {message.gmail_link && (
                      <DropdownMenuItem onClick={() => onOpenInGmail?.(message.gmail_link)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Otvori u Gmail-u
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* AI Analysis Badge */}
            {message.ai_status === "completed" && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {message.classification?.primary_category || "Nekategorizirano"}
                </Badge>
                {message.sentiment && (
                  <Badge variant="secondary" className="text-xs">
                    {message.sentiment.tone}
                  </Badge>
                )}
                {message.recommendation?.priority_level && (
                  <Badge
                    variant={
                      message.recommendation.priority_level === "high"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {message.recommendation.priority_level === "high" ? "HITNO" : "VAŽNO"}
                  </Badge>
                )}
              </div>
            )}

            {/* Email Summary */}
            {message.summary && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  AI Sažetak
                </div>
                <p className="text-sm">{message.summary}</p>
              </div>
            )}

            {/* Email Body (if available from html_analysis) */}
            {message.html_analysis?.cleaned_text && (
              <div className="border-t pt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{message.html_analysis.cleaned_text}</p>
                </div>
              </div>
            )}

            {/* Action Steps */}
            {message.action_steps && message.action_steps.length > 0 && (
              <div className="border-t pt-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Preporučene akcije
                </div>
                <div className="space-y-2">
                  {message.action_steps.slice(0, 3).map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{action.type}</span>
                          {action.timeline && <span>· {action.timeline}</span>}
                          {action.deadline && <span>· Rok: {action.deadline}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ~{action.estimated_time} min
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {message.recommendation?.text && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                  AI Preporuka
                </div>
                <p className="text-sm">{message.recommendation.text}</p>
                {message.recommendation.reasoning && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.recommendation.reasoning}
                  </p>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function EmailThreadView({
  messages,
  isLoading,
  onReply,
  onReplyAll,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onOpenInGmail,
}: EmailThreadViewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nema poruka u niti
        </CardContent>
      </Card>
    );
  }

  // Sort messages by date (oldest first for thread view)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.received_at).getTime() - new Date(b.received_at).getTime()
  );

  const threadSubject = sortedMessages[0].subject;
  const participantCount = new Set(sortedMessages.map((m) => m.sender)).size;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{threadSubject}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {messages.length} poruka{messages.length > 1 ? "e" : "a"} · {participantCount}{" "}
              sudionik{participantCount > 1 ? "a" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onReply?.(sortedMessages[sortedMessages.length - 1].id)}>
              <Reply className="h-4 w-4 mr-2" />
              Odgovori
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {sortedMessages.map((message, index) => (
          <ThreadMessageItem
            key={message.id}
            message={message}
            isFirst={index === 0}
            isLast={index === sortedMessages.length - 1}
            onReply={onReply}
            onReplyAll={onReplyAll}
            onForward={onForward}
            onStar={onStar}
            onArchive={onArchive}
            onDelete={onDelete}
            onOpenInGmail={onOpenInGmail}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default EmailThreadView;
