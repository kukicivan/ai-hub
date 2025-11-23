import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Send,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AIFeedbackWidgetProps {
  aiActionId: string;
  aiActionType: "summary" | "reply" | "categorization" | "priority" | "task_extraction";
  result?: string;
  onFeedbackSubmit?: (feedback: AIFeedback) => void;
  compact?: boolean;
  className?: string;
}

interface AIFeedback {
  actionId: string;
  actionType: string;
  rating: "positive" | "negative" | null;
  issue?: string;
  comment?: string;
}

const feedbackIssues = [
  { id: "inaccurate", label: "Netočno", icon: AlertCircle },
  { id: "irrelevant", label: "Nije relevantno", icon: HelpCircle },
  { id: "incomplete", label: "Nepotpuno", icon: AlertCircle },
  { id: "too_long", label: "Predugačko", icon: AlertCircle },
  { id: "too_short", label: "Prekratko", icon: AlertCircle },
  { id: "tone", label: "Krivi ton", icon: MessageSquare },
  { id: "other", label: "Ostalo", icon: MessageSquare },
];

export function AIFeedbackWidget({
  aiActionId,
  aiActionType,
  result,
  onFeedbackSubmit,
  compact = false,
  className,
}: AIFeedbackWidgetProps) {
  const [rating, setRating] = useState<"positive" | "negative" | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleRating = (newRating: "positive" | "negative") => {
    setRating(newRating);
    if (newRating === "negative") {
      setShowDetailDialog(true);
    } else {
      submitFeedback(newRating);
    }
  };

  const submitFeedback = async (feedbackRating: "positive" | "negative") => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const feedback: AIFeedback = {
      actionId: aiActionId,
      actionType: aiActionType,
      rating: feedbackRating,
      issue: selectedIssue || undefined,
      comment: comment || undefined,
    };

    onFeedbackSubmit?.(feedback);
    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowDetailDialog(false);

    toast({
      title: "Hvala na povratnoj informaciji!",
      description: "Vaš feedback pomaže poboljšati AI asistenta",
    });
  };

  const handleDetailSubmit = () => {
    submitFeedback("negative");
  };

  const getActionTypeLabel = () => {
    switch (aiActionType) {
      case "summary":
        return "AI Sažetak";
      case "reply":
        return "AI Odgovor";
      case "categorization":
        return "AI Kategorizacija";
      case "priority":
        return "AI Prioritet";
      case "task_extraction":
        return "AI Zadaci";
      default:
        return "AI Akcija";
    }
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground",
          className
        )}
      >
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span>Hvala na povratnoj informaciji!</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  rating === "positive" && "text-green-500 bg-green-50"
                )}
                onClick={() => handleRating("positive")}
                disabled={isSubmitting}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Koristan odgovor</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  rating === "negative" && "text-red-500 bg-red-50"
                )}
                onClick={() => handleRating("negative")}
                disabled={isSubmitting}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nije koristan</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Detail dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Što nije bilo dobro?</DialogTitle>
              <DialogDescription>
                Pomozite nam poboljšati AI odabravši problem
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 py-4">
              {feedbackIssues.map((issue) => {
                const Icon = issue.icon;
                return (
                  <Button
                    key={issue.id}
                    variant={selectedIssue === issue.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedIssue(issue.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {issue.label}
                  </Button>
                );
              })}
            </div>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Dodatni komentar (opcionalno)..."
              rows={3}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
              >
                Odustani
              </Button>
              <Button onClick={handleDetailSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Pošalji
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            {getActionTypeLabel()}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            AI generiran
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Result preview */}
        {result && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="line-clamp-3">{result}</p>
          </div>
        )}

        {/* Feedback buttons */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Je li ovo bilo korisno?
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant={rating === "positive" ? "default" : "outline"}
              size="sm"
              onClick={() => handleRating("positive")}
              disabled={isSubmitting}
              className={cn(
                rating === "positive" && "bg-green-500 hover:bg-green-600"
              )}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Da
            </Button>
            <Button
              variant={rating === "negative" ? "default" : "outline"}
              size="sm"
              onClick={() => handleRating("negative")}
              disabled={isSubmitting}
              className={cn(
                rating === "negative" && "bg-red-500 hover:bg-red-600"
              )}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Ne
            </Button>
          </div>
        </div>

        {/* Detail dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Što nije bilo dobro?</DialogTitle>
              <DialogDescription>
                Pomozite nam poboljšati AI odabravši problem
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 py-4">
              {feedbackIssues.map((issue) => {
                const Icon = issue.icon;
                return (
                  <Button
                    key={issue.id}
                    variant={selectedIssue === issue.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedIssue(issue.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {issue.label}
                  </Button>
                );
              })}
            </div>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Dodatni komentar (opcionalno)..."
              rows={3}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
              >
                Odustani
              </Button>
              <Button onClick={handleDetailSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Pošalji
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Inline feedback for simple thumbs up/down
interface InlineFeedbackProps {
  onFeedback: (positive: boolean) => void;
  className?: string;
}

export function InlineFeedback({ onFeedback, className }: InlineFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (positive: boolean) => {
    onFeedback(positive);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        Hvala! ✓
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => handleFeedback(true)}
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => handleFeedback(false)}
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  );
}

// AI performance stats card
interface AIPerformanceStatsProps {
  className?: string;
}

export function AIPerformanceStats({ className }: AIPerformanceStatsProps) {
  const stats = {
    totalFeedback: 1247,
    positiveRate: 94,
    improvementRate: 12,
    topFeatures: [
      { name: "Sažeci emaila", score: 96 },
      { name: "Prijedlozi odgovora", score: 92 },
      { name: "Kategorizacija", score: 89 },
    ],
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          AI Performanse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-500">
            {stats.positiveRate}%
          </span>
          <div className="text-right">
            <p className="text-sm font-medium">Zadovoljstvo</p>
            <p className="text-xs text-muted-foreground">
              +{stats.improvementRate}% ovaj mjesec
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {stats.topFeatures.map((feature) => (
            <div key={feature.name} className="flex items-center justify-between">
              <span className="text-sm">{feature.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${feature.score}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8">
                  {feature.score}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Bazirano na {stats.totalFeedback.toLocaleString()} povratnih informacija
        </p>
      </CardContent>
    </Card>
  );
}

export default AIFeedbackWidget;
