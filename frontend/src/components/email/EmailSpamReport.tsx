import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Ban,
  Shield,
  AlertCircle,
  Send,
  Loader2,
  CheckCircle,
  Mail,
  User,
  Link2,
  DollarSign,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EmailSpamReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: {
    id: string;
    from: string;
    subject: string;
  };
  onReport: (report: SpamReport) => void;
}

interface SpamReport {
  emailId: string;
  reason: string;
  additionalDetails: string;
  blockSender: boolean;
  reportToProvider: boolean;
}

const spamReasons = [
  {
    id: "phishing",
    label: "Phishing / Prijevara",
    description: "Email pokušava ukrasti osobne podatke ili lozinke",
    icon: Lock,
    severity: "high",
  },
  {
    id: "scam",
    label: "Prijevara / Scam",
    description: "Lažna obećanja, nagrade ili financijske prijevare",
    icon: DollarSign,
    severity: "high",
  },
  {
    id: "malware",
    label: "Zlonamjerni sadržaj",
    description: "Sumnjivi privici ili linkovi na malware",
    icon: AlertTriangle,
    severity: "critical",
  },
  {
    id: "spam",
    label: "Neželjeni spam",
    description: "Reklamni sadržaj koji nisam tražio",
    icon: Mail,
    severity: "medium",
  },
  {
    id: "impersonation",
    label: "Lažno predstavljanje",
    description: "Netko se predstavlja kao osoba ili tvrtka koju nije",
    icon: User,
    severity: "high",
  },
  {
    id: "suspicious_link",
    label: "Sumnjive poveznice",
    description: "Email sadrži sumnjive ili skraćene URL-ove",
    icon: Link2,
    severity: "medium",
  },
];

export function EmailSpamReport({
  open,
  onOpenChange,
  email,
  onReport,
}: EmailSpamReportProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [blockSender, setBlockSender] = useState(true);
  const [reportToProvider, setReportToProvider] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const report: SpamReport = {
      emailId: email.id,
      reason: selectedReason,
      additionalDetails,
      blockSender,
      reportToProvider,
    };

    onReport(report);
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      onOpenChange(false);
      setIsSuccess(false);
      setSelectedReason("");
      setAdditionalDetails("");
      setBlockSender(true);
      setReportToProvider(true);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "";
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Prijava poslana</h3>
            <p className="text-center text-muted-foreground">
              Hvala na prijavi. Vaša prijava pomaže u zaštiti drugih korisnika.
              {blockSender && " Pošiljatelj je blokiran."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Prijavi spam ili prijetnju
          </DialogTitle>
          <DialogDescription>
            Prijavite sumnjivi email kako biste zaštitili sebe i druge korisnike
          </DialogDescription>
        </DialogHeader>

        {/* Email info */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="text-muted-foreground">Od:</span>{" "}
            <span className="font-medium">{email.from}</span>
          </p>
          <p className="text-sm truncate">
            <span className="text-muted-foreground">Predmet:</span>{" "}
            {email.subject}
          </p>
        </div>

        {/* Reason selection */}
        <div className="space-y-3">
          <Label>Razlog prijave</Label>
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            <div className="grid gap-2">
              {spamReasons.map((reason) => {
                const Icon = reason.icon;
                const isSelected = selectedReason === reason.id;
                return (
                  <label
                    key={reason.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      isSelected
                        ? getSeverityColor(reason.severity)
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <RadioGroupItem value={reason.id} className="sr-only" />
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        isSelected
                          ? "bg-white dark:bg-gray-800"
                          : "bg-background"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          reason.severity === "critical" && "text-red-500",
                          reason.severity === "high" && "text-orange-500",
                          reason.severity === "medium" && "text-yellow-500"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{reason.label}</span>
                        {reason.severity === "critical" && (
                          <Badge variant="destructive" className="text-[10px]">
                            Kritično
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {reason.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Additional details */}
        <div className="space-y-2">
          <Label>Dodatni detalji (opcionalno)</Label>
          <Textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Opišite zašto mislite da je ovaj email spam ili prijetnja..."
            rows={3}
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="block"
              checked={blockSender}
              onCheckedChange={(checked) => setBlockSender(checked as boolean)}
            />
            <Label htmlFor="block" className="cursor-pointer">
              <span>Blokiraj pošiljatelja</span>
              <p className="text-xs text-muted-foreground font-normal">
                Nećete više primati emailove od ovog pošiljatelja
              </p>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="report"
              checked={reportToProvider}
              onCheckedChange={(checked) =>
                setReportToProvider(checked as boolean)
              }
            />
            <Label htmlFor="report" className="cursor-pointer">
              <span>Prijavi pružatelju usluge</span>
              <p className="text-xs text-muted-foreground font-normal">
                Podijelite prijavu s email pružateljima za globalnu zaštitu
              </p>
            </Label>
          </div>
        </div>

        {/* Warning for critical */}
        {selectedReason &&
          spamReasons.find((r) => r.id === selectedReason)?.severity ===
            "critical" && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-700 dark:text-red-300">
                    Upozorenje o sigurnosti
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                    Ako ste kliknuli na bilo koji link ili preuzeli privitak,
                    preporučujemo promjenu lozinki i provjeru antivirusnim
                    programom.
                  </p>
                </div>
              </div>
            </div>
          )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Odustani
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Prijavljujem...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Prijavi email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EmailSpamReport;
