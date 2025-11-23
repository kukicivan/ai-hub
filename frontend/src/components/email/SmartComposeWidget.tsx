import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sparkles,
  Wand2,
  Languages,
  CheckCircle,
  Lightbulb,
  Zap,
  Type,
  ArrowRight,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartComposeWidgetProps {
  currentText: string;
  emailContext?: {
    to?: string;
    subject?: string;
    replyTo?: {
      sender: string;
      content: string;
    };
  };
  onSuggestionAccept: (text: string) => void;
  className?: string;
}

interface Suggestion {
  id: string;
  type: "autocomplete" | "rephrase" | "tone" | "grammar";
  originalText?: string;
  suggestedText: string;
  confidence: number;
}

const toneSuggestions = [
  { id: "formal", label: "Formalno", icon: "👔" },
  { id: "friendly", label: "Prijateljski", icon: "😊" },
  { id: "professional", label: "Profesionalno", icon: "💼" },
  { id: "concise", label: "Sažeto", icon: "✂️" },
];

export function SmartComposeWidget({
  currentText,
  emailContext,
  onSuggestionAccept,
  className,
}: SmartComposeWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null);
  const [showToneOptions, setShowToneOptions] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  // Simulated AI suggestions based on context
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentText.length > 20 && currentText.endsWith(" ")) {
        // Simulate autocomplete suggestion
        const suggestions = [
          "i nadam se da vam ovo odgovara.",
          "molim vas javite mi ako imate dodatnih pitanja.",
          "srdačan pozdrav.",
          "hvala na razumijevanju.",
        ];
        const randomSuggestion =
          suggestions[Math.floor(Math.random() * suggestions.length)];

        setActiveSuggestion({
          id: Date.now().toString(),
          type: "autocomplete",
          suggestedText: randomSuggestion,
          confidence: 0.85,
        });
      } else {
        setActiveSuggestion(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentText]);

  const handleAcceptSuggestion = () => {
    if (activeSuggestion) {
      onSuggestionAccept(currentText + activeSuggestion.suggestedText);
      setActiveSuggestion(null);
    }
  };

  const handleToneChange = async (toneId: string) => {
    setSelectedTone(toneId);
    setIsLoading(true);
    setShowToneOptions(false);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated tone-adjusted text
    const toneAdjustedTexts: Record<string, string> = {
      formal:
        "Poštovani, zahvaljujem Vam se na Vašoj poruci. S poštovanjem,",
      friendly:
        "Hej! Hvala ti puno na poruci 😊 Javi se ako trebaš bilo što!",
      professional:
        "Zahvaljujem na vašoj poruci. Stojim na raspolaganju za sva dodatna pitanja.",
      concise: "Hvala. Potvrđujem primitak. Javim se uskoro.",
    };

    setActiveSuggestion({
      id: Date.now().toString(),
      type: "tone",
      originalText: currentText,
      suggestedText: toneAdjustedTexts[toneId] || currentText,
      confidence: 0.9,
    });

    setIsLoading(false);
  };

  const handleImproveWriting = async () => {
    setIsLoading(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setActiveSuggestion({
      id: Date.now().toString(),
      type: "rephrase",
      originalText: currentText,
      suggestedText: currentText + " [Poboljšana verzija teksta]",
      confidence: 0.88,
    });

    setIsLoading(false);
  };

  const handleGenerateReply = async () => {
    if (!emailContext?.replyTo) return;
    setIsLoading(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedReply = `Poštovani ${emailContext.replyTo.sender},

Zahvaljujem Vam se na Vašoj poruci.

U vezi s Vašim upitom, želim Vas obavijestiti da sam primio/la Vaš email i razmotrit ću sadržaj u najkraćem mogućem roku.

Javit ću Vam se s detaljnijim odgovorom.

Srdačan pozdrav`;

    setActiveSuggestion({
      id: Date.now().toString(),
      type: "autocomplete",
      suggestedText: generatedReply,
      confidence: 0.92,
    });

    setIsLoading(false);
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    // In a real app, send feedback to improve AI
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleRegenerate = () => {
    if (activeSuggestion) {
      // Trigger regeneration
      if (activeSuggestion.type === "tone" && selectedTone) {
        handleToneChange(selectedTone);
      } else if (activeSuggestion.type === "rephrase") {
        handleImproveWriting();
      } else if (emailContext?.replyTo) {
        handleGenerateReply();
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Quick action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <TooltipProvider>
          {/* Generate Reply (if replying) */}
          {emailContext?.replyTo && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateReply}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                  )}
                  Generiraj odgovor
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI će generirati odgovor na temelju konteksta</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Improve Writing */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImproveWriting}
                disabled={isLoading || currentText.length < 10}
              >
                <Wand2 className="h-4 w-4 mr-1" />
                Poboljšaj
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Poboljšaj gramatiku i stil</p>
            </TooltipContent>
          </Tooltip>

          {/* Tone Selector */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowToneOptions(!showToneOptions)}
                >
                  <Languages className="h-4 w-4 mr-1" />
                  Ton
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Prilagodi ton poruke</p>
              </TooltipContent>
            </Tooltip>

            {showToneOptions && (
              <Card className="absolute top-full mt-1 left-0 z-10 p-2 min-w-[160px]">
                <div className="space-y-1">
                  {toneSuggestions.map((tone) => (
                    <Button
                      key={tone.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleToneChange(tone.id)}
                    >
                      <span className="mr-2">{tone.icon}</span>
                      {tone.label}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Active suggestion */}
      {activeSuggestion && (
        <Card className="p-3 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  {activeSuggestion.type === "autocomplete" && "AI Prijedlog"}
                  {activeSuggestion.type === "rephrase" && "Poboljšana verzija"}
                  {activeSuggestion.type === "tone" && "Prilagođen ton"}
                  {activeSuggestion.type === "grammar" && "Gramatička ispravka"}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(activeSuggestion.confidence * 100)}% sigurnost
                </Badge>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">
                {activeSuggestion.suggestedText}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleRegenerate}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  feedback === "up" && "text-green-500"
                )}
                onClick={() => handleFeedback("up")}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  feedback === "down" && "text-red-500"
                )}
                onClick={() => handleFeedback("down")}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleAcceptSuggestion}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Prihvati
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSuggestion(null)}
            >
              Odbaci
            </Button>
            <span className="text-xs text-muted-foreground ml-auto">
              Tab za prihvaćanje
            </span>
          </div>
        </Card>
      )}

      {/* Inline autocomplete hint */}
      {activeSuggestion?.type === "autocomplete" && !showToneOptions && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>
            Pritisnite <kbd className="px-1 py-0.5 bg-muted rounded">Tab</kbd>{" "}
            za prihvaćanje prijedloga
          </span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>AI generira prijedlog...</span>
        </div>
      )}
    </div>
  );
}

// Compact inline suggestion component
interface InlineSuggestionProps {
  suggestion: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export function InlineSuggestion({
  suggestion,
  onAccept,
  onDismiss,
}: InlineSuggestionProps) {
  return (
    <span className="inline-flex items-center">
      <span className="text-muted-foreground/50 italic">{suggestion}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 px-1 ml-1"
        onClick={onAccept}
      >
        <ArrowRight className="h-3 w-3" />
      </Button>
    </span>
  );
}

export default SmartComposeWidget;
