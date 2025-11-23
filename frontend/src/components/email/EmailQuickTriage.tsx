import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Archive,
  Trash2,
  Clock,
  Star,
  Tag,
  Reply,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Inbox,
  Sparkles,
  Zap,
  SkipForward,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  snippet: string;
  date: Date;
  priority: "critical" | "high" | "medium" | "low";
  aiSummary?: string;
  suggestedAction?: "reply" | "archive" | "snooze" | "delete";
  labels?: string[];
}

interface EmailQuickTriageProps {
  emails: Email[];
  onAction: (emailId: string, action: string) => void;
  onComplete: () => void;
  className?: string;
}

type TriageAction = "archive" | "delete" | "snooze" | "star" | "reply" | "skip";

const mockEmails: Email[] = [
  {
    id: "1",
    from: { name: "Marko Horvat", email: "marko@company.com" },
    subject: "Hitan zahtjev - Kvartalni izvještaj",
    snippet: "Poštovani, trebamo hitno ažurirati kvartalni izvještaj. Možete li...",
    date: new Date(Date.now() - 1000 * 60 * 30),
    priority: "critical",
    aiSummary: "Hitan zahtjev za ažuriranje kvartalnog izvještaja",
    suggestedAction: "reply",
  },
  {
    id: "2",
    from: { name: "Newsletter", email: "newsletter@tech.com" },
    subject: "Tjedni pregled tehnoloških vijesti",
    snippet: "Ovaj tjedan u tehnologiji: nove AI značajke, cybersecurity...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    priority: "low",
    aiSummary: "Tjedni newsletter s tehnološkim vijestima",
    suggestedAction: "archive",
    labels: ["newsletter"],
  },
  {
    id: "3",
    from: { name: "Ana Kovač", email: "ana@partner.hr" },
    subject: "Re: Suradnja na projektu",
    snippet: "Hvala na odgovoru! Slažem se s prijedlogom i možemo...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 4),
    priority: "high",
    aiSummary: "Potvrda suradnje na projektu, čeka se potvrda termina",
    suggestedAction: "reply",
  },
  {
    id: "4",
    from: { name: "Support", email: "support@service.com" },
    subject: "Vaš ticket je zatvoren",
    snippet: "Vaš support ticket #12345 je uspješno zatvoren. Ako imate...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 6),
    priority: "low",
    aiSummary: "Obavijest o zatvaranju support ticketa",
    suggestedAction: "archive",
  },
  {
    id: "5",
    from: { name: "Ivan Perić", email: "ivan@client.hr" },
    subject: "Sastanak sutra u 14:00",
    snippet: "Potvrđujem dolazak na sastanak sutra. Molim da pripremite...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 8),
    priority: "medium",
    aiSummary: "Potvrda sastanka za sutra, zahtjev za pripremu prezentacije",
    suggestedAction: "snooze",
  },
];

const actionConfig: Record<
  TriageAction,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string; key: string }
> = {
  archive: { icon: Archive, label: "Arhiviraj", color: "bg-blue-500", key: "E" },
  delete: { icon: Trash2, label: "Obriši", color: "bg-red-500", key: "D" },
  snooze: { icon: Clock, label: "Odgodi", color: "bg-orange-500", key: "H" },
  star: { icon: Star, label: "Označi", color: "bg-yellow-500", key: "S" },
  reply: { icon: Reply, label: "Odgovori", color: "bg-green-500", key: "R" },
  skip: { icon: SkipForward, label: "Preskoči", color: "bg-gray-500", key: "→" },
};

const getPriorityConfig = (priority: Email["priority"]) => {
  switch (priority) {
    case "critical":
      return { icon: Flame, color: "text-red-500 bg-red-100", label: "Kritičan" };
    case "high":
      return { icon: AlertTriangle, color: "text-orange-500 bg-orange-100", label: "Visoki" };
    case "medium":
      return { icon: null, color: "text-yellow-500 bg-yellow-100", label: "Srednji" };
    case "low":
      return { icon: null, color: "text-gray-500 bg-gray-100", label: "Niski" };
  }
};

