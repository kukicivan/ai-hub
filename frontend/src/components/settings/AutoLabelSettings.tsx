import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Mail,
  User,
  Building,
  FileText,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wand2,
  Settings,
  Play,
  Pause,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AutoLabelRule {
  id: string;
  name: string;
  enabled: boolean;
  type: "ai" | "keyword" | "sender" | "domain";
  conditions: {
    field: string;
    operator: string;
    value: string;
  }[];
  labelId: string;
  labelName: string;
  labelColor: string;
  stats: {
    applied: number;
    lastApplied?: Date;
  };
}

interface EmailLabel {
  id: string;
  name: string;
  color: string;
}

const availableLabels: EmailLabel[] = [
  { id: "1", name: "Posao", color: "bg-blue-500" },
  { id: "2", name: "Osobno", color: "bg-green-500" },
  { id: "3", name: "Financije", color: "bg-yellow-500" },
  { id: "4", name: "Važno", color: "bg-red-500" },
  { id: "5", name: "Newsletter", color: "bg-purple-500" },
  { id: "6", name: "Računi", color: "bg-orange-500" },
  { id: "7", name: "Putovanja", color: "bg-cyan-500" },
];

const mockRules: AutoLabelRule[] = [
  {
    id: "1",
    name: "Fakture i računi",
    enabled: true,
    type: "ai",
    conditions: [{ field: "content", operator: "contains", value: "faktura|račun|invoice" }],
    labelId: "6",
    labelName: "Računi",
    labelColor: "bg-orange-500",
    stats: { applied: 156, lastApplied: new Date(Date.now() - 1000 * 60 * 30) },
  },
  {
    id: "2",
    name: "Newsletter pretplate",
    enabled: true,
    type: "keyword",
    conditions: [{ field: "subject", operator: "contains", value: "newsletter|pretplata|unsubscribe" }],
    labelId: "5",
    labelName: "Newsletter",
    labelColor: "bg-purple-500",
    stats: { applied: 234, lastApplied: new Date(Date.now() - 1000 * 60 * 5) },
  },
  {
    id: "3",
    name: "Banka i financije",
    enabled: true,
    type: "domain",
    conditions: [{ field: "from", operator: "domain", value: "@banka.hr|@pbz.hr|@zaba.hr" }],
    labelId: "3",
    labelName: "Financije",
    labelColor: "bg-yellow-500",
    stats: { applied: 89, lastApplied: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  },
  {
    id: "4",
    name: "Radni emailovi",
    enabled: false,
    type: "sender",
    conditions: [{ field: "from", operator: "domain", value: "@company.com" }],
    labelId: "1",
    labelName: "Posao",
    labelColor: "bg-blue-500",
    stats: { applied: 567 },
  },
];

export function AutoLabelSettings() {
  const [rules, setRules] = useState<AutoLabelRule[]>(mockRules);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoLabelRule | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [newRule, setNewRule] = useState({
    name: "",
    type: "keyword" as AutoLabelRule["type"],
    field: "subject",
    operator: "contains",
    value: "",
    labelId: "",
  });

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    toast({
      title: "Pravilo obrisano",
      description: "Pravilo automatskog označavanja je obrisano",
    });
  };

  const handleAddRule = () => {
    const label = availableLabels.find((l) => l.id === newRule.labelId);
    if (!label || !newRule.name || !newRule.value) return;

    const rule: AutoLabelRule = {
      id: Date.now().toString(),
      name: newRule.name,
      enabled: true,
      type: newRule.type,
      conditions: [
        {
          field: newRule.field,
          operator: newRule.operator,
          value: newRule.value,
        },
      ],
      labelId: label.id,
      labelName: label.name,
      labelColor: label.color,
      stats: { applied: 0 },
    };

    setRules((prev) => [...prev, rule]);
    setShowAddDialog(false);
    setNewRule({
      name: "",
      type: "keyword",
      field: "subject",
      operator: "contains",
      value: "",
      labelId: "",
    });

    toast({
      title: "Pravilo dodano",
      description: `Pravilo "${rule.name}" je aktivirano`,
    });
  };

  const handleRunNow = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast({
      title: "Obrada završena",
      description: "Pregledano 45 emailova, označeno 12 novih",
    });
  };

  const handleLearnFromHistory = async () => {
    toast({
      title: "AI učenje pokrenuto",
      description: "AI analizira vaše prethodne oznake za poboljšanje...",
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    toast({
      title: "Učenje završeno",
      description: "Otkrivena 3 nova uzorka za automatsko označavanje",
    });
  };

  const getRuleTypeIcon = (type: AutoLabelRule["type"]) => {
    switch (type) {
      case "ai":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case "keyword":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "sender":
        return <User className="h-4 w-4 text-green-500" />;
      case "domain":
        return <Building className="h-4 w-4 text-orange-500" />;
    }
  };

  const getRuleTypeLabel = (type: AutoLabelRule["type"]) => {
    switch (type) {
      case "ai":
        return "AI prepoznavanje";
      case "keyword":
        return "Ključne riječi";
      case "sender":
        return "Pošiljatelj";
      case "domain":
        return "Domena";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Auto-label Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>AI automatsko označavanje</CardTitle>
                <CardDescription>
                  AI automatski prepoznaje i označava emailove na temelju sadržaja
                </CardDescription>
              </div>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>
        </CardHeader>
        {aiEnabled && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRunNow}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Pokreni sada
              </Button>
              <Button variant="outline" onClick={handleLearnFromHistory}>
                <History className="h-4 w-4 mr-2" />
                Nauči iz povijesti
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Zadnja obrada: prije 15 minuta • 1,247 emailova označeno ovaj mjesec
            </p>
          </CardContent>
        )}
      </Card>

      {/* Rules List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Pravila označavanja
              </CardTitle>
              <CardDescription>
                Definirajte pravila za automatsko označavanje emailova
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo pravilo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo pravilo označavanja</DialogTitle>
                  <DialogDescription>
                    Kreirajte pravilo za automatsko označavanje emailova
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Naziv pravila</Label>
                    <Input
                      value={newRule.name}
                      onChange={(e) =>
                        setNewRule((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="npr. Fakture od dobavljača"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tip pravila</Label>
                    <Select
                      value={newRule.type}
                      onValueChange={(value: AutoLabelRule["type"]) =>
                        setNewRule((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keyword">Ključne riječi</SelectItem>
                        <SelectItem value="sender">Pošiljatelj</SelectItem>
                        <SelectItem value="domain">Domena</SelectItem>
                        <SelectItem value="ai">AI prepoznavanje</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Polje</Label>
                      <Select
                        value={newRule.field}
                        onValueChange={(value) =>
                          setNewRule((prev) => ({ ...prev, field: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subject">Predmet</SelectItem>
                          <SelectItem value="from">Pošiljatelj</SelectItem>
                          <SelectItem value="body">Sadržaj</SelectItem>
                          <SelectItem value="any">Bilo koji</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Operator</Label>
                      <Select
                        value={newRule.operator}
                        onValueChange={(value) =>
                          setNewRule((prev) => ({ ...prev, operator: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contains">Sadrži</SelectItem>
                          <SelectItem value="equals">Jednako</SelectItem>
                          <SelectItem value="starts">Počinje s</SelectItem>
                          <SelectItem value="ends">Završava s</SelectItem>
                          <SelectItem value="regex">Regex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Vrijednost</Label>
                    <Input
                      value={newRule.value}
                      onChange={(e) =>
                        setNewRule((prev) => ({ ...prev, value: e.target.value }))
                      }
                      placeholder="npr. faktura|račun|invoice"
                    />
                    <p className="text-xs text-muted-foreground">
                      Koristite | za više opcija (ili)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Oznaka</Label>
                    <Select
                      value={newRule.labelId}
                      onValueChange={(value) =>
                        setNewRule((prev) => ({ ...prev, labelId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Odaberi oznaku" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLabels.map((label) => (
                          <SelectItem key={label.id} value={label.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-3 h-3 rounded-full",
                                  label.color
                                )}
                              />
                              {label.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Odustani
                  </Button>
                  <Button onClick={handleAddRule}>Spremi pravilo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                rule.enabled ? "bg-background" : "bg-muted/50 opacity-60"
              )}
            >
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => handleToggleRule(rule.id)}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getRuleTypeIcon(rule.type)}
                  <span className="font-medium">{rule.name}</span>
                  <Badge
                    variant="outline"
                    className={cn("gap-1", rule.labelColor.replace("bg-", "text-"))}
                  >
                    <div className={cn("w-2 h-2 rounded-full", rule.labelColor)} />
                    {rule.labelName}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{getRuleTypeLabel(rule.type)}</span>
                  <span>•</span>
                  <span>{rule.stats.applied} označeno</span>
                  {rule.stats.lastApplied && (
                    <>
                      <span>•</span>
                      <span>
                        Zadnje: prije{" "}
                        {Math.round(
                          (Date.now() - rule.stats.lastApplied.getTime()) /
                            (1000 * 60)
                        )}{" "}
                        min
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingRule(rule)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Nema definiranih pravila</p>
              <p className="text-sm">Kliknite "Novo pravilo" za početak</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statistika označavanja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">1,046</div>
              <p className="text-sm text-muted-foreground">Ovaj mjesec</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">97%</div>
              <p className="text-sm text-muted-foreground">Točnost</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">4.2h</div>
              <p className="text-sm text-muted-foreground">Ušteđeno vrijeme</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AutoLabelSettings;
