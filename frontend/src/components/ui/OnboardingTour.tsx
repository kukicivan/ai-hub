import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Mail,
  Calendar,
  CheckSquare,
  Settings,
  Keyboard,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Lightbulb,
  Target,
  Rocket,
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tip?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Dobrodošli u AI Productivity Hub!",
    description:
      "Vaš osobni asistent za upravljanje emailovima, zadacima i rasporedom. Počnimo s kratkim upoznavanjem glavnih značajki.",
    icon: <Rocket className="h-12 w-12 text-primary" />,
  },
  {
    id: "inbox",
    title: "Pametni Inbox",
    description:
      "AI automatski sortira vaše emailove po prioritetu. Najvažnije poruke uvijek su na vrhu, dok se manje važne grupiraju.",
    icon: <Mail className="h-12 w-12 text-blue-500" />,
    tip: "Pritisnite 'G' pa 'I' za brzi pristup inboxu",
  },
  {
    id: "ai-features",
    title: "AI značajke",
    description:
      "Generirajte odgovore, sažetke i prijedloge jednim klikom. AI vam pomaže napisati profesionalne emailove brže nego ikad.",
    icon: <Sparkles className="h-12 w-12 text-purple-500" />,
    tip: "Ctrl+Shift+A za AI sažetak odabranog emaila",
  },
  {
    id: "calendar",
    title: "Integrirani kalendar",
    description:
      "Sinkronizirajte kalendar s emailovima. AI prepoznaje datume i automatski predlaže dodavanje događaja.",
    icon: <Calendar className="h-12 w-12 text-orange-500" />,
    tip: "Pritisnite 'G' pa 'C' za kalendar",
  },
  {
    id: "tasks",
    title: "Upravljanje zadacima",
    description:
      "Pretvorite emailove u zadatke jednim klikom. Pratite rokove i prioritete na jednom mjestu.",
    icon: <CheckSquare className="h-12 w-12 text-green-500" />,
    tip: "Pritisnite 'T' na emailu za kreiranje zadatka",
  },
  {
    id: "shortcuts",
    title: "Tipkovnički prečaci",
    description:
      "Ubrzajte rad s desecima prečaca. Pritisnite '?' bilo kada za popis svih dostupnih prečaca.",
    icon: <Keyboard className="h-12 w-12 text-indigo-500" />,
    tip: "C - novi email, R - odgovori, E - arhiviraj",
  },
  {
    id: "settings",
    title: "Personalizirajte iskustvo",
    description:
      "Prilagodite izgled, obavijesti i AI postavke prema vašim potrebama. Sve je potpuno konfigurirano.",
    icon: <Settings className="h-12 w-12 text-gray-500" />,
  },
  {
    id: "complete",
    title: "Spremni ste za početak!",
    description:
      "To je sve osnove. Istražite aplikaciju i otkrijte još mnogo korisnih značajki. Sretan rad!",
    icon: <Target className="h-12 w-12 text-emerald-500" />,
    action: {
      label: "Započni",
      onClick: () => {},
    },
  },
];

interface OnboardingTourProps {
  open?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

export function OnboardingTour({
  open = false,
  onClose,
  onComplete,
}: OnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    setHasSeenTour(true);
    onClose?.();
  };

  const handleComplete = () => {
    setIsOpen(false);
    setHasSeenTour(true);
    onComplete?.();
  };

  return (
    <>
      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Korak {currentStep + 1} od {tourSteps.length}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleSkip}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="py-6">
            {/* Progress */}
            <Progress value={progress} className="h-1 mb-8" />

            {/* Content */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">{step.icon}</div>
              <DialogTitle className="text-xl">{step.title}</DialogTitle>
              <p className="text-muted-foreground">{step.description}</p>

              {step.tip && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>{step.tip}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" onClick={handleSkip}>
              Preskoči vodič
            </Button>

            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button variant="outline" onClick={handlePrev}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Nazad
                </Button>
              )}
              <Button onClick={handleNext}>
                {isLastStep ? (
                  <>
                    <Zap className="h-4 w-4 mr-1" />
                    Završi
                  </>
                ) : (
                  <>
                    Dalje
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step Dots */}
          <div className="flex justify-center gap-1 pt-4">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                }`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Start Tour Button (when tour was closed/skipped) */}
      {!isOpen && !hasSeenTour && (
        <Card className="fixed bottom-4 right-4 z-50 shadow-lg animate-in slide-in-from-bottom-5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Upoznajte aplikaciju</p>
                <p className="text-xs text-muted-foreground">
                  Kratki vodič kroz značajke
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setCurrentStep(0);
                  setIsOpen(true);
                }}
              >
                Pokreni
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setHasSeenTour(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default OnboardingTour;
