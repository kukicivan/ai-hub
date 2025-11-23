import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Brain,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Key,
  Settings2,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface AISettings {
  // Analysis Settings
  autoAnalyze: boolean;
  analysisDepth: "basic" | "standard" | "deep";
  priorityThreshold: number;
  sentimentEnabled: boolean;
  actionDetection: boolean;

  // Response Settings
  smartReplies: boolean;
  replyTone: "professional" | "friendly" | "formal" | "casual";
  autoSuggest: boolean;

  // Integration Settings
  provider: "grok" | "openai" | "anthropic";
  apiKey: string;

  // Privacy Settings
  localProcessing: boolean;
  dataRetention: number;
  anonymization: boolean;

  // Business Goals
  businessGoals: string;
}

export function AISettingsPanel() {
  const toast = useToast();
  const [settings, setSettings] = useState<AISettings>({
    autoAnalyze: true,
    analysisDepth: "standard",
    priorityThreshold: 7,
    sentimentEnabled: true,
    actionDetection: true,
    smartReplies: true,
    replyTone: "professional",
    autoSuggest: true,
    provider: "grok",
    apiKey: "",
    localProcessing: false,
    dataRetention: 30,
    anonymization: false,
    businessGoals: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Postavke spremljene");
  };

  const handleTestConnection = async () => {
    if (!settings.apiKey) {
      toast.error("Unesite API ključ");
      return;
    }
    toast.success("Veza uspješno testirana");
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI analiza
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Automatska analiza</Label>
              <p className="text-xs text-muted-foreground">
                Automatski analiziraj nove emailove
              </p>
            </div>
            <Switch
              checked={settings.autoAnalyze}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoAnalyze: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Dubina analize</Label>
            <Select
              value={settings.analysisDepth}
              onValueChange={(value: AISettings["analysisDepth"]) =>
                setSettings({ ...settings, analysisDepth: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Osnovna - brzo, minimalni tokeni</SelectItem>
                <SelectItem value="standard">Standardna - balansirano</SelectItem>
                <SelectItem value="deep">Detaljna - sveobuhvatno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Prag prioriteta</Label>
              <span className="text-sm text-muted-foreground">
                {settings.priorityThreshold}/10
              </span>
            </div>
            <Slider
              value={[settings.priorityThreshold]}
              onValueChange={([value]) =>
                setSettings({ ...settings, priorityThreshold: value })
              }
              max={10}
              min={1}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Emailovi s prioritetom iznad {settings.priorityThreshold} bit će označeni kao hitni
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Analiza sentimenta</Label>
              <p className="text-xs text-muted-foreground">
                Detektiraj ton i emocije u emailovima
              </p>
            </div>
            <Switch
              checked={settings.sentimentEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, sentimentEnabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Detekcija akcija</Label>
              <p className="text-xs text-muted-foreground">
                Automatski identificiraj zadatke i rokove
              </p>
            </div>
            <Switch
              checked={settings.actionDetection}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, actionDetection: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Smart Replies Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Pametni odgovori
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Omogući pametne odgovore</Label>
              <p className="text-xs text-muted-foreground">
                AI generira prijedloge odgovora
              </p>
            </div>
            <Switch
              checked={settings.smartReplies}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, smartReplies: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Ton odgovora</Label>
            <Select
              value={settings.replyTone}
              onValueChange={(value: AISettings["replyTone"]) =>
                setSettings({ ...settings, replyTone: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Profesionalno</SelectItem>
                <SelectItem value="friendly">Prijateljski</SelectItem>
                <SelectItem value="formal">Formalno</SelectItem>
                <SelectItem value="casual">Opušteno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Automatski prijedlozi</Label>
              <p className="text-xs text-muted-foreground">
                Prikaži prijedloge dok čitaš email
              </p>
            </div>
            <Switch
              checked={settings.autoSuggest}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoSuggest: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* API Provider Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-5 w-5 text-primary" />
            API provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Provider</Label>
            <Select
              value={settings.provider}
              onValueChange={(value: AISettings["provider"]) =>
                setSettings({ ...settings, provider: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grok">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Grok (xAI)
                  </div>
                </SelectItem>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    OpenAI
                  </div>
                </SelectItem>
                <SelectItem value="anthropic">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Anthropic (Claude)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">API ključ</Label>
            <div className="flex gap-2">
              <Input
                type={apiKeyVisible ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder={settings.provider === "grok" ? "xai-..." : "sk-..."}
              />
              <Button
                variant="outline"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
              >
                {apiKeyVisible ? "Sakrij" : "Prikaži"}
              </Button>
            </div>
          </div>

          <Button variant="outline" onClick={handleTestConnection}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Testiraj vezu
          </Button>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <p className="text-xs text-muted-foreground">
              API veza aktivna. Preostalo kredita: ~$47.50
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Privatnost i sigurnost
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Lokalno procesiranje</Label>
              <p className="text-xs text-muted-foreground">
                Obradi osjetljive podatke lokalno kada je moguće
              </p>
            </div>
            <Switch
              checked={settings.localProcessing}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, localProcessing: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Zadržavanje podataka</Label>
            <Select
              value={settings.dataRetention.toString()}
              onValueChange={(value) =>
                setSettings({ ...settings, dataRetention: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dana</SelectItem>
                <SelectItem value="30">30 dana</SelectItem>
                <SelectItem value="90">90 dana</SelectItem>
                <SelectItem value="365">1 godina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Anonimizacija</Label>
              <p className="text-xs text-muted-foreground">
                Ukloni osobne podatke prije slanja na AI
              </p>
            </div>
            <Switch
              checked={settings.anonymization}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, anonymization: checked })
              }
            />
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Napomena o privatnosti
              </span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              AI analiza zahtijeva slanje sadržaja emaila vanjskim servisima.
              Preporučujemo uključenje anonimizacije za osjetljive podatke.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Goals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5 text-primary" />
            Poslovni ciljevi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Definirajte svoje ciljeve</Label>
            <Textarea
              value={settings.businessGoals}
              onChange={(e) =>
                setSettings({ ...settings, businessGoals: e.target.value })
              }
              placeholder="Npr: Fokusirati se na prodajne prilike, brže odgovarati VIP klijentima, automatizirati rutinske odgovore..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              AI će koristiti ove ciljeve za prioritizaciju i preporuke
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Spremanje...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Spremi postavke
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default AISettingsPanel;
