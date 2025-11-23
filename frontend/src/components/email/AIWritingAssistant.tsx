import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Wand2,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  MessageSquare,
  FileText,
  Zap,
  Settings2,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

type WritingTone = "professional" | "friendly" | "formal" | "casual" | "persuasive";
type WritingAction = "improve" | "shorten" | "expand" | "translate" | "fix_grammar" | "simplify";

interface AIWritingAssistantProps {
  initialText?: string;
  onApply?: (text: string) => void;
}

const tones: { value: WritingTone; label: string }[] = [
  { value: "professional", label: "Profesionalno" },
  { value: "friendly", label: "Prijateljski" },
  { value: "formal", label: "Formalno" },
  { value: "casual", label: "Opušteno" },
  { value: "persuasive", label: "Uvjerljivo" },
];

const actions: { value: WritingAction; label: string; icon: React.ReactNode }[] = [
  { value: "improve", label: "Poboljšaj", icon: <Sparkles className="h-4 w-4" /> },
  { value: "shorten", label: "Skrati", icon: <Zap className="h-4 w-4" /> },
  { value: "expand", label: "Proširi", icon: <FileText className="h-4 w-4" /> },
  { value: "fix_grammar", label: "Ispravi gramatiku", icon: <Check className="h-4 w-4" /> },
  { value: "simplify", label: "Pojednostavi", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "translate", label: "Prevedi na engleski", icon: <ArrowRight className="h-4 w-4" /> },
];

// Simulated AI suggestions - in production would come from API
const generateSuggestion = (text: string, action: WritingAction, tone: WritingTone): string => {
  // This is mock data - real implementation would call AI API
  const suggestions: Record<WritingAction, string> = {
    improve: `Poštovani,\n\nHvala vam na vašoj poruci. S zadovoljstvom ćemo razmotriti vašu ponudu i javiti vam se s detaljima u najkraćem mogućem roku.\n\nSrdačan pozdrav`,
    shorten: `Hvala na poruci. Razmotriti ćemo ponudu i javiti se uskoro.`,
    expand: `Poštovani,\n\nSrdačno vam zahvaljujemo na vašoj poruci i interesovanju za naše usluge.\n\nS velikim zadovoljstvom ćemo detaljno razmotriti vašu ponudu. Naš tim će analizirati sve aspekte i pripremiti odgovor koji će odgovoriti na sva vaša pitanja.\n\nMolimo vas za malo strpljenja dok provodimo analizu. Očekujemo da ćemo vam se javiti u roku od 2-3 radna dana s detaljnim informacijama.\n\nUkoliko imate bilo kakvih dodatnih pitanja u međuvremenu, slobodno nas kontaktirajte.\n\nSrdačan pozdrav i lijep dan vam želimo`,
    fix_grammar: text,
    simplify: `Poštovani,\n\nHvala na poruci. Razmotriti ćemo vašu ponudu i javiti vam se uskoro.\n\nPozdrav`,
    translate: `Dear Sir/Madam,\n\nThank you for your message. We will be happy to review your offer and get back to you with details as soon as possible.\n\nBest regards`,
  };
  return suggestions[action] || text;
};

export function AIWritingAssistant({ initialText = "", onApply }: AIWritingAssistantProps) {
  const toast = useToast();
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState("");
  const [selectedTone, setSelectedTone] = useState<WritingTone>("professional");
  const [selectedAction, setSelectedAction] = useState<WritingAction>("improve");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Unesite tekst za obradu");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const suggestion = generateSuggestion(inputText, selectedAction, selectedTone);
    setOutputText(suggestion);
    setIsLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Kopirano u međuspremnik");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (outputText && onApply) {
      onApply(outputText);
      toast.success("Tekst primijenjen");
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Asistent za pisanje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Vaš tekst</span>
            <span className="text-xs text-muted-foreground">
              {inputText.length} znakova
            </span>
          </div>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Unesite tekst koji želite poboljšati..."
            rows={4}
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[150px]">
            <span className="text-xs text-muted-foreground mb-1 block">Akcija</span>
            <Select value={selectedAction} onValueChange={(v: WritingAction) => setSelectedAction(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    <div className="flex items-center gap-2">
                      {action.icon}
                      {action.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <span className="text-xs text-muted-foreground mb-1 block">Ton</span>
            <Select value={selectedTone} onValueChange={(v: WritingTone) => setSelectedTone(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {actions.slice(0, 4).map((action) => (
            <Button
              key={action.value}
              variant={selectedAction === action.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedAction(action.value);
                handleGenerate();
              }}
              className="h-8 text-xs"
            >
              {action.icon}
              <span className="ml-1">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !inputText.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              AI procesira...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generiraj prijedlog
            </>
          )}
        </Button>

        {/* Output */}
        {outputText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI prijedlog</span>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI generirano
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{outputText}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex-1"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Kopirano" : "Kopiraj"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regeneriraj
              </Button>
              {onApply && (
                <Button size="sm" onClick={handleApply}>
                  <Check className="h-4 w-4 mr-2" />
                  Primijeni
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">Savjeti</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Upišite kratak nacrt i AI će ga proširiti</li>
            <li>Odaberite ton koji odgovara primatelju</li>
            <li>Koristite "Pojednostavi" za jasnije poruke</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIWritingAssistant;
