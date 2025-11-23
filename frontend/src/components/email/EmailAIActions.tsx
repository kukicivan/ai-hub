import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Wand2,
  FileText,
  Languages,
  Calendar,
  CheckSquare,
  Loader2,
  ChevronDown,
  Brain,
  Zap,
} from "lucide-react";
import { useAnalyzeMessageMutation } from "@/redux/features/email/emailApi";
import { useToast } from "@/hooks/useToast";

interface EmailAIActionsProps {
  emailId: number;
  aiStatus: string;
  onActionComplete?: () => void;
  variant?: "button" | "dropdown" | "inline";
}

const aiActions = [
  {
    id: "analyze",
    label: "Analiziraj email",
    description: "Pokreni AI analizu",
    icon: Brain,
  },
  {
    id: "summarize",
    label: "Generiši sažetak",
    description: "Kratki pregled sadržaja",
    icon: FileText,
  },
  {
    id: "translate",
    label: "Prevedi",
    description: "Prevedi na hrvatski",
    icon: Languages,
  },
  {
    id: "extract_tasks",
    label: "Izvuci zadatke",
    description: "Pronađi action items",
    icon: CheckSquare,
  },
  {
    id: "schedule",
    label: "Pronađi datume",
    description: "Izvuci važne datume",
    icon: Calendar,
  },
  {
    id: "generate_reply",
    label: "Generiši odgovor",
    description: "AI draft odgovora",
    icon: Wand2,
  },
];

export function EmailAIActions({
  emailId,
  aiStatus,
  onActionComplete,
  variant = "dropdown",
}: EmailAIActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const toast = useToast();
  const [analyzeMessage] = useAnalyzeMessageMutation();

  const handleAction = async (actionId: string) => {
    setIsProcessing(true);
    setCurrentAction(actionId);

    try {
      if (actionId === "analyze") {
        await analyzeMessage(emailId).unwrap();
        toast.success("Email je uspješno analiziran");
      } else {
        // Placeholder for other AI actions
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.info("Ova funkcionalnost će biti uskoro dostupna", {
          description: `Akcija: ${aiActions.find((a) => a.id === actionId)?.label}`,
        });
      }
      onActionComplete?.();
    } catch {
      toast.error("Greška pri izvršavanju akcije");
    } finally {
      setIsProcessing(false);
      setCurrentAction(null);
    }
  };

  const isAnalyzed = aiStatus === "completed";
  const isPending = aiStatus === "pending";

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("analyze")}
        disabled={isProcessing || isAnalyzed}
        className="gap-2"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isAnalyzed ? "Analizirano" : isPending ? "Analiziraj" : "AI"}
      </Button>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap gap-2">
        {aiActions.slice(0, 4).map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={() => handleAction(action.id)}
            disabled={isProcessing}
            className="gap-1 text-xs"
          >
            {isProcessing && currentAction === action.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <action.icon className="h-3 w-3" />
            )}
            {action.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          AI Akcije
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Asistent
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {aiActions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => handleAction(action.id)}
            disabled={isProcessing}
            className="flex items-start gap-3 py-2"
          >
            <action.icon className="h-4 w-4 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-sm">{action.label}</div>
              <div className="text-xs text-muted-foreground">
                {action.description}
              </div>
            </div>
            {action.id === "analyze" && isAnalyzed && (
              <Badge variant="secondary" className="text-xs">
                ✓
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EmailAIActions;
