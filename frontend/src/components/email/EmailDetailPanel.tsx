import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Reply,
  ReplyAll,
  Forward,
  Star,
  StarOff,
  Archive,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EmailMessage } from "@/redux/features/email/emailApi";
import { QuickReplyPanel } from "./QuickReplyPanel";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

interface EmailDetailPanelProps {
  email: EmailMessage;
  onClose?: () => void;
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
  onStar?: (starred: boolean) => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onAnalyze?: () => void;
}

function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getPriorityConfig(priority: string) {
  switch (priority) {
    case "high":
      return { color: "bg-red-500", label: "HITNO", variant: "destructive" as const };
    case "normal":
      return { color: "bg-yellow-500", label: "VAŽNO", variant: "warning" as const };
    case "low":
      return { color: "bg-green-500", label: "NORMALNO", variant: "secondary" as const };
    default:
      return { color: "bg-gray-400", label: "", variant: "outline" as const };
  }
}

export function EmailDetailPanel({
  email,
  onClose,
  onReply,
  onReplyAll,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onAnalyze,
}: EmailDetailPanelProps) {
  const [showQuickReply, setShowQuickReply] = useState(false);
  const priorityConfig = getPriorityConfig(email.priority);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="font-semibold truncate max-w-md">{email.subject}</h2>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onReply} title="Odgovori">
            <Reply className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onReplyAll} title="Odgovori svima">
            <ReplyAll className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onForward} title="Proslijedi">
            <Forward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStar?.(!email.starred)}
            title={email.starred ? "Ukloni zvjezdicu" : "Dodaj zvjezdicu"}
          >
            {email.starred ? (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Arhiviraj
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Obriši
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {email.gmail_link && (
                <DropdownMenuItem onClick={() => window.open(email.gmail_link, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Otvori u Gmail-u
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Sender Info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(email.sender)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{email.sender}</span>
                <div className={`w-2 h-2 rounded-full ${priorityConfig.color}`} />
                {email.priority === "high" && (
                  <Badge variant="destructive" className="text-xs">
                    {priorityConfig.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(email.received_at), "d. MMMM yyyy. u HH:mm", { locale: hr })}
              </p>
            </div>
          </div>

          <Separator />

          {/* AI Analysis Section */}
          {email.ai_status === "completed" && (
            <div className="space-y-3">
              {/* AI Summary */}
              {email.summary && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">AI Sažetak</span>
                  </div>
                  <p className="text-sm">{email.summary}</p>
                </div>
              )}

              {/* Classification & Sentiment */}
              <div className="flex flex-wrap gap-2">
                {email.classification?.primary_category && (
                  <Badge variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {email.classification.primary_category}
                  </Badge>
                )}
                {email.classification?.subcategory && (
                  <Badge variant="secondary" className="text-xs">
                    {email.classification.subcategory}
                  </Badge>
                )}
                {email.sentiment?.tone && (
                  <Badge variant="outline" className="text-xs">
                    {email.sentiment.tone}
                  </Badge>
                )}
                {email.sentiment?.urgency_score !== undefined && email.sentiment.urgency_score > 7 && (
                  <Badge variant="destructive" className="gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    Hitno ({email.sentiment.urgency_score}/10)
                  </Badge>
                )}
              </div>

              {/* Action Steps */}
              {email.action_steps && email.action_steps.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Preporučene akcije
                  </div>
                  <div className="space-y-2">
                    {email.action_steps.map((action, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{action.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>~{action.estimated_time} min</span>
                            {action.timeline && <span>· {action.timeline}</span>}
                            {action.deadline && <span>· Rok: {action.deadline}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {action.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {email.recommendation?.text && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">AI Preporuka</span>
                  </div>
                  <p className="text-sm">{email.recommendation.text}</p>
                  {email.recommendation.reasoning && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {email.recommendation.reasoning}
                    </p>
                  )}
                  {email.recommendation.roi_estimate && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      ROI: {email.recommendation.roi_estimate}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pending AI Analysis */}
          {email.ai_status === "pending" && (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                Ovaj email još nije analiziran
              </p>
              <Button variant="outline" size="sm" onClick={onAnalyze}>
                <Sparkles className="h-4 w-4 mr-2" />
                Analiziraj sada
              </Button>
            </div>
          )}

          <Separator />

          {/* Email Body */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {email.html_analysis?.cleaned_text ? (
              <p className="whitespace-pre-wrap">{email.html_analysis.cleaned_text}</p>
            ) : (
              <p className="text-muted-foreground italic">
                Sadržaj emaila nije dostupan u ovom prikazu.
                {email.gmail_link && (
                  <Button
                    variant="link"
                    className="p-0 h-auto ml-1"
                    onClick={() => window.open(email.gmail_link, "_blank")}
                  >
                    Otvori u Gmail-u
                  </Button>
                )}
              </p>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Quick Reply */}
      {showQuickReply ? (
        <QuickReplyPanel
          emailId={email.id}
          to={email.sender}
          subject={email.subject}
          onClose={() => setShowQuickReply(false)}
          onExpandToFull={onReply}
        />
      ) : (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowQuickReply(true)}
          >
            <Reply className="h-4 w-4 mr-2" />
            Odgovori
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmailDetailPanel;
