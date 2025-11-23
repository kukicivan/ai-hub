import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
  Rocket,
  Mail,
  Key,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

interface OnboardingChecklistProps {
  onDismiss?: () => void;
  onStepComplete?: (stepId: string) => void;
}

export function OnboardingChecklist({
  onDismiss,
  onStepComplete,
}: OnboardingChecklistProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "profile",
      title: "Dopunite profil",
      description: "Dodajte svoje ime i avatar",
      icon: <Users className="h-5 w-5" />,
      completed: true,
      action: { label: "Uredi profil", href: "/profile" },
    },
    {
      id: "gmail",
      title: "Povežite Gmail",
      description: "Konfigurirajte Gmail Apps Script",
      icon: <Mail className="h-5 w-5" />,
      completed: false,
      action: { label: "Poveži", href: "/settings?tab=api-keys" },
    },
    {
      id: "api-key",
      title: "Dodajte API ključ",
      description: "Unesite Grok ili OpenAI API ključ",
      icon: <Key className="h-5 w-5" />,
      completed: false,
      action: { label: "Dodaj ključ", href: "/settings?tab=api-keys" },
    },
    {
      id: "goals",
      title: "Definirajte ciljeve",
      description: "Postavite poslovne ciljeve za AI analizu",
      icon: <Settings className="h-5 w-5" />,
      completed: false,
      action: { label: "Postavi ciljeve", href: "/settings?tab=goals" },
    },
    {
      id: "first-analysis",
      title: "Pokrenite prvu AI analizu",
      description: "Analizirajte prvi email s AI",
      icon: <Sparkles className="h-5 w-5" />,
      completed: false,
      action: { label: "Idi na inbox", href: "/inbox-v1" },
    },
  ]);

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepAction = (step: OnboardingStep) => {
    if (step.action?.onClick) {
      step.action.onClick();
    } else if (step.action?.href) {
      navigate(step.action.href);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed || progress === 100) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="h-5 w-5 text-primary" />
            Dobrodošli! Započnite s postavljanjem
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Napredak</span>
            <span className="font-medium">
              {completedSteps}/{steps.length} koraka
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                step.completed
                  ? "bg-green-50 dark:bg-green-900/10"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  step.completed ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {step.icon}
                  <span
                    className={`font-medium text-sm ${
                      step.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {!step.completed && step.action && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStepAction(step)}
                  className="flex-shrink-0"
                >
                  {step.action.label}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground text-center">
          Potrebna vam je pomoć?{" "}
          <Button variant="link" className="h-auto p-0 text-xs" onClick={() => navigate("/ai-help")}>
            Pogledajte vodič
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}

export default OnboardingChecklist;
