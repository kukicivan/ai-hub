import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Mail,
  FileText,
  Calendar,
  Target,
  MessageSquare,
  Lightbulb,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Wand2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "email" | "productivity" | "content" | "analysis";
  isLoading?: boolean;
}

interface AIResult {
  title: string;
  content: string;
  suggestions?: string[];
}

const quickActions: QuickAction[] = [
  {
    id: "summarize",
    label: "Sažetak inboxa",
    description: "AI sažetak nepročitanih emailova",
    icon: Mail,
    category: "email",
  },
  {
    id: "draft",
    label: "Generiraj odgovor",
    description: "Brzi odgovor na odabrani email",
    icon: MessageSquare,
    category: "email",
  },
  {
    id: "priorities",
    label: "Prioriteti danas",
    description: "Identificiraj najvažnije zadatke",
    icon: Target,
    category: "productivity",
  },
  {
    id: "schedule",
    label: "Optimiziraj raspored",
    description: "Prijedlozi za bolji time management",
    icon: Calendar,
    category: "productivity",
  },
  {
    id: "report",
    label: "Tjedni izvještaj",
    description: "Generiraj izvještaj produktivnosti",
    icon: FileText,
    category: "content",
  },
  {
    id: "insights",
    label: "Email insights",
    description: "Analiza trendova komunikacije",
    icon: TrendingUp,
    category: "analysis",
  },
  {
    id: "tips",
    label: "Produktivni savjeti",
    description: "Personalizirani savjeti za danas",
    icon: Lightbulb,
    category: "productivity",
  },
  {
    id: "templates",
    label: "Generiraj predložak",
    description: "AI predložak emaila za situaciju",
    icon: Wand2,
    category: "content",
  },
];

export function AIQuickActions() {
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAction = async (action: QuickAction) => {
    setIsProcessing(action.id);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock results based on action type
    const mockResults: Record<string, AIResult> = {
      summarize: {
        title: "Sažetak inboxa",
        content: `**12 nepročitanih emailova**

🔴 **Hitno (2)**
- CEO traži odobrenje budžeta do 15:00
- Klijent čeka odgovor na ponudu

🟡 **Važno (4)**
- Tim meeting sutra u 10:00 - potvrdi dolazak
- Novi dizajn spreman za review
- Faktura #2024-156 za plaćanje
- Partner predlaže proširenje suradnje

🟢 **Informativno (6)**
- 3 newsletter emaila
- 2 automatske obavijesti
- 1 potvrda registracije`,
        suggestions: [
          "Odgovori CEO-u prvo",
          "Zakaži vrijeme za review dizajna",
          "Potvrdi meeting",
        ],
      },
      draft: {
        title: "Generirani odgovor",
        content: `Poštovani,

Hvala vam na poruci i izraženoj zainteresiranosti.

S obzirom na vaš upit, predlažem da zakazažemo kratak sastanak kako bismo detaljnije razmotrili mogućnosti suradnje. Slobodan sam:
- Utorak 14:00-16:00
- Srijeda 10:00-12:00

Molim vas da potvrdite koji termin vam najviše odgovara.

Srdačan pozdrav`,
        suggestions: [
          "Dodaj više detalja o projektu",
          "Priloži portfolio",
          "Predloži video poziv",
        ],
      },
      priorities: {
        title: "Prioriteti za danas",
        content: `**Top 5 prioriteta:**

1. 🎯 **Odobri budžet** - Rok: 15:00
   CEO čeka vaše odobrenje za Q1 budžet

2. 📧 **Odgovori klijentu** - Čeka 2 dana
   Ponuda za projekt - potrebna odluka

3. 📅 **Potvrdi meeting** - Sutra 10:00
   Tim meeting za planning sprint

4. 📝 **Review dizajna** - Prioritet: Srednji
   Novi UI mockups čekaju feedback

5. 💰 **Plati fakturu** - Rok: Ovaj tjedan
   Faktura #2024-156 - 5.000 EUR`,
        suggestions: [
          "Fokusiraj se na prva 2 zadatka",
          "Delegiraj review dizajna",
          "Automatiziraj plaćanje faktura",
        ],
      },
      insights: {
        title: "Email Insights",
        content: `**Analiza zadnjih 7 dana:**

📊 **Volumen**
- Primljeno: 156 emailova (+12% vs prošli tjedan)
- Poslano: 45 emailova (-5%)
- Prosječno vrijeme odgovora: 2.3h

👥 **Top pošiljatelji**
1. team@company.hr (34)
2. client@partner.com (18)
3. newsletter@tech.io (15)

📈 **Trendovi**
- Povećan broj emailova od klijenata
- Brži odgovori na hitne poruke
- 15% manje vremena na emailima vs prošli mjesec

💡 **Preporuke**
- Razmotriti automatizirane odgovore za česta pitanja
- Unsubscribe od 3 neaktivna newslettera`,
      },
      tips: {
        title: "Produktivni savjeti",
        content: `**Personalizirani savjeti za danas:**

🌅 **Jutarnja rutina**
- Počnite s 2 najvažnija emaila prije 10:00
- Odgodite newslettere za pauzu

⏰ **Time blocking**
- 9-11: Duboki rad (bez emailova)
- 11-12: Email batch processing
- 14-15: Sastanci i pozivi

🎯 **Focus mode**
- Aktiviraj "Ne uznemiravaj" za kompleksne zadatke
- Koristi Pomodoro (25 min rad / 5 min pauza)

📧 **Email efikasnost**
- Koristi predloške za česte odgovore
- AI može generirati 80% vaših odgovora
- Arhiviraj sve nakon obrade`,
      },
    };

    setResult(mockResults[action.id] || {
      title: action.label,
      content: "AI je obradio vaš zahtjev. Rezultati su spremni.",
    });
    setIsProcessing(null);
    setShowResult(true);
  };

  const handleCopy = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      toast.success("Kopirano u međuspremnik");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryColor = (category: QuickAction["category"]) => {
    switch (category) {
      case "email":
        return "bg-blue-500";
      case "productivity":
        return "bg-green-500";
      case "content":
        return "bg-purple-500";
      case "analysis":
        return "bg-orange-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-yellow-500" />
          AI Brze akcije
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isLoading = isProcessing === action.id;

            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                disabled={isProcessing !== null}
                className="p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded ${getCategoryColor(action.category)} bg-opacity-20`}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Icon className={`h-4 w-4 ${getCategoryColor(action.category).replace('bg-', 'text-')}`} />
                    )}
                  </div>
                  <Sparkles className="h-3 w-3 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isLoading ? "Obrađujem..." : action.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">AI obrađuje vaš zahtjev...</span>
            </div>
            <Progress value={66} className="h-1" />
          </div>
        )}

        {/* Usage stats */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Prosječno vrijeme: 2-3s</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>47 AI akcija danas</span>
          </div>
        </div>
      </CardContent>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              {result?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">
              {result?.content}
            </div>

            {result?.suggestions && result.suggestions.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Prijedlozi:</p>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Kopirano
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Kopiraj
                </>
              )}
            </Button>
            <Button onClick={() => setShowResult(false)}>Zatvori</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AIQuickActions;