export function EmailQuickTriage({
  emails = mockEmails,
  onAction,
  onComplete,
  className,
}: EmailQuickTriageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right" | null>(null);
  const { toast } = useToast();

  const currentEmail = emails[currentIndex];
  const progress = (processedCount / emails.length) * 100;
  const isComplete = processedCount >= emails.length;

  const handleAction = useCallback(
    (action: TriageAction) => {
      if (isAnimating || isComplete) return;

      setIsAnimating(true);
      setAnimationDirection(action === "skip" ? "right" : "left");

      onAction(currentEmail.id, action);

      setTimeout(() => {
        setProcessedCount((prev) => prev + 1);
        if (currentIndex < emails.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
        setIsAnimating(false);
        setAnimationDirection(null);

        if (processedCount + 1 >= emails.length) {
          onComplete();
          toast({
            title: "Triage završen!",
            description: `Obradili ste ${emails.length} emailova`,
          });
        }
      }, 300);
    },
    [currentEmail, currentIndex, emails.length, isAnimating, isComplete, onAction, onComplete, processedCount, toast]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      switch (e.key.toLowerCase()) {
        case "e":
          handleAction("archive");
          break;
        case "d":
          handleAction("delete");
          break;
        case "h":
          handleAction("snooze");
          break;
        case "s":
          handleAction("star");
          break;
        case "r":
          handleAction("reply");
          break;
        case "arrowright":
          handleAction("skip");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAction, isComplete]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isComplete) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="py-12 text-center">
          <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 w-fit mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Inbox Zero!</h3>
          <p className="text-muted-foreground mb-4">
            Uspješno ste obradili {emails.length} emailova
          </p>
          <Button onClick={() => window.location.reload()}>
            <Inbox className="h-4 w-4 mr-2" />
            Natrag na inbox
          </Button>
        </CardContent>
      </Card>
    );
  }

  const priorityConfig = getPriorityConfig(currentEmail.priority);
  const PriorityIcon = priorityConfig.icon;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Brzi triage
          </CardTitle>
          <Badge variant="secondary">
            {processedCount + 1} / {emails.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Email card */}
        <div
          className={cn(
            "p-4 rounded-lg border bg-card transition-all duration-300",
            isAnimating && animationDirection === "left" && "opacity-0 -translate-x-full",
            isAnimating && animationDirection === "right" && "opacity-0 translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar>
              <AvatarImage src={currentEmail.from.avatar} />
              <AvatarFallback>{getInitials(currentEmail.from.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{currentEmail.from.name}</span>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", priorityConfig.color)}
                >
                  {PriorityIcon && <PriorityIcon className="h-3 w-3 mr-1" />}
                  {priorityConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentEmail.from.email}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(currentEmail.date, {
                addSuffix: true,
                locale: hr,
              })}
            </span>
          </div>

          {/* Subject */}
          <h4 className="font-semibold mb-2">{currentEmail.subject}</h4>

          {/* Snippet */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {currentEmail.snippet}
          </p>

          {/* AI Summary */}
          {currentEmail.aiSummary && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  AI Sažetak
                </span>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                {currentEmail.aiSummary}
              </p>
            </div>
          )}

          {/* Labels */}
          {currentEmail.labels && currentEmail.labels.length > 0 && (
            <div className="flex gap-1 mt-3">
              {currentEmail.labels.map((label) => (
                <Badge key={label} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested action */}
          {currentEmail.suggestedAction && (
            <div className="mt-3 pt-3 border-t flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">
                AI preporuka:{" "}
                <span className="font-medium">
                  {actionConfig[currentEmail.suggestedAction].label}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          {(["archive", "snooze", "delete"] as TriageAction[]).map((action) => {
            const config = actionConfig[action];
            const Icon = config.icon;
            const isSuggested = currentEmail.suggestedAction === action;

            return (
              <TooltipProvider key={action}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isSuggested ? "default" : "outline"}
                      className={cn(
                        "flex-col h-auto py-3",
                        isSuggested && config.color
                      )}
                      onClick={() => handleAction(action)}
                      disabled={isAnimating}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{config.label}</span>
                      <kbd className="text-[10px] text-muted-foreground mt-1">
                        {config.key}
                      </kbd>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {config.label} ({config.key})
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["star", "reply", "skip"] as TriageAction[]).map((action) => {
            const config = actionConfig[action];
            const Icon = config.icon;
            const isSuggested = currentEmail.suggestedAction === action;

            return (
              <TooltipProvider key={action}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isSuggested ? "default" : "outline"}
                      className={cn(
                        "flex-col h-auto py-3",
                        isSuggested && config.color
                      )}
                      onClick={() => handleAction(action)}
                      disabled={isAnimating}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{config.label}</span>
                      <kbd className="text-[10px] text-muted-foreground mt-1">
                        {config.key}
                      </kbd>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {config.label} ({config.key})
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Keyboard hint */}
        <p className="text-xs text-center text-muted-foreground">
          Koristite tipkovnicu za brže djelovanje
        </p>
      </CardContent>
    </Card>
  );
}

export default EmailQuickTriage;
